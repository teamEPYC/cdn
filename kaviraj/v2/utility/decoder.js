// ==== utils (inline) ====
function assert(condition, message) {
  if (!condition) {
    throw new Error(message ?? "Assertion failed");
  }
}

// ==== imports from mediabunny ====
import { EncodedPacketSink, Input, ALL_FORMATS, UrlSource } from "https://cdn.jsdelivr.net/npm/mediabunny@1.24.2/+esm";

// ==== FrameDecoder ====
const BUFFER_RANGE = 1_000_000;
const FORWARD_THRESHOLD_RANGE = 200_000;
const BACKWARD_THRESHOLD_RANGE = 300_000;
const BACKWARD_BUFFER_INTERSECT = 8;

export class FrameDecoder {
  constructor() {
    this.encodedChunks = [];
    this.frameBuffer = new Map();
    this.decoderQueue = new Map();
    this.decoder = null;

    this.forwardIndex = null;
    this.backwardIndex = null;

    this.duration = 0;
    this.onError = null;
    this.seekQueue = [];
    this.seeking = false;

    this.currentTimestamp = 0;
    this.loading = false;

    this.canvas = null;
    this.ctx = null;
    this.lastDrawnTimestamp = null;
  }

  drawFrame(ctx, width, height) {
    if (!this.canvas || !this.ctx) return;
    let minDiff = Infinity;
    let bestFrame = null;

    for (const [timestamp, frame] of this.frameBuffer) {
      const diff = Math.abs(timestamp - this.currentTimestamp);
      if (diff < minDiff) {
        minDiff = diff;
        bestFrame = frame;
      }
    }

    if (bestFrame && bestFrame.timestamp !== this.lastDrawnTimestamp) {
      this.ctx.drawImage(bestFrame, 0, 0, bestFrame.codedWidth, bestFrame.codedHeight);
      this.lastDrawnTimestamp = bestFrame.timestamp;
    }

    ctx.drawImage(this.canvas, 0, 0, width, height);
  }

  findClosestChunkIndex(timestamp) {
    let minDiff = Infinity;
    let bestIndex = 0;
    for (let i = 0; i < this.encodedChunks.length; i++) {
      const diff = Math.abs(timestamp - this.encodedChunks[i].timestamp);
      if (diff < minDiff) {
        minDiff = diff;
        bestIndex = i;
      }
    }
    return bestIndex;
  }

  findClosestKeyFrameIndex(timestamp) {
    const index = this.findClosestChunkIndex(timestamp);
    for (let i = index; i >= 0; i--) {
      if (this.encodedChunks[i].type === "key") return i;
    }
    return 0;
  }

  seek(fraction) {
    if (this.frameBuffer.size === 0) return;
    this.seekQueue.push(fraction);
    if (!this.seeking) this.processQueue();
  }

  async processQueue() {
    try {
      this.seeking = true;
      while (this.seekQueue.length > 0) {
        const fraction = this.seekQueue.length > 3
          ? this.seekQueue.pop()
          : this.seekQueue.shift();
        if (fraction === undefined) continue;
        if (this.seekQueue.length > 3) this.seekQueue = [];
        await this.dequeueSeek(fraction);
      }
    } finally {
      this.seeking = false;
    }
  }

  async dequeueSeek(fraction) {
    const nextTimestamp = Math.floor(this.duration * Math.max(0, Math.min(1, fraction)));
    const prevTimestamp = this.currentTimestamp;
    const timestamps = [...this.frameBuffer.keys(), ...this.decoderQueue.keys()];
    
    const upperBound = Math.max(...timestamps);
    const lowerBound = Math.min(...timestamps);
    const outOfBounds = nextTimestamp < lowerBound || nextTimestamp > upperBound + BUFFER_RANGE / 2;
    const lowerBoundDiff = nextTimestamp - lowerBound;
    const upperBoundDiff = upperBound - nextTimestamp;
    
    let startIndex = null;
    let endIndex = null;
    const promises = [];

    if (outOfBounds) {
      endIndex = this.findClosestChunkIndex(nextTimestamp + BUFFER_RANGE);
      startIndex = this.findClosestKeyFrameIndex(nextTimestamp - BUFFER_RANGE);
      this.decodeChunks(startIndex, endIndex);

      if (this.forwardIndex !== null) {
        this.forwardIndex = endIndex;
        this.backwardIndex = null;
      } else if (this.backwardIndex !== null) {
        this.backwardIndex = startIndex;
        this.forwardIndex = null;
      }

      const closestChunkIndex = this.findClosestChunkIndex(nextTimestamp);
      const closestChunk = this.encodedChunks[closestChunkIndex];
      promises.push(this.decoderQueue.get(closestChunk.timestamp)?.promise);

    } else if (nextTimestamp < prevTimestamp && lowerBoundDiff < BACKWARD_THRESHOLD_RANGE && lowerBound > 0) {

      this.forwardIndex = null;
      startIndex = this.findClosestKeyFrameIndex(nextTimestamp - BUFFER_RANGE);

      if (this.backwardIndex === null) {
        endIndex = this.findClosestChunkIndex(upperBound) + BACKWARD_BUFFER_INTERSECT;
      } else {
        endIndex = this.backwardIndex + BACKWARD_BUFFER_INTERSECT;
      }

      if (endIndex !== startIndex + BACKWARD_BUFFER_INTERSECT) {
        this.decodeChunks(startIndex, endIndex);
        this.backwardIndex = startIndex;
        promises.push(this.decoderQueue.get(this.encodedChunks[startIndex].timestamp)?.promise);
      }

    } else if (nextTimestamp > prevTimestamp && upperBoundDiff < FORWARD_THRESHOLD_RANGE && upperBound < this.duration) {

      this.backwardIndex = null;
      endIndex = this.findClosestChunkIndex(nextTimestamp + BUFFER_RANGE);

      startIndex = this.forwardIndex === null
        ? this.findClosestKeyFrameIndex(lowerBound)
        : this.forwardIndex + 1;

      this.decodeChunks(startIndex, endIndex);
      this.forwardIndex = endIndex;

      const firstChunk = this.encodedChunks[startIndex];
      if (firstChunk && this.decoderQueue.has(firstChunk.timestamp)) {
        await this.decoderQueue.get(firstChunk.timestamp)?.promise;
      }

      if (endIndex === this.encodedChunks.length - 1) {
        promises.push(this.decoder.flush());
      }
    }

    await Promise.all(promises);
    this.currentTimestamp = nextTimestamp;
  }

  decodeChunks(startIndex, endIndex) {
    for (let i = startIndex; i <= endIndex; i++) {
      this.decodeChunkAt(i);
    }
  }

  decodeChunkAt(index) {
    index = Math.min(Math.max(0, index), this.encodedChunks.length - 1);
    const chunk = this.encodedChunks[index];

    const promiseObj = {};
    promiseObj.promise = new Promise(res => promiseObj.resolve = res);

    this.decoderQueue.set(chunk.timestamp, promiseObj);
    this.decoder.decode(chunk);
  }

  destroy() {
    this.frameBuffer.forEach(f => f.close());
    this.frameBuffer.clear();
    this.encodedChunks = [];
    this.decoderQueue.clear();
    this.decoder.close();
    this.decoder = null;
    this.forwardIndex = 0;
    this.backwardIndex = null;
    this.lastDrawnTimestamp = null;
  }

  frameCallback(frame) {
    const p = this.decoderQueue.get(frame.timestamp);
    if (p) p.resolve();
    this.decoderQueue.delete(frame.timestamp);

    const lowerBound = this.currentTimestamp - BUFFER_RANGE;
    const upperBound = this.currentTimestamp + BUFFER_RANGE;

    for (const f of this.frameBuffer.values()) {
      if (f.timestamp <= lowerBound || f.timestamp > upperBound) {
        this.frameBuffer.delete(f.timestamp);
        f.close();
      }
    }

    if (!this.frameBuffer.has(frame.timestamp)) {
      this.frameBuffer.set(frame.timestamp, frame);
    } else {
      frame.close();
    }
  }

  async init(url) {
    if (this.loading) return;
    this.loading = true;

    const decoder = new VideoDecoder({
      output: this.frameCallback.bind(this),
      error: console.error
    });

    const input = new Input({
      source: new UrlSource(url),
      formats: ALL_FORMATS
    });

    const videoTrack = await input.getPrimaryVideoTrack();
    assert(videoTrack, "No video track found");

    this.canvas = new OffscreenCanvas(videoTrack.codedWidth, videoTrack.codedHeight);
    this.ctx = this.canvas.getContext("2d");

    this.duration = Math.floor((await videoTrack.computeDuration()) * 1_000_000);

    const config = await videoTrack.getDecoderConfig();
    assert(config, "No decoder config found");
    decoder.configure(config);

    this.decoder = decoder;
    this.encodedChunks = [];
    this.forwardIndex = 0;
    this.backwardIndex = null;

    const sink = new EncodedPacketSink(videoTrack);

    //loader values
    let totalPackets = 0;
    const preloaderProgress = document.querySelector('.k-preloader-progress');
    preloaderProgress.style.transition = "transform 0.2s ease-out";

    for await (const packet of sink.packets()) {
      const chunk = packet.toEncodedVideoChunk();
      this.encodedChunks.push(chunk);
      
      // loader logic
      totalPackets++;
      const progress = totalPackets / 931 * 100;
      preloaderProgress.style.transform = `scaleX(${progress / 50})`;
      //console.log(progress);

      if(parseInt(progress) == 50){
        setTimeout(() => {
            document.querySelector('.k-preloader-progress-track').classList.add('hide');
        }, 250);
        setTimeout(() => {
            document.querySelector('.k-preloader .k-stroke-button').classList.remove('hide');
        }, 1000);
      }

      if (chunk.timestamp <= BUFFER_RANGE) {
        this.decodeChunkAt(this.forwardIndex);
        this.forwardIndex++;
      }
    }

    this.loading = false;
  }
}
