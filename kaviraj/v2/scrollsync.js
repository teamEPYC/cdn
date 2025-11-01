var ScrollSync = (() => {
    var rr = Object.defineProperty;
    var Xi = Object.getOwnPropertyDescriptor;
    var Zi = Object.getOwnPropertyNames;
    var Yi = Object.prototype.hasOwnProperty;
    var Ji = (t, e) => {
            for (var r in e) rr(t, r, { get: e[r], enumerable: !0 });
        },
        en = (t, e, r, i) => {
            if ((e && typeof e == "object") || typeof e == "function")
                for (let n of Zi(e))
                    !Yi.call(t, n) &&
                        n !== r &&
                        rr(t, n, { get: () => e[n], enumerable: !(i = Xi(e, n)) || i.enumerable });
            return t;
        };
    var tn = (t) => en(rr({}, "__esModule", { value: !0 }), t);
    var Dn = {};
    Ji(Dn, { FrameDecoder: () => Hr });
    function p(t) {
        if (!t) throw new Error("Assertion failed.");
    }
    var ht = (t) => {
            let e = ((t % 360) + 360) % 360;
            if (e === 0 || e === 90 || e === 180 || e === 270) return e;
            throw new Error(`Invalid rotation ${t}.`);
        },
        G = (t) => t && t[t.length - 1];
    var N = class t {
            constructor(e) {
                (this.bytes = e), (this.pos = 0);
            }
            seekToByte(e) {
                this.pos = 8 * e;
            }
            readBit() {
                let e = Math.floor(this.pos / 8),
                    r = this.bytes[e] ?? 0,
                    i = 7 - (this.pos & 7),
                    n = (r & (1 << i)) >> i;
                return this.pos++, n;
            }
            readBits(e) {
                if (e === 1) return this.readBit();
                let r = 0;
                for (let i = 0; i < e; i++) (r <<= 1), (r |= this.readBit());
                return r;
            }
            writeBits(e, r) {
                let i = this.pos + e;
                for (let n = this.pos; n < i; n++) {
                    let a = Math.floor(n / 8),
                        s = this.bytes[a],
                        o = 7 - (n & 7);
                    (s &= ~(1 << o)), (s |= ((r & (1 << (i - n - 1))) >> (i - n - 1)) << o), (this.bytes[a] = s);
                }
                this.pos = i;
            }
            readAlignedByte() {
                if (this.pos % 8 !== 0) throw new Error("Bitstream is not byte-aligned.");
                let e = this.pos / 8,
                    r = this.bytes[e] ?? 0;
                return (this.pos += 8), r;
            }
            skipBits(e) {
                this.pos += e;
            }
            getBitsLeft() {
                return this.bytes.length * 8 - this.pos;
            }
            clone() {
                let e = new t(this.bytes);
                return (e.pos = this.pos), e;
            }
        },
        C = (t) => {
            let e = 0;
            for (; t.readBits(1) === 0 && e < 32; ) e++;
            if (e >= 32) throw new Error("Invalid exponential-Golomb code.");
            return (1 << e) - 1 + t.readBits(e);
        },
        De = (t) => {
            let e = C(t);
            return (e & 1) === 0 ? -(e >> 1) : (e + 1) >> 1;
        };
    var mt = (t) =>
            t.constructor === Uint8Array
                ? t
                : t instanceof ArrayBuffer
                  ? new Uint8Array(t)
                  : new Uint8Array(t.buffer, t.byteOffset, t.byteLength),
        O = (t) =>
            t.constructor === DataView
                ? t
                : t instanceof ArrayBuffer
                  ? new DataView(t)
                  : new DataView(t.buffer, t.byteOffset, t.byteLength),
        H = new TextDecoder(),
        ir = new TextEncoder();
    var nr = (t) => Object.fromEntries(Object.entries(t).map(([e, r]) => [r, e])),
        sr = { bt709: 1, bt470bg: 5, smpte170m: 6, bt2020: 9, smpte432: 12 },
        pt = nr(sr),
        ar = { bt709: 1, smpte170m: 6, linear: 8, "iec61966-2-1": 13, pq: 16, hlg: 18 },
        gt = nr(ar),
        or = { rgb: 0, bt709: 1, bt470bg: 5, smpte170m: 6, "bt2020-ncl": 9 },
        kt = nr(or);
    var ne = class {
            constructor() {
                this.currentPromise = Promise.resolve();
            }
            async acquire() {
                let e,
                    r = new Promise((n) => {
                        e = n;
                    }),
                    i = this.currentPromise;
                return (this.currentPromise = r), await i, e;
            }
        },
        cr = (t) => [...t].map((e) => e.toString(16).padStart(2, "0")).join(""),
        lr = (t) => (
            (t = ((t >> 1) & 1431655765) | ((t & 1431655765) << 1)),
            (t = ((t >> 2) & 858993459) | ((t & 858993459) << 2)),
            (t = ((t >> 4) & 252645135) | ((t & 252645135) << 4)),
            (t = ((t >> 8) & 16711935) | ((t & 16711935) << 8)),
            (t = ((t >> 16) & 65535) | ((t & 65535) << 16)),
            t >>> 0
        ),
        Fe = (t, e, r) => {
            let i = 0,
                n = t.length - 1,
                a = -1;
            for (; i <= n; ) {
                let s = (i + n) >> 1,
                    o = r(t[s]);
                o === e ? ((a = s), (n = s - 1)) : o < e ? (i = s + 1) : (n = s - 1);
            }
            return a;
        },
        F = (t, e, r) => {
            let i = 0,
                n = t.length - 1,
                a = -1;
            for (; i <= n; ) {
                let s = (i + (n - i + 1) / 2) | 0;
                r(t[s]) <= e ? ((a = s), (i = s + 1)) : (n = s - 1);
            }
            return a;
        };
    var xe = () => {
        let t, e;
        return {
            promise: new Promise((i, n) => {
                (t = i), (e = n);
            }),
            resolve: t,
            reject: e,
        };
    };
    var ur = (t, e) => {
            for (let r = t.length - 1; r >= 0; r--) if (e(t[r])) return t[r];
        },
        bt = (t, e) => {
            for (let r = t.length - 1; r >= 0; r--) if (e(t[r])) return r;
            return -1;
        };
    var de = (t) => {
            throw new Error(`Unexpected value: ${t}`);
        },
        Je = (t, e, r) => {
            let i = t.getUint8(e),
                n = t.getUint8(e + 1),
                a = t.getUint8(e + 2);
            return r ? i | (n << 8) | (a << 16) : (i << 16) | (n << 8) | a;
        };
    var dr = (t, e, r) => Math.max(e, Math.min(r, t)),
        q = "und",
        Te = (t, e) => {
            let r = 10 ** e;
            return Math.round(t * r) / r;
        },
        Wr = (t, e) => Math.round(t / e) * e,
        jr = (t) => {
            let e = 0;
            for (; t; ) e++, (t >>= 1);
            return e;
        },
        rn = /^[a-z]{3}$/,
        St = (t) => rn.test(t),
        fr = 1e6 * (1 + Number.EPSILON),
        hr = (t, e) => {
            let r = { ...t, ...e };
            if (t.headers || e.headers) {
                let i = t.headers ? qr(t.headers) : {},
                    n = e.headers ? qr(e.headers) : {},
                    a = { ...i };
                Object.entries(n).forEach(([s, o]) => {
                    let c = Object.keys(a).find((l) => l.toLowerCase() === s.toLowerCase());
                    c && delete a[c], (a[s] = o);
                }),
                    (r.headers = a);
            }
            return r;
        },
        qr = (t) => {
            if (t instanceof Headers) {
                let e = {};
                return (
                    t.forEach((r, i) => {
                        e[i] = r;
                    }),
                    e
                );
            }
            if (Array.isArray(t)) {
                let e = {};
                return (
                    t.forEach(([r, i]) => {
                        e[r] = i;
                    }),
                    e
                );
            }
            return t;
        },
        mr = async (t, e, r, i) => {
            let n = 0;
            for (;;)
                try {
                    return await t(e, r);
                } catch (a) {
                    n++;
                    let s = i(n, a, e);
                    if (s === null) throw a;
                    if ((console.error("Retrying failed fetch. Error:", a), !Number.isFinite(s) || s < 0))
                        throw new TypeError("Retry delay must be a non-negative finite number.");
                    s > 0 && (await new Promise((o) => setTimeout(o, 1e3 * s)));
                }
        };
    var we = (t, e) => (t !== -1 ? t : e),
        xt = (t, e, r, i) => t <= i && r <= e;
    var Kr = (t) => {
        let e = atob(t),
            r = new Uint8Array(e.length);
        for (let i = 0; i < e.length; i++) r[i] = e.charCodeAt(i);
        return r;
    };
    var Gr = () => {
            Symbol.dispose ??= Symbol("Symbol.dispose");
        },
        Tt = (t) => typeof t == "number" && !Number.isNaN(t);
    var fe = class {
            constructor(e, r) {
                if (((this.data = e), (this.mimeType = r), !(e instanceof Uint8Array)))
                    throw new TypeError("data must be a Uint8Array.");
                if (typeof r != "string") throw new TypeError("mimeType must be a string.");
            }
        },
        wt = class {
            constructor(e, r, i, n) {
                if (
                    ((this.data = e),
                    (this.mimeType = r),
                    (this.name = i),
                    (this.description = n),
                    !(e instanceof Uint8Array))
                )
                    throw new TypeError("data must be a Uint8Array.");
                if (r !== void 0 && typeof r != "string")
                    throw new TypeError("mimeType, when provided, must be a string.");
                if (i !== void 0 && typeof i != "string") throw new TypeError("name, when provided, must be a string.");
                if (n !== void 0 && typeof n != "string")
                    throw new TypeError("description, when provided, must be a string.");
            }
        };
    var tt = [
            "pcm-s16",
            "pcm-s16be",
            "pcm-s24",
            "pcm-s24be",
            "pcm-s32",
            "pcm-s32be",
            "pcm-f32",
            "pcm-f32be",
            "pcm-f64",
            "pcm-f64be",
            "pcm-u8",
            "pcm-s8",
            "ulaw",
            "alaw",
        ],
        nn = ["aac", "opus", "mp3", "vorbis", "flac"],
        On = [...nn, ...tt];
    var ye = [
        { maxPictureSize: 36864, maxBitrate: 2e5, level: 10 },
        { maxPictureSize: 73728, maxBitrate: 8e5, level: 11 },
        { maxPictureSize: 122880, maxBitrate: 18e5, level: 20 },
        { maxPictureSize: 245760, maxBitrate: 36e5, level: 21 },
        { maxPictureSize: 552960, maxBitrate: 72e5, level: 30 },
        { maxPictureSize: 983040, maxBitrate: 12e6, level: 31 },
        { maxPictureSize: 2228224, maxBitrate: 18e6, level: 40 },
        { maxPictureSize: 2228224, maxBitrate: 3e7, level: 41 },
        { maxPictureSize: 8912896, maxBitrate: 6e7, level: 50 },
        { maxPictureSize: 8912896, maxBitrate: 12e7, level: 51 },
        { maxPictureSize: 8912896, maxBitrate: 18e7, level: 52 },
        { maxPictureSize: 35651584, maxBitrate: 18e7, level: 60 },
        { maxPictureSize: 35651584, maxBitrate: 24e7, level: 61 },
        { maxPictureSize: 35651584, maxBitrate: 48e7, level: 62 },
    ];
    var Qr = ".01.01.01.01.00",
        $r = ".0.110.01.01.01.0";
    var yt = (t) => {
        let {
            codec: e,
            codecDescription: r,
            colorSpace: i,
            avcCodecInfo: n,
            hevcCodecInfo: a,
            vp9CodecInfo: s,
            av1CodecInfo: o,
        } = t;
        if (e === "avc") {
            if (n) {
                let c = new Uint8Array([n.avcProfileIndication, n.profileCompatibility, n.avcLevelIndication]);
                return `avc1.${cr(c)}`;
            }
            if (!r || r.byteLength < 4)
                throw new TypeError("AVC decoder description is not provided or is not at least 4 bytes long.");
            return `avc1.${cr(r.subarray(1, 4))}`;
        } else if (e === "hevc") {
            let c, l, d, u, f, h;
            if (a)
                (c = a.generalProfileSpace),
                    (l = a.generalProfileIdc),
                    (d = lr(a.generalProfileCompatibilityFlags)),
                    (u = a.generalTierFlag),
                    (f = a.generalLevelIdc),
                    (h = [...a.generalConstraintIndicatorFlags]);
            else {
                if (!r || r.byteLength < 23)
                    throw new TypeError("HEVC decoder description is not provided or is not at least 23 bytes long.");
                let k = O(r),
                    b = k.getUint8(1);
                (c = (b >> 6) & 3),
                    (l = b & 31),
                    (d = lr(k.getUint32(2))),
                    (u = (b >> 5) & 1),
                    (f = k.getUint8(12)),
                    (h = []);
                for (let x = 0; x < 6; x++) h.push(k.getUint8(6 + x));
            }
            let m = "hev1.";
            for (
                m += ["", "A", "B", "C"][c] + l,
                    m += ".",
                    m += d.toString(16).toUpperCase(),
                    m += ".",
                    m += u === 0 ? "L" : "H",
                    m += f;
                h.length > 0 && h[h.length - 1] === 0;

            )
                h.pop();
            return h.length > 0 && ((m += "."), (m += h.map((k) => k.toString(16).toUpperCase()).join("."))), m;
        } else {
            if (e === "vp8") return "vp8";
            if (e === "vp9") {
                if (!s) {
                    let x = t.width * t.height,
                        g = G(ye).level;
                    for (let w of ye)
                        if (x <= w.maxPictureSize) {
                            g = w.level;
                            break;
                        }
                    return `vp09.00.${g.toString().padStart(2, "0")}.08`;
                }
                let c = s.profile.toString().padStart(2, "0"),
                    l = s.level.toString().padStart(2, "0"),
                    d = s.bitDepth.toString().padStart(2, "0"),
                    u = s.chromaSubsampling.toString().padStart(2, "0"),
                    f = s.colourPrimaries.toString().padStart(2, "0"),
                    h = s.transferCharacteristics.toString().padStart(2, "0"),
                    m = s.matrixCoefficients.toString().padStart(2, "0"),
                    k = s.videoFullRangeFlag.toString().padStart(2, "0"),
                    b = `vp09.${c}.${l}.${d}.${u}`;
                return (b += `.${f}.${h}.${m}.${k}`), b.endsWith(Qr) && (b = b.slice(0, -Qr.length)), b;
            } else if (e === "av1") {
                if (!o) {
                    let w = t.width * t.height,
                        T = G(ye).level;
                    for (let I of ye)
                        if (w <= I.maxPictureSize) {
                            T = I.level;
                            break;
                        }
                    return `av01.0.${T.toString().padStart(2, "0")}M.08`;
                }
                let c = o.profile,
                    l = o.level.toString().padStart(2, "0"),
                    d = o.tier ? "H" : "M",
                    u = o.bitDepth.toString().padStart(2, "0"),
                    f = o.monochrome ? "1" : "0",
                    h =
                        100 * o.chromaSubsamplingX +
                        10 * o.chromaSubsamplingY +
                        1 * (o.chromaSubsamplingX && o.chromaSubsamplingY ? o.chromaSamplePosition : 0),
                    m = i?.primaries ? sr[i.primaries] : 1,
                    k = i?.transfer ? ar[i.transfer] : 1,
                    b = i?.matrix ? or[i.matrix] : 1,
                    x = i?.fullRange ? 1 : 0,
                    g = `av01.${c}.${l}${d}.${u}`;
                return (
                    (g += `.${f}.${h.toString().padStart(3, "0")}`),
                    (g += `.${m.toString().padStart(2, "0")}`),
                    (g += `.${k.toString().padStart(2, "0")}`),
                    (g += `.${b.toString().padStart(2, "0")}`),
                    (g += `.${x}`),
                    g.endsWith($r) && (g = g.slice(0, -$r.length)),
                    g
                );
            }
        }
        throw new TypeError(`Unhandled codec '${e}'.`);
    };
    var Pt = (t) => {
            let { codec: e, codecDescription: r, aacCodecInfo: i } = t;
            if (e === "aac") {
                if (!i) throw new TypeError("AAC codec info must be provided.");
                return i.isMpeg2 ? "mp4a.67" : `mp4a.40.${gr(r).objectType}`;
            } else {
                if (e === "mp3") return "mp3";
                if (e === "opus") return "opus";
                if (e === "vorbis") return "vorbis";
                if (e === "flac") return "flac";
                if (e && tt.includes(e)) return e;
            }
            throw new TypeError(`Unhandled codec '${e}'.`);
        },
        et = [96e3, 88200, 64e3, 48e3, 44100, 32e3, 24e3, 22050, 16e3, 12e3, 11025, 8e3, 7350],
        pr = [-1, 1, 2, 3, 4, 5, 6, 8],
        gr = (t) => {
            if (!t || t.byteLength < 2) throw new TypeError("AAC description must be at least 2 bytes long.");
            let e = new N(t),
                r = e.readBits(5);
            r === 31 && (r = 32 + e.readBits(6));
            let i = e.readBits(4),
                n = null;
            i === 15 ? (n = e.readBits(24)) : i < et.length && (n = et[i]);
            let a = e.readBits(4),
                s = null;
            return (
                a >= 1 && a <= 7 && (s = pr[a]),
                { objectType: r, frequencyIndex: i, sampleRate: n, channelConfiguration: a, numberOfChannels: s }
            );
        },
        Pe = 48e3,
        sn = /^pcm-([usf])(\d+)+(be)?$/,
        Xr = (t) => {
            if ((p(tt.includes(t)), t === "ulaw"))
                return { dataType: "ulaw", sampleSize: 1, littleEndian: !0, silentValue: 255 };
            if (t === "alaw") return { dataType: "alaw", sampleSize: 1, littleEndian: !0, silentValue: 213 };
            let e = sn.exec(t);
            p(e);
            let r;
            e[1] === "u" ? (r = "unsigned") : e[1] === "s" ? (r = "signed") : (r = "float");
            let i = Number(e[2]) / 8,
                n = e[3] !== "be",
                a = t === "pcm-u8" ? 2 ** 7 : 0;
            return { dataType: r, sampleSize: i, littleEndian: n, silentValue: a };
        };
    var Be;
    (function (t) {
        (t[(t.IDR = 5)] = "IDR"), (t[(t.SPS = 7)] = "SPS"), (t[(t.PPS = 8)] = "PPS"), (t[(t.SPS_EXT = 13)] = "SPS_EXT");
    })(Be || (Be = {}));
    var Z;
    (function (t) {
        (t[(t.RASL_N = 8)] = "RASL_N"),
            (t[(t.RASL_R = 9)] = "RASL_R"),
            (t[(t.BLA_W_LP = 16)] = "BLA_W_LP"),
            (t[(t.RSV_IRAP_VCL23 = 23)] = "RSV_IRAP_VCL23"),
            (t[(t.VPS_NUT = 32)] = "VPS_NUT"),
            (t[(t.SPS_NUT = 33)] = "SPS_NUT"),
            (t[(t.PPS_NUT = 34)] = "PPS_NUT"),
            (t[(t.PREFIX_SEI_NUT = 39)] = "PREFIX_SEI_NUT"),
            (t[(t.SUFFIX_SEI_NUT = 40)] = "SUFFIX_SEI_NUT");
    })(Z || (Z = {}));
    var It = (t) => {
            let e = [],
                r = 0;
            for (; r < t.length; ) {
                let i = -1,
                    n = 0;
                for (let a = r; a < t.length - 3; a++) {
                    if (t[a] === 0 && t[a + 1] === 0 && t[a + 2] === 1) {
                        (i = a), (n = 3);
                        break;
                    }
                    if (a < t.length - 4 && t[a] === 0 && t[a + 1] === 0 && t[a + 2] === 0 && t[a + 3] === 1) {
                        (i = a), (n = 4);
                        break;
                    }
                }
                if (i === -1) break;
                if (r > 0 && i > r) {
                    let a = t.subarray(r, i);
                    a.length > 0 && e.push(a);
                }
                r = i + n;
            }
            if (r < t.length) {
                let i = t.subarray(r);
                i.length > 0 && e.push(i);
            }
            return e;
        },
        Yr = (t, e) => {
            let r = [],
                i = 0,
                n = new DataView(t.buffer, t.byteOffset, t.byteLength);
            for (; i + e <= t.length; ) {
                let a;
                e === 1
                    ? (a = n.getUint8(i))
                    : e === 2
                      ? (a = n.getUint16(i, !1))
                      : e === 3
                        ? (a = Je(n, i, !1))
                        : e === 4
                          ? (a = n.getUint32(i, !1))
                          : (de(e), p(!1)),
                    (i += e);
                let s = t.subarray(i, i + a);
                r.push(s), (i += a);
            }
            return r;
        },
        kr = (t) => {
            let e = [],
                r = t.length;
            for (let i = 0; i < r; i++)
                i + 2 < r && t[i] === 0 && t[i + 1] === 0 && t[i + 2] === 3 ? (e.push(0, 0), (i += 2)) : e.push(t[i]);
            return new Uint8Array(e);
        };
    var on = (t, e) => {
            if (e.description) {
                let n = (mt(e.description)[4] & 3) + 1;
                return Yr(t, n);
            } else return It(t);
        },
        Ct = (t) => t[0] & 31,
        Jr = (t) => {
            try {
                let e = It(t),
                    r = e.filter((f) => Ct(f) === Be.SPS),
                    i = e.filter((f) => Ct(f) === Be.PPS),
                    n = e.filter((f) => Ct(f) === Be.SPS_EXT);
                if (r.length === 0 || i.length === 0) return null;
                let a = r[0],
                    s = new N(kr(a));
                if ((s.skipBits(1), s.skipBits(2), s.readBits(5) !== 7))
                    return console.error("Invalid SPS NAL unit type"), null;
                let c = s.readAlignedByte(),
                    l = s.readAlignedByte(),
                    d = s.readAlignedByte(),
                    u = {
                        configurationVersion: 1,
                        avcProfileIndication: c,
                        profileCompatibility: l,
                        avcLevelIndication: d,
                        lengthSizeMinusOne: 3,
                        sequenceParameterSets: r,
                        pictureParameterSets: i,
                        chromaFormat: null,
                        bitDepthLumaMinus8: null,
                        bitDepthChromaMinus8: null,
                        sequenceParameterSetExt: null,
                    };
                if (c === 100 || c === 110 || c === 122 || c === 144) {
                    C(s);
                    let f = C(s);
                    f === 3 && s.skipBits(1);
                    let h = C(s),
                        m = C(s);
                    (u.chromaFormat = f),
                        (u.bitDepthLumaMinus8 = h),
                        (u.bitDepthChromaMinus8 = m),
                        (u.sequenceParameterSetExt = n);
                }
                return u;
            } catch (e) {
                return console.error("Error building AVC Decoder Configuration Record:", e), null;
            }
        };
    var cn = (t, e) => {
            if (e.description) {
                let n = (mt(e.description)[21] & 3) + 1;
                return Yr(t, n);
            } else return It(t);
        },
        Ce = (t) => (t[0] >> 1) & 63,
        ei = (t) => {
            try {
                let e = It(t),
                    r = e.filter((z) => Ce(z) === Z.VPS_NUT),
                    i = e.filter((z) => Ce(z) === Z.SPS_NUT),
                    n = e.filter((z) => Ce(z) === Z.PPS_NUT),
                    a = e.filter((z) => Ce(z) === Z.PREFIX_SEI_NUT || Ce(z) === Z.SUFFIX_SEI_NUT);
                if (i.length === 0 || n.length === 0) return null;
                let s = i[0],
                    o = new N(kr(s));
                o.skipBits(16), o.readBits(4);
                let c = o.readBits(3),
                    l = o.readBits(1),
                    {
                        general_profile_space: d,
                        general_tier_flag: u,
                        general_profile_idc: f,
                        general_profile_compatibility_flags: h,
                        general_constraint_indicator_flags: m,
                        general_level_idc: k,
                    } = ln(o, c);
                C(o);
                let b = C(o);
                b === 3 && o.skipBits(1), C(o), C(o), o.readBits(1) && (C(o), C(o), C(o), C(o));
                let x = C(o),
                    g = C(o);
                C(o);
                let T = o.readBits(1) ? 0 : c;
                for (let z = T; z <= c; z++) C(o), C(o), C(o);
                C(o),
                    C(o),
                    C(o),
                    C(o),
                    C(o),
                    C(o),
                    o.readBits(1) && o.readBits(1) && un(o),
                    o.skipBits(1),
                    o.skipBits(1),
                    o.readBits(1) && (o.skipBits(4), o.skipBits(4), C(o), C(o), o.skipBits(1));
                let I = C(o);
                if ((dn(o, I), o.readBits(1))) {
                    let z = C(o);
                    for (let B = 0; B < z; B++) C(o), o.skipBits(1);
                }
                o.skipBits(1), o.skipBits(1);
                let E = 0;
                o.readBits(1) && (E = hn(o, c));
                let A = 0;
                if (n.length > 0) {
                    let z = n[0],
                        B = new N(kr(z));
                    B.skipBits(16),
                        C(B),
                        C(B),
                        B.skipBits(1),
                        B.skipBits(1),
                        B.skipBits(3),
                        B.skipBits(1),
                        B.skipBits(1),
                        C(B),
                        C(B),
                        De(B),
                        B.skipBits(1),
                        B.skipBits(1),
                        B.readBits(1) && C(B),
                        De(B),
                        De(B),
                        B.skipBits(1),
                        B.skipBits(1),
                        B.skipBits(1),
                        B.skipBits(1);
                    let J = B.readBits(1),
                        Ye = B.readBits(1);
                    !J && !Ye ? (A = 0) : J && !Ye ? (A = 2) : !J && Ye ? (A = 3) : (A = 0);
                }
                let v = [
                    ...(r.length ? [{ arrayCompleteness: 1, nalUnitType: Z.VPS_NUT, nalUnits: r }] : []),
                    ...(i.length ? [{ arrayCompleteness: 1, nalUnitType: Z.SPS_NUT, nalUnits: i }] : []),
                    ...(n.length ? [{ arrayCompleteness: 1, nalUnitType: Z.PPS_NUT, nalUnits: n }] : []),
                    ...(a.length ? [{ arrayCompleteness: 1, nalUnitType: Ce(a[0]), nalUnits: a }] : []),
                ];
                return {
                    configurationVersion: 1,
                    generalProfileSpace: d,
                    generalTierFlag: u,
                    generalProfileIdc: f,
                    generalProfileCompatibilityFlags: h,
                    generalConstraintIndicatorFlags: m,
                    generalLevelIdc: k,
                    minSpatialSegmentationIdc: E,
                    parallelismType: A,
                    chromaFormatIdc: b,
                    bitDepthLumaMinus8: x,
                    bitDepthChromaMinus8: g,
                    avgFrameRate: 0,
                    constantFrameRate: 0,
                    numTemporalLayers: c + 1,
                    temporalIdNested: l,
                    lengthSizeMinusOne: 3,
                    arrays: v,
                };
            } catch (e) {
                return console.error("Error building HEVC Decoder Configuration Record:", e), null;
            }
        },
        ln = (t, e) => {
            let r = t.readBits(2),
                i = t.readBits(1),
                n = t.readBits(5),
                a = 0;
            for (let d = 0; d < 32; d++) a = (a << 1) | t.readBits(1);
            let s = new Uint8Array(6);
            for (let d = 0; d < 6; d++) s[d] = t.readBits(8);
            let o = t.readBits(8),
                c = [],
                l = [];
            for (let d = 0; d < e; d++) c.push(t.readBits(1)), l.push(t.readBits(1));
            if (e > 0) for (let d = e; d < 8; d++) t.skipBits(2);
            for (let d = 0; d < e; d++) c[d] && t.skipBits(88), l[d] && t.skipBits(8);
            return {
                general_profile_space: r,
                general_tier_flag: i,
                general_profile_idc: n,
                general_profile_compatibility_flags: a,
                general_constraint_indicator_flags: s,
                general_level_idc: o,
            };
        },
        un = (t) => {
            for (let e = 0; e < 4; e++)
                for (let r = 0; r < (e === 3 ? 2 : 6); r++)
                    if (!t.readBits(1)) C(t);
                    else {
                        let n = Math.min(64, 1 << (4 + (e << 1)));
                        e > 1 && De(t);
                        for (let a = 0; a < n; a++) De(t);
                    }
        },
        dn = (t, e) => {
            let r = [];
            for (let i = 0; i < e; i++) r[i] = fn(t, i, e, r);
        },
        fn = (t, e, r, i) => {
            let n = 0,
                a = 0,
                s = 0;
            if ((e !== 0 && (a = t.readBits(1)), a)) {
                if (e === r) {
                    let c = C(t);
                    s = e - (c + 1);
                } else s = e - 1;
                t.readBits(1), C(t);
                let o = i[s] ?? 0;
                for (let c = 0; c <= o; c++) t.readBits(1) || t.readBits(1);
                n = i[s];
            } else {
                let o = C(t),
                    c = C(t);
                for (let l = 0; l < o; l++) C(t), t.readBits(1);
                for (let l = 0; l < c; l++) C(t), t.readBits(1);
                n = o + c;
            }
            return n;
        },
        hn = (t, e) => {
            if (
                (t.readBits(1) && t.readBits(8) === 255 && (t.readBits(16), t.readBits(16)),
                t.readBits(1) && t.readBits(1),
                t.readBits(1) &&
                    (t.readBits(3), t.readBits(1), t.readBits(1) && (t.readBits(8), t.readBits(8), t.readBits(8))),
                t.readBits(1) && (C(t), C(t)),
                t.readBits(1),
                t.readBits(1),
                t.readBits(1),
                t.readBits(1) && (C(t), C(t), C(t), C(t)),
                t.readBits(1) && (t.readBits(32), t.readBits(32), t.readBits(1) && C(t), t.readBits(1) && mn(t, !0, e)),
                t.readBits(1))
            ) {
                t.readBits(1), t.readBits(1), t.readBits(1);
                let r = C(t);
                return C(t), C(t), C(t), C(t), r;
            }
            return 0;
        },
        mn = (t, e, r) => {
            let i = !1,
                n = !1,
                a = !1;
            e &&
                ((i = t.readBits(1) === 1),
                (n = t.readBits(1) === 1),
                (i || n) &&
                    ((a = t.readBits(1) === 1),
                    a && (t.readBits(8), t.readBits(5), t.readBits(1), t.readBits(5)),
                    t.readBits(4),
                    t.readBits(4),
                    a && t.readBits(4),
                    t.readBits(5),
                    t.readBits(5),
                    t.readBits(5)));
            for (let s = 0; s <= r; s++) {
                let o = t.readBits(1) === 1,
                    c = !0;
                o || (c = t.readBits(1) === 1);
                let l = !1;
                c ? C(t) : (l = t.readBits(1) === 1);
                let d = 1;
                l || (d = C(t) + 1), i && Zr(t, d, a), n && Zr(t, d, a);
            }
        },
        Zr = (t, e, r) => {
            for (let i = 0; i < e; i++) C(t), C(t), r && (C(t), C(t)), t.readBits(1);
        };
    var _t = (t) => {
            let e = new N(t);
            if (e.readBits(2) !== 2) return null;
            let i = e.readBits(1),
                a = (e.readBits(1) << 1) + i;
            if (
                (a === 3 && e.skipBits(1),
                e.readBits(1) === 1 || e.readBits(1) !== 0 || (e.skipBits(2), e.readBits(24) !== 4817730))
            )
                return null;
            let l = 8;
            a >= 2 && (l = e.readBits(1) ? 12 : 10);
            let d = e.readBits(3),
                u = 0,
                f = 0;
            if (d !== 7)
                if (((f = e.readBits(1)), a === 1 || a === 3)) {
                    let A = e.readBits(1),
                        v = e.readBits(1);
                    (u = !A && !v ? 3 : A && !v ? 2 : 1), e.skipBits(1);
                } else u = 1;
            else (u = 3), (f = 1);
            let h = e.readBits(16),
                m = e.readBits(16),
                k = h + 1,
                b = m + 1,
                x = k * b,
                g = G(ye).level;
            for (let E of ye)
                if (x <= E.maxPictureSize) {
                    g = E.level;
                    break;
                }
            return {
                profile: a,
                level: g,
                bitDepth: l,
                chromaSubsampling: u,
                videoFullRangeFlag: f,
                colourPrimaries: d === 2 ? 1 : d === 1 ? 6 : 2,
                transferCharacteristics: d === 2 ? 1 : d === 1 ? 6 : 2,
                matrixCoefficients: d === 7 ? 0 : d === 2 ? 1 : d === 1 ? 6 : 2,
            };
        },
        ti = function* (t) {
            let e = new N(t),
                r = () => {
                    let i = 0;
                    for (let n = 0; n < 8; n++) {
                        let a = e.readAlignedByte();
                        if (((i |= (a & 127) << (n * 7)), !(a & 128))) break;
                        if (n === 7 && a & 128) return null;
                    }
                    return i >= 2 ** 32 - 1 ? null : i;
                };
            for (; e.getBitsLeft() >= 8; ) {
                e.skipBits(1);
                let i = e.readBits(4),
                    n = e.readBits(1),
                    a = e.readBits(1);
                e.skipBits(1), n && e.skipBits(8);
                let s;
                if (a) {
                    let o = r();
                    if (o === null) return;
                    s = o;
                } else s = Math.floor(e.getBitsLeft() / 8);
                p(e.pos % 8 === 0), yield { type: i, data: t.subarray(e.pos / 8, e.pos / 8 + s) }, e.skipBits(s * 8);
            }
        },
        Et = (t) => {
            for (let { type: e, data: r } of ti(t)) {
                if (e !== 1) continue;
                let i = new N(r),
                    n = i.readBits(3),
                    a = i.readBits(1),
                    s = i.readBits(1),
                    o = 0,
                    c = 0,
                    l = 0;
                if (s) o = i.readBits(5);
                else {
                    if (i.readBits(1) && (i.skipBits(32), i.skipBits(32), i.readBits(1))) return null;
                    let x = i.readBits(1);
                    x && ((l = i.readBits(5)), i.skipBits(32), i.skipBits(5), i.skipBits(5));
                    let g = i.readBits(5);
                    for (let w = 0; w <= g; w++) {
                        i.skipBits(12);
                        let T = i.readBits(5);
                        if ((w === 0 && (o = T), T > 7)) {
                            let E = i.readBits(1);
                            w === 0 && (c = E);
                        }
                        if (x && i.readBits(1)) {
                            let A = l + 1;
                            i.skipBits(A), i.skipBits(A), i.skipBits(1);
                        }
                        i.readBits(1) && i.skipBits(4);
                    }
                }
                let d = i.readBits(1),
                    u = 8;
                n === 2 && d ? (u = i.readBits(1) ? 12 : 10) : n <= 2 && (u = d ? 10 : 8);
                let f = 0;
                n !== 1 && (f = i.readBits(1));
                let h = 1,
                    m = 1,
                    k = 0;
                return (
                    f ||
                        (n === 0
                            ? ((h = 1), (m = 1))
                            : n === 1
                              ? ((h = 0), (m = 0))
                              : u === 12 && ((h = i.readBits(1)), h && (m = i.readBits(1))),
                        h && m && (k = i.readBits(2))),
                    {
                        profile: n,
                        level: o,
                        tier: c,
                        bitDepth: u,
                        monochrome: f,
                        chromaSubsamplingX: h,
                        chromaSubsamplingY: m,
                        chromaSamplePosition: k,
                    }
                );
            }
            return null;
        },
        ri = (t) => {
            let e = O(t),
                r = e.getUint8(9),
                i = e.getUint16(10, !0),
                n = e.getUint32(12, !0),
                a = e.getInt16(16, !0),
                s = e.getUint8(18),
                o = null;
            return (
                s && (o = t.subarray(19, 21 + r)),
                {
                    outputChannelCount: r,
                    preSkip: i,
                    inputSampleRate: n,
                    outputGain: a,
                    channelMappingFamily: s,
                    channelMappingTable: o,
                }
            );
        },
        pn = [
            480, 960, 1920, 2880, 480, 960, 1920, 2880, 480, 960, 1920, 2880, 480, 960, 480, 960, 120, 240, 480, 960,
            120, 240, 480, 960, 120, 240, 480, 960, 120, 240, 480, 960,
        ],
        ii = (t) => {
            let e = t[0] >> 3;
            return { durationInSamples: pn[e] };
        },
        ni = (t) => {
            if (t.length < 7) throw new Error("Setup header is too short.");
            if (t[0] !== 5) throw new Error("Wrong packet type in Setup header.");
            if (String.fromCharCode(...t.slice(1, 7)) !== "vorbis")
                throw new Error("Invalid packet signature in Setup header.");
            let r = t.length,
                i = new Uint8Array(r);
            for (let u = 0; u < r; u++) i[u] = t[r - 1 - u];
            let n = new N(i),
                a = 0;
            for (; n.getBitsLeft() > 97; )
                if (n.readBits(1) === 1) {
                    a = n.pos;
                    break;
                }
            if (a === 0) throw new Error("Invalid Setup header: framing bit not found.");
            let s = 0,
                o = !1,
                c = 0;
            for (; n.getBitsLeft() >= 97; ) {
                let u = n.pos,
                    f = n.readBits(8),
                    h = n.readBits(16),
                    m = n.readBits(16);
                if (f > 63 || h !== 0 || m !== 0) {
                    n.pos = u;
                    break;
                }
                if ((n.skipBits(1), s++, s > 64)) break;
                n.clone().readBits(6) + 1 === s && ((o = !0), (c = s));
            }
            if (!o) throw new Error("Invalid Setup header: mode header not found.");
            if (c > 63) throw new Error(`Unsupported mode count: ${c}.`);
            let l = c;
            (n.pos = 0), n.skipBits(a);
            let d = Array(l).fill(0);
            for (let u = l - 1; u >= 0; u--) n.skipBits(40), (d[u] = n.readBits(1));
            return { modeBlockflags: d };
        },
        si = (t, e, r) => {
            switch (t) {
                case "avc":
                    return on(r, e).some((a) => Ct(a) === Be.IDR) ? "key" : "delta";
                case "hevc":
                    return cn(r, e).some((a) => {
                        let s = Ce(a);
                        return Z.BLA_W_LP <= s && s <= Z.RSV_IRAP_VCL23;
                    })
                        ? "key"
                        : "delta";
                case "vp8":
                    return (r[0] & 1) === 0 ? "key" : "delta";
                case "vp9": {
                    let i = new N(r);
                    if (i.readBits(2) !== 2) return null;
                    let n = i.readBits(1);
                    return (
                        (i.readBits(1) << 1) + n === 3 && i.skipBits(1),
                        i.readBits(1) ? null : i.readBits(1) === 0 ? "key" : "delta"
                    );
                }
                case "av1": {
                    let i = !1;
                    for (let { type: n, data: a } of ti(r))
                        if (n === 1) {
                            let s = new N(a);
                            s.skipBits(4), (i = !!s.readBits(1));
                        } else if (n === 3 || n === 6 || n === 7) {
                            if (i) return "key";
                            let s = new N(a);
                            return s.readBits(1) ? null : s.readBits(2) === 0 ? "key" : "delta";
                        }
                    return null;
                }
                default:
                    de(t), p(!1);
            }
        },
        he;
    (function (t) {
        (t[(t.STREAMINFO = 0)] = "STREAMINFO"),
            (t[(t.VORBIS_COMMENT = 4)] = "VORBIS_COMMENT"),
            (t[(t.PICTURE = 6)] = "PICTURE");
    })(he || (he = {}));
    var rt = (t, e) => {
        let r = O(t),
            i = 0,
            n = r.getUint32(i, !0);
        i += 4;
        let a = H.decode(t.subarray(i, i + n));
        (i += n), n > 0 && ((e.raw ??= {}), (e.raw.vendor ??= a));
        let s = r.getUint32(i, !0);
        i += 4;
        for (let o = 0; o < s; o++) {
            let c = r.getUint32(i, !0);
            i += 4;
            let l = H.decode(t.subarray(i, i + c));
            i += c;
            let d = l.indexOf("=");
            if (d === -1) continue;
            let u = l.slice(0, d).toUpperCase(),
                f = l.slice(d + 1);
            switch (((e.raw ??= {}), (e.raw[u] ??= f), u)) {
                case "TITLE":
                    e.title ??= f;
                    break;
                case "DESCRIPTION":
                    e.description ??= f;
                    break;
                case "ARTIST":
                    e.artist ??= f;
                    break;
                case "ALBUM":
                    e.album ??= f;
                    break;
                case "ALBUMARTIST":
                    e.albumArtist ??= f;
                    break;
                case "COMMENT":
                    e.comment ??= f;
                    break;
                case "LYRICS":
                    e.lyrics ??= f;
                    break;
                case "TRACKNUMBER":
                    {
                        let h = f.split("/"),
                            m = Number.parseInt(h[0], 10),
                            k = h[1] && Number.parseInt(h[1], 10);
                        Number.isInteger(m) && m > 0 && (e.trackNumber ??= m),
                            k && Number.isInteger(k) && k > 0 && (e.tracksTotal ??= k);
                    }
                    break;
                case "TRACKTOTAL":
                    {
                        let h = Number.parseInt(f, 10);
                        Number.isInteger(h) && h > 0 && (e.tracksTotal ??= h);
                    }
                    break;
                case "DISCNUMBER":
                    {
                        let h = f.split("/"),
                            m = Number.parseInt(h[0], 10),
                            k = h[1] && Number.parseInt(h[1], 10);
                        Number.isInteger(m) && m > 0 && (e.discNumber ??= m),
                            k && Number.isInteger(k) && k > 0 && (e.discsTotal ??= k);
                    }
                    break;
                case "DISCTOTAL":
                    {
                        let h = Number.parseInt(f, 10);
                        Number.isInteger(h) && h > 0 && (e.discsTotal ??= h);
                    }
                    break;
                case "DATE":
                    {
                        let h = new Date(f);
                        Number.isNaN(h.getTime()) || (e.date ??= h);
                    }
                    break;
                case "GENRE":
                    e.genre ??= f;
                    break;
                case "METADATA_BLOCK_PICTURE":
                    {
                        let h = Kr(f),
                            m = O(h),
                            k = m.getUint32(0, !1),
                            b = m.getUint32(4, !1),
                            x = String.fromCharCode(...h.subarray(8, 8 + b)),
                            g = m.getUint32(8 + b, !1),
                            w = H.decode(h.subarray(12 + b, 12 + b + g)),
                            T = m.getUint32(b + g + 28),
                            I = h.subarray(b + g + 32, b + g + 32 + T);
                        (e.images ??= []),
                            e.images.push({
                                data: I,
                                mimeType: x,
                                kind: k === 3 ? "coverFront" : k === 4 ? "coverBack" : "unknown",
                                name: void 0,
                                description: w || void 0,
                            });
                    }
                    break;
            }
        }
    };
    var K = class {
        constructor(e) {
            this.input = e;
        }
    };
    var ai = [],
        oi = [];
    var V = new Uint8Array(0),
        U = class t {
            constructor(e, r, i, n, a = -1, s, o) {
                if (
                    ((this.data = e),
                    (this.type = r),
                    (this.timestamp = i),
                    (this.duration = n),
                    (this.sequenceNumber = a),
                    e === V && s === void 0)
                )
                    throw new Error(
                        "Internal error: byteLength must be explicitly provided when constructing metadata-only packets."
                    );
                if ((s === void 0 && (s = e.byteLength), !(e instanceof Uint8Array)))
                    throw new TypeError("data must be a Uint8Array.");
                if (r !== "key" && r !== "delta") throw new TypeError('type must be either "key" or "delta".');
                if (!Number.isFinite(i)) throw new TypeError("timestamp must be a number.");
                if (!Number.isFinite(n) || n < 0) throw new TypeError("duration must be a non-negative number.");
                if (!Number.isFinite(a)) throw new TypeError("sequenceNumber must be a number.");
                if (!Number.isInteger(s) || s < 0) throw new TypeError("byteLength must be a non-negative integer.");
                if (o !== void 0 && (typeof o != "object" || !o))
                    throw new TypeError("sideData, when provided, must be an object.");
                if (o?.alpha !== void 0 && !(o.alpha instanceof Uint8Array))
                    throw new TypeError("sideData.alpha, when provided, must be a Uint8Array.");
                if (o?.alphaByteLength !== void 0 && (!Number.isInteger(o.alphaByteLength) || o.alphaByteLength < 0))
                    throw new TypeError("sideData.alphaByteLength, when provided, must be a non-negative integer.");
                (this.byteLength = s),
                    (this.sideData = o ?? {}),
                    this.sideData.alpha &&
                        this.sideData.alphaByteLength === void 0 &&
                        (this.sideData.alphaByteLength = this.sideData.alpha.byteLength);
            }
            get isMetadataOnly() {
                return this.data === V;
            }
            get microsecondTimestamp() {
                return Math.trunc(fr * this.timestamp);
            }
            get microsecondDuration() {
                return Math.trunc(fr * this.duration);
            }
            toEncodedVideoChunk() {
                if (this.isMetadataOnly)
                    throw new TypeError("Metadata-only packets cannot be converted to a video chunk.");
                if (typeof EncodedVideoChunk > "u") throw new Error("Your browser does not support EncodedVideoChunk.");
                return new EncodedVideoChunk({
                    data: this.data,
                    type: this.type,
                    timestamp: this.microsecondTimestamp,
                    duration: this.microsecondDuration,
                });
            }
            alphaToEncodedVideoChunk(e = this.type) {
                if (!this.sideData.alpha) throw new TypeError("This packet does not contain alpha side data.");
                if (this.isMetadataOnly)
                    throw new TypeError("Metadata-only packets cannot be converted to a video chunk.");
                if (typeof EncodedVideoChunk > "u") throw new Error("Your browser does not support EncodedVideoChunk.");
                return new EncodedVideoChunk({
                    data: this.sideData.alpha,
                    type: e,
                    timestamp: this.microsecondTimestamp,
                    duration: this.microsecondDuration,
                });
            }
            toEncodedAudioChunk() {
                if (this.isMetadataOnly)
                    throw new TypeError("Metadata-only packets cannot be converted to an audio chunk.");
                if (typeof EncodedAudioChunk > "u") throw new Error("Your browser does not support EncodedAudioChunk.");
                return new EncodedAudioChunk({
                    data: this.data,
                    type: this.type,
                    timestamp: this.microsecondTimestamp,
                    duration: this.microsecondDuration,
                });
            }
            static fromEncodedChunk(e, r) {
                if (!(e instanceof EncodedVideoChunk || e instanceof EncodedAudioChunk))
                    throw new TypeError("chunk must be an EncodedVideoChunk or EncodedAudioChunk.");
                let i = new Uint8Array(e.byteLength);
                return e.copyTo(i), new t(i, e.type, e.timestamp / 1e6, (e.duration ?? 0) / 1e6, void 0, void 0, r);
            }
            clone(e) {
                if (e !== void 0 && (typeof e != "object" || e === null))
                    throw new TypeError("options, when provided, must be an object.");
                if (e?.timestamp !== void 0 && !Number.isFinite(e.timestamp))
                    throw new TypeError("options.timestamp, when provided, must be a number.");
                if (e?.duration !== void 0 && !Number.isFinite(e.duration))
                    throw new TypeError("options.duration, when provided, must be a number.");
                return new t(
                    this.data,
                    this.type,
                    e?.timestamp ?? this.timestamp,
                    e?.duration ?? this.duration,
                    this.sequenceNumber,
                    this.byteLength
                );
            }
        };
    var Re = (t) => {
            if (!t || typeof t != "object") throw new TypeError("options must be an object.");
            if (t.metadataOnly !== void 0 && typeof t.metadataOnly != "boolean")
                throw new TypeError("options.metadataOnly, when defined, must be a boolean.");
            if (t.verifyKeyPackets !== void 0 && typeof t.verifyKeyPackets != "boolean")
                throw new TypeError("options.verifyKeyPackets, when defined, must be a boolean.");
            if (t.verifyKeyPackets && t.metadataOnly)
                throw new TypeError("options.verifyKeyPackets and options.metadataOnly cannot be enabled together.");
        },
        ci = (t) => {
            if (!Tt(t)) throw new TypeError("timestamp must be a number.");
        },
        br = (t, e, r) =>
            r.verifyKeyPackets
                ? e.then(async (i) => {
                      if (!i || i.type === "delta") return i;
                      let n = await t.determinePacketType(i);
                      return n && (i.type = n), i;
                  })
                : e,
        Ie = class {
            constructor(e) {
                if (!(e instanceof ze)) throw new TypeError("track must be an InputTrack.");
                this._track = e;
            }
            getFirstPacket(e = {}) {
                if ((Re(e), this._track.input._disposed)) throw new j();
                return br(this._track, this._track._backing.getFirstPacket(e), e);
            }
            getPacket(e, r = {}) {
                if ((ci(e), Re(r), this._track.input._disposed)) throw new j();
                return br(this._track, this._track._backing.getPacket(e, r), r);
            }
            getNextPacket(e, r = {}) {
                if (!(e instanceof U)) throw new TypeError("packet must be an EncodedPacket.");
                if ((Re(r), this._track.input._disposed)) throw new j();
                return br(this._track, this._track._backing.getNextPacket(e, r), r);
            }
            async getKeyPacket(e, r = {}) {
                if ((ci(e), Re(r), this._track.input._disposed)) throw new j();
                if (!r.verifyKeyPackets) return this._track._backing.getKeyPacket(e, r);
                let i = await this._track._backing.getKeyPacket(e, r);
                return !i || i.type === "delta"
                    ? i
                    : (await this._track.determinePacketType(i)) === "delta"
                      ? this.getKeyPacket(i.timestamp - 1 / this._track.timeResolution, r)
                      : i;
            }
            async getNextKeyPacket(e, r = {}) {
                if (!(e instanceof U)) throw new TypeError("packet must be an EncodedPacket.");
                if ((Re(r), this._track.input._disposed)) throw new j();
                if (!r.verifyKeyPackets) return this._track._backing.getNextKeyPacket(e, r);
                let i = await this._track._backing.getNextKeyPacket(e, r);
                return !i || i.type === "delta"
                    ? i
                    : (await this._track.determinePacketType(i)) === "delta"
                      ? this.getNextKeyPacket(i, r)
                      : i;
            }
            packets(e, r, i = {}) {
                if (e !== void 0 && !(e instanceof U)) throw new TypeError("startPacket must be an EncodedPacket.");
                if (e !== void 0 && e.isMetadataOnly && !i?.metadataOnly)
                    throw new TypeError("startPacket can only be metadata-only if options.metadataOnly is enabled.");
                if (r !== void 0 && !(r instanceof U)) throw new TypeError("endPacket must be an EncodedPacket.");
                if ((Re(i), this._track.input._disposed)) throw new j();
                let n = [],
                    { promise: a, resolve: s } = xe(),
                    { promise: o, resolve: c } = xe(),
                    l = !1,
                    d = !1,
                    u = null,
                    f = [],
                    h = () => Math.max(2, f.length);
                (async () => {
                    let k = e ?? (await this.getFirstPacket(i));
                    for (; k && !d && !this._track.input._disposed && !(r && k.sequenceNumber >= r?.sequenceNumber); ) {
                        if (n.length > h()) {
                            ({ promise: o, resolve: c } = xe()), await o;
                            continue;
                        }
                        n.push(k), s(), ({ promise: a, resolve: s } = xe()), (k = await this.getNextPacket(k, i));
                    }
                    (l = !0), s();
                })().catch((k) => {
                    u || ((u = k), s());
                });
                let m = this._track;
                return {
                    async next() {
                        for (;;) {
                            if (m.input._disposed) throw new j();
                            if (d) return { value: void 0, done: !0 };
                            if (u) throw u;
                            if (n.length > 0) {
                                let k = n.shift(),
                                    b = performance.now();
                                for (f.push(b); f.length > 0 && b - f[0] >= 1e3; ) f.shift();
                                return c(), { value: k, done: !1 };
                            } else {
                                if (l) return { value: void 0, done: !0 };
                                await a;
                            }
                        }
                    },
                    async return() {
                        return (d = !0), c(), s(), { value: void 0, done: !0 };
                    },
                    async throw(k) {
                        throw k;
                    },
                    [Symbol.asyncIterator]() {
                        return this;
                    },
                };
            }
        };
    var ze = class {
            constructor(e, r) {
                (this.input = e), (this._backing = r);
            }
            isVideoTrack() {
                return this instanceof me;
            }
            isAudioTrack() {
                return this instanceof W;
            }
            get id() {
                return this._backing.getId();
            }
            get internalCodecId() {
                return this._backing.getInternalCodecId();
            }
            get languageCode() {
                return this._backing.getLanguageCode();
            }
            get name() {
                return this._backing.getName();
            }
            get timeResolution() {
                return this._backing.getTimeResolution();
            }
            getFirstTimestamp() {
                return this._backing.getFirstTimestamp();
            }
            computeDuration() {
                return this._backing.computeDuration();
            }
            async computePacketStats(e = 1 / 0) {
                let r = new Ie(this),
                    i = 1 / 0,
                    n = -1 / 0,
                    a = 0,
                    s = 0;
                for await (let o of r.packets(void 0, void 0, { metadataOnly: !0 })) {
                    if (a >= e && o.timestamp >= n) break;
                    (i = Math.min(i, o.timestamp)),
                        (n = Math.max(n, o.timestamp + o.duration)),
                        a++,
                        (s += o.byteLength);
                }
                return {
                    packetCount: a,
                    averagePacketRate: a ? Number((a / (n - i)).toPrecision(16)) : 0,
                    averageBitrate: a ? Number(((8 * s) / (n - i)).toPrecision(16)) : 0,
                };
            }
        },
        me = class extends ze {
            constructor(e, r) {
                super(e, r), (this._backing = r);
            }
            get type() {
                return "video";
            }
            get codec() {
                return this._backing.getCodec();
            }
            get codedWidth() {
                return this._backing.getCodedWidth();
            }
            get codedHeight() {
                return this._backing.getCodedHeight();
            }
            get rotation() {
                return this._backing.getRotation();
            }
            get displayWidth() {
                return this._backing.getRotation() % 180 === 0
                    ? this._backing.getCodedWidth()
                    : this._backing.getCodedHeight();
            }
            get displayHeight() {
                return this._backing.getRotation() % 180 === 0
                    ? this._backing.getCodedHeight()
                    : this._backing.getCodedWidth();
            }
            getColorSpace() {
                return this._backing.getColorSpace();
            }
            async hasHighDynamicRange() {
                let e = await this._backing.getColorSpace();
                return (
                    e.primaries === "bt2020" ||
                    e.primaries === "smpte432" ||
                    e.transfer === "pg" ||
                    e.transfer === "hlg" ||
                    e.matrix === "bt2020-ncl"
                );
            }
            canBeTransparent() {
                return this._backing.canBeTransparent();
            }
            getDecoderConfig() {
                return this._backing.getDecoderConfig();
            }
            async getCodecParameterString() {
                return (await this._backing.getDecoderConfig())?.codec ?? null;
            }
            async canDecode() {
                try {
                    let e = await this._backing.getDecoderConfig();
                    if (!e) return !1;
                    let r = this._backing.getCodec();
                    return (
                        p(r !== null),
                        ai.some((n) => n.supports(r, e))
                            ? !0
                            : typeof VideoDecoder > "u"
                              ? !1
                              : (await VideoDecoder.isConfigSupported(e)).supported === !0
                    );
                } catch (e) {
                    return console.error("Error during decodability check:", e), !1;
                }
            }
            async determinePacketType(e) {
                if (!(e instanceof U)) throw new TypeError("packet must be an EncodedPacket.");
                if (e.isMetadataOnly) throw new TypeError("packet must not be metadata-only to determine its type.");
                if (this.codec === null) return null;
                let r = await this.getDecoderConfig();
                return p(r), si(this.codec, r, e.data);
            }
        },
        W = class extends ze {
            constructor(e, r) {
                super(e, r), (this._backing = r);
            }
            get type() {
                return "audio";
            }
            get codec() {
                return this._backing.getCodec();
            }
            get numberOfChannels() {
                return this._backing.getNumberOfChannels();
            }
            get sampleRate() {
                return this._backing.getSampleRate();
            }
            getDecoderConfig() {
                return this._backing.getDecoderConfig();
            }
            async getCodecParameterString() {
                return (await this._backing.getDecoderConfig())?.codec ?? null;
            }
            async canDecode() {
                try {
                    let e = await this._backing.getDecoderConfig();
                    if (!e) return !1;
                    let r = this._backing.getCodec();
                    return (
                        p(r !== null),
                        oi.some((i) => i.supports(r, e)) || e.codec.startsWith("pcm-")
                            ? !0
                            : typeof AudioDecoder > "u"
                              ? !1
                              : (await AudioDecoder.isConfigSupported(e)).supported === !0
                    );
                } catch (e) {
                    return console.error("Error during decodability check:", e), !1;
                }
            }
            async determinePacketType(e) {
                if (!(e instanceof U)) throw new TypeError("packet must be an EncodedPacket.");
                return this.codec === null ? null : "key";
            }
        };
    var li = (t) => {
        let r =
            (t.hasVideo ? "video/" : t.hasAudio ? "audio/" : "application/") + (t.isQuickTime ? "quicktime" : "mp4");
        if (t.codecStrings.length > 0) {
            let i = [...new Set(t.codecStrings)];
            r += `; codecs="${i.join(", ")}"`;
        }
        return r;
    };
    var _e = 8,
        Ne = 16,
        se = (t) => {
            let e = y(t),
                r = M(t, 4),
                i = 8;
            e === 1 && ((e = $(t)), (i = 16));
            let a = e - i;
            return a < 0 ? null : { name: r, totalSize: e, headerSize: i, contentSize: a };
        },
        pe = (t) => ae(t) / 65536,
        vt = (t) => ae(t) / 1073741824,
        At = (t) => {
            let e = 0;
            for (let r = 0; r < 4; r++) {
                e <<= 7;
                let i = P(t);
                if (((e |= i & 127), (i & 128) === 0)) break;
            }
            return e;
        },
        ee = (t) => {
            let e = L(t);
            return t.skip(2), (e = Math.min(e, t.remainingLength)), H.decode(_(t, e));
        },
        ui = (t) => {
            let e = se(t);
            if (!e || e.name !== "data" || t.remainingLength < 8) return null;
            let r = y(t);
            t.skip(4);
            let i = _(t, e.contentSize - 8);
            switch (r) {
                case 1:
                    return H.decode(i);
                case 2:
                    return new TextDecoder("utf-16be").decode(i);
                case 13:
                    return new fe(i, "image/jpeg");
                case 14:
                    return new fe(i, "image/png");
                case 27:
                    return new fe(i, "image/bmp");
                default:
                    return i;
            }
        };
    var Dt = class extends K {
            constructor(e) {
                super(e),
                    (this.moovSlice = null),
                    (this.currentTrack = null),
                    (this.tracks = []),
                    (this.metadataPromise = null),
                    (this.movieTimescale = -1),
                    (this.movieDurationInTimescale = -1),
                    (this.isQuickTime = !1),
                    (this.metadataTags = {}),
                    (this.currentMetadataKeys = null),
                    (this.isFragmented = !1),
                    (this.fragmentTrackDefaults = []),
                    (this.currentFragment = null),
                    (this.lastReadFragment = null),
                    (this.reader = e._reader);
            }
            async computeDuration() {
                let e = await this.getTracks(),
                    r = await Promise.all(e.map((i) => i.computeDuration()));
                return Math.max(0, ...r);
            }
            async getTracks() {
                return await this.readMetadata(), this.tracks.map((e) => e.inputTrack);
            }
            async getMimeType() {
                await this.readMetadata();
                let e = await Promise.all(this.tracks.map((r) => r.inputTrack.getCodecParameterString()));
                return li({
                    isQuickTime: this.isQuickTime,
                    hasVideo: this.tracks.some((r) => r.info?.type === "video"),
                    hasAudio: this.tracks.some((r) => r.info?.type === "audio"),
                    codecStrings: e.filter(Boolean),
                });
            }
            async getMetadataTags() {
                return await this.readMetadata(), this.metadataTags;
            }
            readMetadata() {
                return (this.metadataPromise ??= (async () => {
                    let e = 0;
                    for (;;) {
                        let r = this.reader.requestSliceRange(e, _e, Ne);
                        if ((r instanceof Promise && (r = await r), !r)) break;
                        let i = e,
                            n = se(r);
                        if (!n) break;
                        if (n.name === "ftyp") {
                            let a = M(r, 4);
                            this.isQuickTime = a === "qt  ";
                        } else if (n.name === "moov") {
                            let a = this.reader.requestSlice(r.filePos, n.contentSize);
                            if ((a instanceof Promise && (a = await a), !a)) break;
                            (this.moovSlice = a), this.readContiguousBoxes(this.moovSlice);
                            for (let s of this.tracks) {
                                let o = s.editListPreviousSegmentDurations / this.movieTimescale;
                                s.editListOffset -= Math.round(o * s.timescale);
                            }
                            break;
                        }
                        e = i + n.totalSize;
                    }
                    if (this.isFragmented && this.reader.fileSize !== null) {
                        let r = this.reader.requestSlice(this.reader.fileSize - 4, 4);
                        r instanceof Promise && (r = await r), p(r);
                        let i = y(r),
                            n = this.reader.fileSize - i;
                        if (n >= 0 && n <= this.reader.fileSize - Ne) {
                            let a = this.reader.requestSliceRange(n, _e, Ne);
                            if ((a instanceof Promise && (a = await a), a)) {
                                let s = se(a);
                                if (s && s.name === "mfra") {
                                    let o = this.reader.requestSlice(a.filePos, s.contentSize);
                                    o instanceof Promise && (o = await o), o && this.readContiguousBoxes(o);
                                }
                            }
                        }
                    }
                })());
            }
            getSampleTableForTrack(e) {
                if (e.sampleTable) return e.sampleTable;
                let r = {
                    sampleTimingEntries: [],
                    sampleCompositionTimeOffsets: [],
                    sampleSizes: [],
                    keySampleIndices: null,
                    chunkOffsets: [],
                    sampleToChunk: [],
                    presentationTimestamps: null,
                    presentationTimestampIndexMap: null,
                };
                (e.sampleTable = r), p(this.moovSlice);
                let i = this.moovSlice.slice(e.sampleTableByteOffset);
                if (
                    ((this.currentTrack = e),
                    this.traverseBox(i),
                    (this.currentTrack = null),
                    e.info?.type === "audio" &&
                        e.info.codec &&
                        tt.includes(e.info.codec) &&
                        r.sampleCompositionTimeOffsets.length === 0)
                ) {
                    p(e.info?.type === "audio");
                    let a = Xr(e.info.codec),
                        s = [],
                        o = [];
                    for (let c = 0; c < r.sampleToChunk.length; c++) {
                        let l = r.sampleToChunk[c],
                            d = r.sampleToChunk[c + 1],
                            u = (d ? d.startChunkIndex : r.chunkOffsets.length) - l.startChunkIndex;
                        for (let f = 0; f < u; f++) {
                            let h = l.startSampleIndex + f * l.samplesPerChunk,
                                m = h + l.samplesPerChunk,
                                k = F(r.sampleTimingEntries, h, (v) => v.startIndex),
                                b = r.sampleTimingEntries[k],
                                x = F(r.sampleTimingEntries, m, (v) => v.startIndex),
                                g = r.sampleTimingEntries[x],
                                w = b.startDecodeTimestamp + (h - b.startIndex) * b.delta,
                                I = g.startDecodeTimestamp + (m - g.startIndex) * g.delta - w,
                                E = G(s);
                            E && E.delta === I
                                ? E.count++
                                : s.push({
                                      startIndex: l.startChunkIndex + f,
                                      startDecodeTimestamp: w,
                                      count: 1,
                                      delta: I,
                                  });
                            let A = l.samplesPerChunk * a.sampleSize * e.info.numberOfChannels;
                            o.push(A);
                        }
                        (l.startSampleIndex = l.startChunkIndex), (l.samplesPerChunk = 1);
                    }
                    (r.sampleTimingEntries = s), (r.sampleSizes = o);
                }
                if (r.sampleCompositionTimeOffsets.length > 0) {
                    r.presentationTimestamps = [];
                    for (let a of r.sampleTimingEntries)
                        for (let s = 0; s < a.count; s++)
                            r.presentationTimestamps.push({
                                presentationTimestamp: a.startDecodeTimestamp + s * a.delta,
                                sampleIndex: a.startIndex + s,
                            });
                    for (let a of r.sampleCompositionTimeOffsets)
                        for (let s = 0; s < a.count; s++) {
                            let o = a.startIndex + s,
                                c = r.presentationTimestamps[o];
                            c && (c.presentationTimestamp += a.offset);
                        }
                    r.presentationTimestamps.sort((a, s) => a.presentationTimestamp - s.presentationTimestamp),
                        (r.presentationTimestampIndexMap = Array(r.presentationTimestamps.length).fill(-1));
                    for (let a = 0; a < r.presentationTimestamps.length; a++)
                        r.presentationTimestampIndexMap[r.presentationTimestamps[a].sampleIndex] = a;
                }
                return r;
            }
            async readFragment(e) {
                if (this.lastReadFragment?.moofOffset === e) return this.lastReadFragment;
                let r = this.reader.requestSliceRange(e, _e, Ne);
                r instanceof Promise && (r = await r), p(r);
                let i = se(r);
                p(i?.name === "moof");
                let n = this.reader.requestSlice(e, i.totalSize);
                n instanceof Promise && (n = await n), p(n), this.traverseBox(n);
                let a = this.lastReadFragment;
                p(a && a.moofOffset === e);
                for (let [, s] of a.trackData) {
                    let o = s.track,
                        { fragmentPositionCache: c } = o;
                    if (!s.startTimestampIsFinal) {
                        let d = o.fragmentLookupTable.find((u) => u.moofOffset === a.moofOffset);
                        if (d) Sr(s, d.timestamp);
                        else {
                            let u = F(c, a.moofOffset - 1, (f) => f.moofOffset);
                            if (u !== -1) {
                                let f = c[u];
                                Sr(s, f.endTimestamp);
                            }
                        }
                        s.startTimestampIsFinal = !0;
                    }
                    let l = F(c, s.startTimestamp, (d) => d.startTimestamp);
                    (l === -1 || c[l].moofOffset !== a.moofOffset) &&
                        c.splice(l + 1, 0, {
                            moofOffset: a.moofOffset,
                            startTimestamp: s.startTimestamp,
                            endTimestamp: s.endTimestamp,
                        });
                }
                return a;
            }
            readContiguousBoxes(e) {
                let r = e.filePos;
                for (; e.filePos - r <= e.length - _e && this.traverseBox(e); );
            }
            *iterateContiguousBoxes(e) {
                let r = e.filePos;
                for (; e.filePos - r <= e.length - _e; ) {
                    let i = e.filePos,
                        n = se(e);
                    if (!n) break;
                    yield { boxInfo: n, slice: e }, (e.filePos = i + n.totalSize);
                }
            }
            traverseBox(e) {
                let r = e.filePos,
                    i = se(e);
                if (!i) return !1;
                let n = e.filePos,
                    a = r + i.totalSize;
                switch (i.name) {
                    case "mdia":
                    case "minf":
                    case "dinf":
                    case "mfra":
                    case "edts":
                        this.readContiguousBoxes(e.slice(n, i.contentSize));
                        break;
                    case "mvhd":
                        {
                            let s = P(e);
                            e.skip(3),
                                s === 1
                                    ? (e.skip(16), (this.movieTimescale = y(e)), (this.movieDurationInTimescale = $(e)))
                                    : (e.skip(8), (this.movieTimescale = y(e)), (this.movieDurationInTimescale = y(e)));
                        }
                        break;
                    case "trak":
                        {
                            let s = {
                                id: -1,
                                demuxer: this,
                                inputTrack: null,
                                info: null,
                                timescale: -1,
                                durationInMovieTimescale: -1,
                                durationInMediaTimescale: -1,
                                rotation: 0,
                                internalCodecId: null,
                                name: null,
                                languageCode: q,
                                sampleTableByteOffset: -1,
                                sampleTable: null,
                                fragmentLookupTable: [],
                                currentFragmentState: null,
                                fragmentPositionCache: [],
                                editListPreviousSegmentDurations: 0,
                                editListOffset: 0,
                            };
                            if (
                                ((this.currentTrack = s),
                                this.readContiguousBoxes(e.slice(n, i.contentSize)),
                                s.id !== -1 && s.timescale !== -1 && s.info !== null)
                            ) {
                                if (s.info.type === "video" && s.info.width !== -1) {
                                    let o = s;
                                    (s.inputTrack = new me(this.input, new xr(o))), this.tracks.push(s);
                                } else if (s.info.type === "audio" && s.info.numberOfChannels !== -1) {
                                    let o = s;
                                    (s.inputTrack = new W(this.input, new Tr(o))), this.tracks.push(s);
                                }
                            }
                            this.currentTrack = null;
                        }
                        break;
                    case "tkhd":
                        {
                            let s = this.currentTrack;
                            if (!s) break;
                            let o = P(e);
                            if (!((ge(e) & 1) !== 0)) break;
                            if (o === 0) e.skip(8), (s.id = y(e)), e.skip(4), (s.durationInMovieTimescale = y(e));
                            else if (o === 1) e.skip(16), (s.id = y(e)), e.skip(4), (s.durationInMovieTimescale = $(e));
                            else throw new Error(`Incorrect track header version ${o}.`);
                            e.skip(16);
                            let d = [pe(e), pe(e), vt(e), pe(e), pe(e), vt(e), pe(e), pe(e), vt(e)],
                                u = ht(Wr(Sn(d), 90));
                            p(u === 0 || u === 90 || u === 180 || u === 270), (s.rotation = u);
                        }
                        break;
                    case "elst":
                        {
                            let s = this.currentTrack;
                            if (!s) break;
                            let o = P(e);
                            e.skip(3);
                            let c = !1,
                                l = 0,
                                d = y(e);
                            for (let u = 0; u < d; u++) {
                                let f = o === 1 ? $(e) : y(e),
                                    h = o === 1 ? hi(e) : ae(e),
                                    m = pe(e);
                                if (f !== 0) {
                                    if (c) {
                                        console.warn(
                                            "Unsupported edit list: multiple edits are not currently supported. Only using first edit."
                                        );
                                        break;
                                    }
                                    if (h === -1) {
                                        l += f;
                                        continue;
                                    }
                                    if (m !== 1) {
                                        console.warn("Unsupported edit list entry: media rate must be 1.");
                                        break;
                                    }
                                    (s.editListPreviousSegmentDurations = l), (s.editListOffset = h), (c = !0);
                                }
                            }
                        }
                        break;
                    case "mdhd":
                        {
                            let s = this.currentTrack;
                            if (!s) break;
                            let o = P(e);
                            e.skip(3),
                                o === 0
                                    ? (e.skip(8), (s.timescale = y(e)), (s.durationInMediaTimescale = y(e)))
                                    : o === 1 &&
                                      (e.skip(16), (s.timescale = y(e)), (s.durationInMediaTimescale = $(e)));
                            let c = L(e);
                            if (c > 0) {
                                s.languageCode = "";
                                for (let l = 0; l < 3; l++)
                                    (s.languageCode = String.fromCharCode(96 + (c & 31)) + s.languageCode), (c >>= 5);
                                St(s.languageCode) || (s.languageCode = q);
                            }
                        }
                        break;
                    case "hdlr":
                        {
                            let s = this.currentTrack;
                            if (!s) break;
                            e.skip(8);
                            let o = M(e, 4);
                            o === "vide"
                                ? (s.info = {
                                      type: "video",
                                      width: -1,
                                      height: -1,
                                      codec: null,
                                      codecDescription: null,
                                      colorSpace: null,
                                      avcCodecInfo: null,
                                      hevcCodecInfo: null,
                                      vp9CodecInfo: null,
                                      av1CodecInfo: null,
                                  })
                                : o === "soun" &&
                                  (s.info = {
                                      type: "audio",
                                      numberOfChannels: -1,
                                      sampleRate: -1,
                                      codec: null,
                                      codecDescription: null,
                                      aacCodecInfo: null,
                                  });
                        }
                        break;
                    case "stbl":
                        {
                            let s = this.currentTrack;
                            if (!s) break;
                            (s.sampleTableByteOffset = r), this.readContiguousBoxes(e.slice(n, i.contentSize));
                        }
                        break;
                    case "stsd":
                        {
                            let s = this.currentTrack;
                            if (!s || s.info === null || s.sampleTable) break;
                            let o = P(e);
                            e.skip(3);
                            let c = y(e);
                            for (let l = 0; l < c; l++) {
                                let d = e.filePos,
                                    u = se(e);
                                if (!u) break;
                                s.internalCodecId = u.name;
                                let f = u.name.toLowerCase();
                                if (s.info.type === "video")
                                    f === "avc1"
                                        ? (s.info.codec = "avc")
                                        : f === "hvc1" || f === "hev1"
                                          ? (s.info.codec = "hevc")
                                          : f === "vp08"
                                            ? (s.info.codec = "vp8")
                                            : f === "vp09"
                                              ? (s.info.codec = "vp9")
                                              : f === "av01"
                                                ? (s.info.codec = "av1")
                                                : console.warn(
                                                      `Unsupported video codec (sample entry type '${u.name}').`
                                                  ),
                                        e.skip(24),
                                        (s.info.width = L(e)),
                                        (s.info.height = L(e)),
                                        e.skip(50),
                                        this.readContiguousBoxes(e.slice(e.filePos, d + u.totalSize - e.filePos));
                                else {
                                    f === "mp4a" ||
                                        (f === "opus"
                                            ? (s.info.codec = "opus")
                                            : f === "flac"
                                              ? (s.info.codec = "flac")
                                              : f === "twos" ||
                                                f === "sowt" ||
                                                f === "raw " ||
                                                f === "in24" ||
                                                f === "in32" ||
                                                f === "fl32" ||
                                                f === "fl64" ||
                                                f === "lpcm" ||
                                                f === "ipcm" ||
                                                f === "fpcm" ||
                                                (f === "ulaw"
                                                    ? (s.info.codec = "ulaw")
                                                    : f === "alaw"
                                                      ? (s.info.codec = "alaw")
                                                      : console.warn(
                                                            `Unsupported audio codec (sample entry type '${u.name}').`
                                                        ))),
                                        e.skip(8);
                                    let h = L(e);
                                    e.skip(6);
                                    let m = L(e),
                                        k = L(e);
                                    e.skip(4);
                                    let b = y(e) / 65536;
                                    if (o === 0 && h > 0) {
                                        if (h === 1) e.skip(4), (k = 8 * y(e)), e.skip(8);
                                        else if (h === 2) {
                                            e.skip(4), (b = Bt(e)), (m = y(e)), e.skip(4), (k = y(e));
                                            let x = y(e);
                                            if ((e.skip(8), f === "lpcm")) {
                                                let g = (k + 7) >> 3,
                                                    w = !!(x & 1),
                                                    T = !!(x & 2),
                                                    I = x & 4 ? -1 : 0;
                                                k > 0 &&
                                                    k <= 64 &&
                                                    (w
                                                        ? k === 32 && (s.info.codec = T ? "pcm-f32be" : "pcm-f32")
                                                        : I & (1 << (g - 1))
                                                          ? g === 1
                                                              ? (s.info.codec = "pcm-s8")
                                                              : g === 2
                                                                ? (s.info.codec = T ? "pcm-s16be" : "pcm-s16")
                                                                : g === 3
                                                                  ? (s.info.codec = T ? "pcm-s24be" : "pcm-s24")
                                                                  : g === 4 &&
                                                                    (s.info.codec = T ? "pcm-s32be" : "pcm-s32")
                                                          : g === 1 && (s.info.codec = "pcm-u8")),
                                                    s.info.codec === null && console.warn("Unsupported PCM format.");
                                            }
                                        }
                                    }
                                    s.info.codec === "opus" && (b = Pe),
                                        (s.info.numberOfChannels = m),
                                        (s.info.sampleRate = b),
                                        f === "twos"
                                            ? k === 8
                                                ? (s.info.codec = "pcm-s8")
                                                : k === 16
                                                  ? (s.info.codec = "pcm-s16be")
                                                  : (console.warn(`Unsupported sample size ${k} for codec 'twos'.`),
                                                    (s.info.codec = null))
                                            : f === "sowt"
                                              ? k === 8
                                                  ? (s.info.codec = "pcm-s8")
                                                  : k === 16
                                                    ? (s.info.codec = "pcm-s16")
                                                    : (console.warn(`Unsupported sample size ${k} for codec 'sowt'.`),
                                                      (s.info.codec = null))
                                              : f === "raw "
                                                ? (s.info.codec = "pcm-u8")
                                                : f === "in24"
                                                  ? (s.info.codec = "pcm-s24be")
                                                  : f === "in32"
                                                    ? (s.info.codec = "pcm-s32be")
                                                    : f === "fl32"
                                                      ? (s.info.codec = "pcm-f32be")
                                                      : f === "fl64"
                                                        ? (s.info.codec = "pcm-f64be")
                                                        : f === "ipcm"
                                                          ? (s.info.codec = "pcm-s16be")
                                                          : f === "fpcm" && (s.info.codec = "pcm-f32be"),
                                        this.readContiguousBoxes(e.slice(e.filePos, d + u.totalSize - e.filePos));
                                }
                            }
                        }
                        break;
                    case "avcC":
                        {
                            let s = this.currentTrack;
                            if (!s) break;
                            p(s.info), (s.info.codecDescription = _(e, i.contentSize));
                        }
                        break;
                    case "hvcC":
                        {
                            let s = this.currentTrack;
                            if (!s) break;
                            p(s.info), (s.info.codecDescription = _(e, i.contentSize));
                        }
                        break;
                    case "vpcC":
                        {
                            let s = this.currentTrack;
                            if (!s) break;
                            p(s.info?.type === "video"), e.skip(4);
                            let o = P(e),
                                c = P(e),
                                l = P(e),
                                d = l >> 4,
                                u = (l >> 1) & 7,
                                f = l & 1,
                                h = P(e),
                                m = P(e),
                                k = P(e);
                            s.info.vp9CodecInfo = {
                                profile: o,
                                level: c,
                                bitDepth: d,
                                chromaSubsampling: u,
                                videoFullRangeFlag: f,
                                colourPrimaries: h,
                                transferCharacteristics: m,
                                matrixCoefficients: k,
                            };
                        }
                        break;
                    case "av1C":
                        {
                            let s = this.currentTrack;
                            if (!s) break;
                            p(s.info?.type === "video"), e.skip(1);
                            let o = P(e),
                                c = o >> 5,
                                l = o & 31,
                                d = P(e),
                                u = d >> 7,
                                f = (d >> 6) & 1,
                                h = (d >> 5) & 1,
                                m = (d >> 4) & 1,
                                k = (d >> 3) & 1,
                                b = (d >> 2) & 1,
                                x = d & 3,
                                g = c === 2 && f ? (h ? 12 : 10) : f ? 10 : 8;
                            s.info.av1CodecInfo = {
                                profile: c,
                                level: l,
                                tier: u,
                                bitDepth: g,
                                monochrome: m,
                                chromaSubsamplingX: k,
                                chromaSubsamplingY: b,
                                chromaSamplePosition: x,
                            };
                        }
                        break;
                    case "colr":
                        {
                            let s = this.currentTrack;
                            if (!s || (p(s.info?.type === "video"), M(e, 4) !== "nclx")) break;
                            let c = L(e),
                                l = L(e),
                                d = L(e),
                                u = !!(P(e) & 128);
                            s.info.colorSpace = { primaries: pt[c], transfer: gt[l], matrix: kt[d], fullRange: u };
                        }
                        break;
                    case "wave":
                        this.readContiguousBoxes(e.slice(n, i.contentSize));
                        break;
                    case "esds":
                        {
                            let s = this.currentTrack;
                            if (!s) break;
                            p(s.info?.type === "audio"), e.skip(4);
                            let o = P(e);
                            p(o === 3), At(e), e.skip(2);
                            let c = P(e),
                                l = (c & 128) !== 0,
                                d = (c & 64) !== 0,
                                u = (c & 32) !== 0;
                            if ((l && e.skip(2), d)) {
                                let b = P(e);
                                e.skip(b);
                            }
                            u && e.skip(2);
                            let f = P(e);
                            p(f === 4);
                            let h = At(e),
                                m = e.filePos,
                                k = P(e);
                            if (
                                (k === 64 || k === 103
                                    ? ((s.info.codec = "aac"), (s.info.aacCodecInfo = { isMpeg2: k === 103 }))
                                    : k === 105 || k === 107
                                      ? (s.info.codec = "mp3")
                                      : k === 221
                                        ? (s.info.codec = "vorbis")
                                        : console.warn(
                                              `Unsupported audio codec (objectTypeIndication ${k}) - discarding track.`
                                          ),
                                e.skip(12),
                                h > e.filePos - m)
                            ) {
                                let b = P(e);
                                p(b === 5);
                                let x = At(e);
                                if (((s.info.codecDescription = _(e, x)), s.info.codec === "aac")) {
                                    let g = gr(s.info.codecDescription);
                                    g.numberOfChannels !== null && (s.info.numberOfChannels = g.numberOfChannels),
                                        g.sampleRate !== null && (s.info.sampleRate = g.sampleRate);
                                }
                            }
                        }
                        break;
                    case "enda":
                        {
                            let s = this.currentTrack;
                            if (!s) break;
                            p(s.info?.type === "audio"),
                                L(e) & 255 &&
                                    (s.info.codec === "pcm-s16be"
                                        ? (s.info.codec = "pcm-s16")
                                        : s.info.codec === "pcm-s24be"
                                          ? (s.info.codec = "pcm-s24")
                                          : s.info.codec === "pcm-s32be"
                                            ? (s.info.codec = "pcm-s32")
                                            : s.info.codec === "pcm-f32be"
                                              ? (s.info.codec = "pcm-f32")
                                              : s.info.codec === "pcm-f64be" && (s.info.codec = "pcm-f64"));
                        }
                        break;
                    case "pcmC": {
                        let s = this.currentTrack;
                        if (!s) break;
                        p(s.info?.type === "audio"), e.skip(4);
                        let c = !!(P(e) & 1),
                            l = P(e);
                        s.info.codec === "pcm-s16be"
                            ? c
                                ? l === 16
                                    ? (s.info.codec = "pcm-s16")
                                    : l === 24
                                      ? (s.info.codec = "pcm-s24")
                                      : l === 32
                                        ? (s.info.codec = "pcm-s32")
                                        : (console.warn(`Invalid ipcm sample size ${l}.`), (s.info.codec = null))
                                : l === 16
                                  ? (s.info.codec = "pcm-s16be")
                                  : l === 24
                                    ? (s.info.codec = "pcm-s24be")
                                    : l === 32
                                      ? (s.info.codec = "pcm-s32be")
                                      : (console.warn(`Invalid ipcm sample size ${l}.`), (s.info.codec = null))
                            : s.info.codec === "pcm-f32be" &&
                              (c
                                  ? l === 32
                                      ? (s.info.codec = "pcm-f32")
                                      : l === 64
                                        ? (s.info.codec = "pcm-f64")
                                        : (console.warn(`Invalid fpcm sample size ${l}.`), (s.info.codec = null))
                                  : l === 32
                                    ? (s.info.codec = "pcm-f32be")
                                    : l === 64
                                      ? (s.info.codec = "pcm-f64be")
                                      : (console.warn(`Invalid fpcm sample size ${l}.`), (s.info.codec = null)));
                        break;
                    }
                    case "dOps":
                        {
                            let s = this.currentTrack;
                            if (!s) break;
                            p(s.info?.type === "audio"), e.skip(1);
                            let o = P(e),
                                c = L(e),
                                l = y(e),
                                d = it(e),
                                u = P(e),
                                f;
                            u !== 0 ? (f = _(e, 2 + o)) : (f = new Uint8Array(0));
                            let h = new Uint8Array(19 + f.byteLength),
                                m = new DataView(h.buffer);
                            m.setUint32(0, 1332770163, !1),
                                m.setUint32(4, 1214603620, !1),
                                m.setUint8(8, 1),
                                m.setUint8(9, o),
                                m.setUint16(10, c, !0),
                                m.setUint32(12, l, !0),
                                m.setInt16(16, d, !0),
                                m.setUint8(18, u),
                                h.set(f, 19),
                                (s.info.codecDescription = h),
                                (s.info.numberOfChannels = o);
                        }
                        break;
                    case "dfLa":
                        {
                            let s = this.currentTrack;
                            if (!s) break;
                            p(s.info?.type === "audio"), e.skip(4);
                            let o = 127,
                                c = 128,
                                l = e.filePos;
                            for (; e.filePos < a; ) {
                                let m = P(e),
                                    k = ge(e);
                                if ((m & o) === he.STREAMINFO) {
                                    e.skip(10);
                                    let x = y(e),
                                        g = x >>> 12,
                                        w = ((x >> 9) & 7) + 1;
                                    (s.info.sampleRate = g), (s.info.numberOfChannels = w), e.skip(20);
                                } else e.skip(k);
                                if (m & c) break;
                            }
                            let d = e.filePos;
                            e.filePos = l;
                            let u = _(e, d - l),
                                f = new Uint8Array(4 + u.byteLength);
                            new DataView(f.buffer).setUint32(0, 1716281667, !1),
                                f.set(u, 4),
                                (s.info.codecDescription = f);
                        }
                        break;
                    case "stts":
                        {
                            let s = this.currentTrack;
                            if (!s || !s.sampleTable) break;
                            e.skip(4);
                            let o = y(e),
                                c = 0,
                                l = 0;
                            for (let d = 0; d < o; d++) {
                                let u = y(e),
                                    f = y(e);
                                s.sampleTable.sampleTimingEntries.push({
                                    startIndex: c,
                                    startDecodeTimestamp: l,
                                    count: u,
                                    delta: f,
                                }),
                                    (c += u),
                                    (l += u * f);
                            }
                        }
                        break;
                    case "ctts":
                        {
                            let s = this.currentTrack;
                            if (!s || !s.sampleTable) break;
                            e.skip(4);
                            let o = y(e),
                                c = 0;
                            for (let l = 0; l < o; l++) {
                                let d = y(e),
                                    u = ae(e);
                                s.sampleTable.sampleCompositionTimeOffsets.push({ startIndex: c, count: d, offset: u }),
                                    (c += d);
                            }
                        }
                        break;
                    case "stsz":
                        {
                            let s = this.currentTrack;
                            if (!s || !s.sampleTable) break;
                            e.skip(4);
                            let o = y(e),
                                c = y(e);
                            if (o === 0)
                                for (let l = 0; l < c; l++) {
                                    let d = y(e);
                                    s.sampleTable.sampleSizes.push(d);
                                }
                            else s.sampleTable.sampleSizes.push(o);
                        }
                        break;
                    case "stz2":
                        {
                            let s = this.currentTrack;
                            if (!s || !s.sampleTable) break;
                            e.skip(4), e.skip(3);
                            let o = P(e),
                                c = y(e),
                                l = _(e, Math.ceil((c * o) / 8)),
                                d = new N(l);
                            for (let u = 0; u < c; u++) {
                                let f = d.readBits(o);
                                s.sampleTable.sampleSizes.push(f);
                            }
                        }
                        break;
                    case "stss":
                        {
                            let s = this.currentTrack;
                            if (!s || !s.sampleTable) break;
                            e.skip(4), (s.sampleTable.keySampleIndices = []);
                            let o = y(e);
                            for (let c = 0; c < o; c++) {
                                let l = y(e) - 1;
                                s.sampleTable.keySampleIndices.push(l);
                            }
                            s.sampleTable.keySampleIndices[0] !== 0 && s.sampleTable.keySampleIndices.unshift(0);
                        }
                        break;
                    case "stsc":
                        {
                            let s = this.currentTrack;
                            if (!s || !s.sampleTable) break;
                            e.skip(4);
                            let o = y(e);
                            for (let l = 0; l < o; l++) {
                                let d = y(e) - 1,
                                    u = y(e),
                                    f = y(e);
                                s.sampleTable.sampleToChunk.push({
                                    startSampleIndex: -1,
                                    startChunkIndex: d,
                                    samplesPerChunk: u,
                                    sampleDescriptionIndex: f,
                                });
                            }
                            let c = 0;
                            for (let l = 0; l < s.sampleTable.sampleToChunk.length; l++)
                                if (
                                    ((s.sampleTable.sampleToChunk[l].startSampleIndex = c),
                                    l < s.sampleTable.sampleToChunk.length - 1)
                                ) {
                                    let u =
                                        s.sampleTable.sampleToChunk[l + 1].startChunkIndex -
                                        s.sampleTable.sampleToChunk[l].startChunkIndex;
                                    c += u * s.sampleTable.sampleToChunk[l].samplesPerChunk;
                                }
                        }
                        break;
                    case "stco":
                        {
                            let s = this.currentTrack;
                            if (!s || !s.sampleTable) break;
                            e.skip(4);
                            let o = y(e);
                            for (let c = 0; c < o; c++) {
                                let l = y(e);
                                s.sampleTable.chunkOffsets.push(l);
                            }
                        }
                        break;
                    case "co64":
                        {
                            let s = this.currentTrack;
                            if (!s || !s.sampleTable) break;
                            e.skip(4);
                            let o = y(e);
                            for (let c = 0; c < o; c++) {
                                let l = $(e);
                                s.sampleTable.chunkOffsets.push(l);
                            }
                        }
                        break;
                    case "mvex":
                        (this.isFragmented = !0), this.readContiguousBoxes(e.slice(n, i.contentSize));
                        break;
                    case "mehd":
                        {
                            let s = P(e);
                            e.skip(3);
                            let o = s === 1 ? $(e) : y(e);
                            this.movieDurationInTimescale = o;
                        }
                        break;
                    case "trex":
                        {
                            e.skip(4);
                            let s = y(e),
                                o = y(e),
                                c = y(e),
                                l = y(e),
                                d = y(e);
                            this.fragmentTrackDefaults.push({
                                trackId: s,
                                defaultSampleDescriptionIndex: o,
                                defaultSampleDuration: c,
                                defaultSampleSize: l,
                                defaultSampleFlags: d,
                            });
                        }
                        break;
                    case "tfra":
                        {
                            let s = P(e);
                            e.skip(3);
                            let o = y(e),
                                c = this.tracks.find((g) => g.id === o);
                            if (!c) break;
                            let l = y(e),
                                d = (l & 48) >> 4,
                                u = (l & 12) >> 2,
                                f = l & 3,
                                h = [P, L, ge, y],
                                m = h[d],
                                k = h[u],
                                b = h[f],
                                x = y(e);
                            for (let g = 0; g < x; g++) {
                                let w = s === 1 ? $(e) : y(e),
                                    T = s === 1 ? $(e) : y(e);
                                m(e), k(e), b(e), c.fragmentLookupTable.push({ timestamp: w, moofOffset: T });
                            }
                            c.fragmentLookupTable.sort((g, w) => g.timestamp - w.timestamp);
                            for (let g = 0; g < c.fragmentLookupTable.length - 1; g++) {
                                let w = c.fragmentLookupTable[g],
                                    T = c.fragmentLookupTable[g + 1];
                                w.timestamp === T.timestamp && (c.fragmentLookupTable.splice(g + 1, 1), g--);
                            }
                        }
                        break;
                    case "moof":
                        (this.currentFragment = {
                            moofOffset: r,
                            moofSize: i.totalSize,
                            implicitBaseDataOffset: r,
                            trackData: new Map(),
                        }),
                            this.readContiguousBoxes(e.slice(n, i.contentSize)),
                            (this.lastReadFragment = this.currentFragment),
                            (this.currentFragment = null);
                        break;
                    case "traf":
                        if (
                            (p(this.currentFragment),
                            this.readContiguousBoxes(e.slice(n, i.contentSize)),
                            this.currentTrack)
                        ) {
                            let s = this.currentFragment.trackData.get(this.currentTrack.id);
                            if (s) {
                                let { currentFragmentState: o } = this.currentTrack;
                                p(o),
                                    o.startTimestamp !== null &&
                                        (Sr(s, o.startTimestamp), (s.startTimestampIsFinal = !0));
                            }
                            (this.currentTrack.currentFragmentState = null), (this.currentTrack = null);
                        }
                        break;
                    case "tfhd":
                        {
                            p(this.currentFragment), e.skip(1);
                            let s = ge(e),
                                o = !!(s & 1),
                                c = !!(s & 2),
                                l = !!(s & 8),
                                d = !!(s & 16),
                                u = !!(s & 32),
                                f = !!(s & 65536),
                                h = !!(s & 131072),
                                m = y(e),
                                k = this.tracks.find((x) => x.id === m);
                            if (!k) break;
                            let b = this.fragmentTrackDefaults.find((x) => x.trackId === m);
                            (this.currentTrack = k),
                                (k.currentFragmentState = {
                                    baseDataOffset: this.currentFragment.implicitBaseDataOffset,
                                    sampleDescriptionIndex: b?.defaultSampleDescriptionIndex ?? null,
                                    defaultSampleDuration: b?.defaultSampleDuration ?? null,
                                    defaultSampleSize: b?.defaultSampleSize ?? null,
                                    defaultSampleFlags: b?.defaultSampleFlags ?? null,
                                    startTimestamp: null,
                                }),
                                o
                                    ? (k.currentFragmentState.baseDataOffset = $(e))
                                    : h && (k.currentFragmentState.baseDataOffset = this.currentFragment.moofOffset),
                                c && (k.currentFragmentState.sampleDescriptionIndex = y(e)),
                                l && (k.currentFragmentState.defaultSampleDuration = y(e)),
                                d && (k.currentFragmentState.defaultSampleSize = y(e)),
                                u && (k.currentFragmentState.defaultSampleFlags = y(e)),
                                f && (k.currentFragmentState.defaultSampleDuration = 0);
                        }
                        break;
                    case "tfdt":
                        {
                            let s = this.currentTrack;
                            if (!s) break;
                            p(s.currentFragmentState);
                            let o = P(e);
                            e.skip(3);
                            let c = o === 0 ? y(e) : $(e);
                            s.currentFragmentState.startTimestamp = c;
                        }
                        break;
                    case "trun":
                        {
                            let s = this.currentTrack;
                            if (!s) break;
                            if (
                                (p(this.currentFragment),
                                p(s.currentFragmentState),
                                this.currentFragment.trackData.has(s.id))
                            ) {
                                console.warn(
                                    "Can't have two trun boxes for the same track in one fragment. Ignoring..."
                                );
                                break;
                            }
                            let o = P(e),
                                c = ge(e),
                                l = !!(c & 1),
                                d = !!(c & 4),
                                u = !!(c & 256),
                                f = !!(c & 512),
                                h = !!(c & 1024),
                                m = !!(c & 2048),
                                k = y(e),
                                b = s.currentFragmentState.baseDataOffset;
                            l && (b += ae(e));
                            let x = null;
                            d && (x = y(e));
                            let g = b;
                            if (k === 0) {
                                this.currentFragment.implicitBaseDataOffset = g;
                                break;
                            }
                            let w = 0,
                                T = {
                                    track: s,
                                    startTimestamp: 0,
                                    endTimestamp: 0,
                                    firstKeyFrameTimestamp: null,
                                    samples: [],
                                    presentationTimestamps: [],
                                    startTimestampIsFinal: !1,
                                };
                            this.currentFragment.trackData.set(s.id, T);
                            for (let A = 0; A < k; A++) {
                                let v;
                                u
                                    ? (v = y(e))
                                    : (p(s.currentFragmentState.defaultSampleDuration !== null),
                                      (v = s.currentFragmentState.defaultSampleDuration));
                                let R;
                                f
                                    ? (R = y(e))
                                    : (p(s.currentFragmentState.defaultSampleSize !== null),
                                      (R = s.currentFragmentState.defaultSampleSize));
                                let z;
                                h
                                    ? (z = y(e))
                                    : (p(s.currentFragmentState.defaultSampleFlags !== null),
                                      (z = s.currentFragmentState.defaultSampleFlags)),
                                    A === 0 && x !== null && (z = x);
                                let B = 0;
                                m && (o === 0 ? (B = y(e)) : (B = ae(e)));
                                let J = !(z & 65536);
                                T.samples.push({
                                    presentationTimestamp: w + B,
                                    duration: v,
                                    byteOffset: g,
                                    byteSize: R,
                                    isKeyFrame: J,
                                }),
                                    (g += R),
                                    (w += v);
                            }
                            T.presentationTimestamps = T.samples
                                .map((A, v) => ({ presentationTimestamp: A.presentationTimestamp, sampleIndex: v }))
                                .sort((A, v) => A.presentationTimestamp - v.presentationTimestamp);
                            for (let A = 0; A < T.presentationTimestamps.length; A++) {
                                let v = T.presentationTimestamps[A],
                                    R = T.samples[v.sampleIndex];
                                if (
                                    (T.firstKeyFrameTimestamp === null &&
                                        R.isKeyFrame &&
                                        (T.firstKeyFrameTimestamp = R.presentationTimestamp),
                                    A < T.presentationTimestamps.length - 1)
                                ) {
                                    let z = T.presentationTimestamps[A + 1];
                                    R.duration = z.presentationTimestamp - v.presentationTimestamp;
                                }
                            }
                            let I = T.samples[T.presentationTimestamps[0].sampleIndex],
                                E = T.samples[G(T.presentationTimestamps).sampleIndex];
                            (T.startTimestamp = I.presentationTimestamp),
                                (T.endTimestamp = E.presentationTimestamp + E.duration),
                                (this.currentFragment.implicitBaseDataOffset = g);
                        }
                        break;
                    case "udta":
                        {
                            let s = this.iterateContiguousBoxes(e.slice(n, i.contentSize));
                            for (let { boxInfo: o, slice: c } of s) {
                                if (o.name !== "meta" && !this.currentTrack) {
                                    let l = c.filePos;
                                    (this.metadataTags.raw ??= {}),
                                        o.name[0] === "\xA9"
                                            ? (this.metadataTags.raw[o.name] ??= ee(c))
                                            : (this.metadataTags.raw[o.name] ??= _(c, o.contentSize)),
                                        (c.filePos = l);
                                }
                                switch (o.name) {
                                    case "meta":
                                        c.skip(-o.headerSize), this.traverseBox(c);
                                        break;
                                    case "\xA9nam":
                                    case "name":
                                        this.currentTrack
                                            ? (this.currentTrack.name = H.decode(_(c, o.contentSize)))
                                            : (this.metadataTags.title ??= ee(c));
                                        break;
                                    case "\xA9des":
                                        this.currentTrack || (this.metadataTags.description ??= ee(c));
                                        break;
                                    case "\xA9ART":
                                        this.currentTrack || (this.metadataTags.artist ??= ee(c));
                                        break;
                                    case "\xA9alb":
                                        this.currentTrack || (this.metadataTags.album ??= ee(c));
                                        break;
                                    case "albr":
                                        this.currentTrack || (this.metadataTags.albumArtist ??= ee(c));
                                        break;
                                    case "\xA9gen":
                                        this.currentTrack || (this.metadataTags.genre ??= ee(c));
                                        break;
                                    case "\xA9day":
                                        if (!this.currentTrack) {
                                            let l = new Date(ee(c));
                                            Number.isNaN(l.getTime()) || (this.metadataTags.date ??= l);
                                        }
                                        break;
                                    case "\xA9cmt":
                                        this.currentTrack || (this.metadataTags.comment ??= ee(c));
                                        break;
                                    case "\xA9lyr":
                                        this.currentTrack || (this.metadataTags.lyrics ??= ee(c));
                                        break;
                                }
                            }
                        }
                        break;
                    case "meta":
                        {
                            if (this.currentTrack) break;
                            let o = y(e) !== 0;
                            (this.currentMetadataKeys = new Map()),
                                o
                                    ? this.readContiguousBoxes(e.slice(n, i.contentSize))
                                    : this.readContiguousBoxes(e.slice(n + 4, i.contentSize - 4)),
                                (this.currentMetadataKeys = null);
                        }
                        break;
                    case "keys":
                        {
                            if (!this.currentMetadataKeys) break;
                            e.skip(4);
                            let s = y(e);
                            for (let o = 0; o < s; o++) {
                                let c = y(e);
                                e.skip(4);
                                let l = H.decode(_(e, c - 8));
                                this.currentMetadataKeys.set(o + 1, l);
                            }
                        }
                        break;
                    case "ilst":
                        {
                            if (!this.currentMetadataKeys) break;
                            let s = this.iterateContiguousBoxes(e.slice(n, i.contentSize));
                            for (let { boxInfo: o, slice: c } of s) {
                                let l = o.name,
                                    d =
                                        (l.charCodeAt(0) << 24) +
                                        (l.charCodeAt(1) << 16) +
                                        (l.charCodeAt(2) << 8) +
                                        l.charCodeAt(3);
                                this.currentMetadataKeys.has(d) && (l = this.currentMetadataKeys.get(d));
                                let u = ui(c);
                                switch (((this.metadataTags.raw ??= {}), (this.metadataTags.raw[l] ??= u), l)) {
                                    case "\xA9nam":
                                    case "titl":
                                    case "com.apple.quicktime.title":
                                    case "title":
                                        typeof u == "string" && (this.metadataTags.title ??= u);
                                        break;
                                    case "\xA9des":
                                    case "desc":
                                    case "dscp":
                                    case "com.apple.quicktime.description":
                                    case "description":
                                        typeof u == "string" && (this.metadataTags.description ??= u);
                                        break;
                                    case "\xA9ART":
                                    case "com.apple.quicktime.artist":
                                    case "artist":
                                        typeof u == "string" && (this.metadataTags.artist ??= u);
                                        break;
                                    case "\xA9alb":
                                    case "albm":
                                    case "com.apple.quicktime.album":
                                    case "album":
                                        typeof u == "string" && (this.metadataTags.album ??= u);
                                        break;
                                    case "aART":
                                    case "album_artist":
                                        typeof u == "string" && (this.metadataTags.albumArtist ??= u);
                                        break;
                                    case "\xA9cmt":
                                    case "com.apple.quicktime.comment":
                                    case "comment":
                                        typeof u == "string" && (this.metadataTags.comment ??= u);
                                        break;
                                    case "\xA9gen":
                                    case "gnre":
                                    case "com.apple.quicktime.genre":
                                    case "genre":
                                        typeof u == "string" && (this.metadataTags.genre ??= u);
                                        break;
                                    case "\xA9lyr":
                                    case "lyrics":
                                        typeof u == "string" && (this.metadataTags.lyrics ??= u);
                                        break;
                                    case "\xA9day":
                                    case "rldt":
                                    case "com.apple.quicktime.creationdate":
                                    case "date":
                                        if (typeof u == "string") {
                                            let f = new Date(u);
                                            Number.isNaN(f.getTime()) || (this.metadataTags.date ??= f);
                                        }
                                        break;
                                    case "covr":
                                    case "com.apple.quicktime.artwork":
                                        u instanceof fe
                                            ? ((this.metadataTags.images ??= []),
                                              this.metadataTags.images.push({
                                                  data: u.data,
                                                  kind: "coverFront",
                                                  mimeType: u.mimeType,
                                              }))
                                            : u instanceof Uint8Array &&
                                              ((this.metadataTags.images ??= []),
                                              this.metadataTags.images.push({
                                                  data: u,
                                                  kind: "coverFront",
                                                  mimeType: "image/*",
                                              }));
                                        break;
                                    case "track":
                                        if (typeof u == "string") {
                                            let f = u.split("/"),
                                                h = Number.parseInt(f[0], 10),
                                                m = f[1] && Number.parseInt(f[1], 10);
                                            Number.isInteger(h) && h > 0 && (this.metadataTags.trackNumber ??= h),
                                                m &&
                                                    Number.isInteger(m) &&
                                                    m > 0 &&
                                                    (this.metadataTags.tracksTotal ??= m);
                                        }
                                        break;
                                    case "trkn":
                                        if (u instanceof Uint8Array && u.length >= 6) {
                                            let f = O(u),
                                                h = f.getUint16(2, !1),
                                                m = f.getUint16(4, !1);
                                            h > 0 && (this.metadataTags.trackNumber ??= h),
                                                m > 0 && (this.metadataTags.tracksTotal ??= m);
                                        }
                                        break;
                                    case "disc":
                                    case "disk":
                                        if (u instanceof Uint8Array && u.length >= 6) {
                                            let f = O(u),
                                                h = f.getUint16(2, !1),
                                                m = f.getUint16(4, !1);
                                            h > 0 && (this.metadataTags.discNumber ??= h),
                                                m > 0 && (this.metadataTags.discsTotal ??= m);
                                        }
                                        break;
                                }
                            }
                        }
                        break;
                }
                return (e.filePos = a), !0;
            }
        },
        Ft = class {
            constructor(e) {
                (this.internalTrack = e),
                    (this.packetToSampleIndex = new WeakMap()),
                    (this.packetToFragmentLocation = new WeakMap());
            }
            getId() {
                return this.internalTrack.id;
            }
            getCodec() {
                throw new Error("Not implemented on base class.");
            }
            getInternalCodecId() {
                return this.internalTrack.internalCodecId;
            }
            getName() {
                return this.internalTrack.name;
            }
            getLanguageCode() {
                return this.internalTrack.languageCode;
            }
            getTimeResolution() {
                return this.internalTrack.timescale;
            }
            async computeDuration() {
                let e = await this.getPacket(1 / 0, { metadataOnly: !0 });
                return (e?.timestamp ?? 0) + (e?.duration ?? 0);
            }
            async getFirstTimestamp() {
                return (await this.getFirstPacket({ metadataOnly: !0 }))?.timestamp ?? 0;
            }
            async getFirstPacket(e) {
                let r = await this.fetchPacketForSampleIndex(0, e);
                return r || !this.internalTrack.demuxer.isFragmented
                    ? r
                    : this.performFragmentedLookup(
                          null,
                          (i) =>
                              i.trackData.get(this.internalTrack.id)
                                  ? { sampleIndex: 0, correctSampleFound: !0 }
                                  : { sampleIndex: -1, correctSampleFound: !1 },
                          -1 / 0,
                          1 / 0,
                          e
                      );
            }
            mapTimestampIntoTimescale(e) {
                return Te(e * this.internalTrack.timescale, 14) + this.internalTrack.editListOffset;
            }
            async getPacket(e, r) {
                let i = this.mapTimestampIntoTimescale(e),
                    n = this.internalTrack.demuxer.getSampleTableForTrack(this.internalTrack),
                    a = di(n, i),
                    s = await this.fetchPacketForSampleIndex(a, r);
                return !fi(n) || !this.internalTrack.demuxer.isFragmented
                    ? s
                    : this.performFragmentedLookup(
                          null,
                          (o) => {
                              let c = o.trackData.get(this.internalTrack.id);
                              if (!c) return { sampleIndex: -1, correctSampleFound: !1 };
                              let l = F(c.presentationTimestamps, i, (f) => f.presentationTimestamp),
                                  d = l !== -1 ? c.presentationTimestamps[l].sampleIndex : -1,
                                  u = l !== -1 && i < c.endTimestamp;
                              return { sampleIndex: d, correctSampleFound: u };
                          },
                          i,
                          i,
                          r
                      );
            }
            async getNextPacket(e, r) {
                let i = this.packetToSampleIndex.get(e);
                if (i !== void 0) return this.fetchPacketForSampleIndex(i + 1, r);
                let n = this.packetToFragmentLocation.get(e);
                if (n === void 0) throw new Error("Packet was not created from this track.");
                return this.performFragmentedLookup(
                    n.fragment,
                    (a) => {
                        if (a === n.fragment) {
                            let s = a.trackData.get(this.internalTrack.id);
                            if (n.sampleIndex + 1 < s.samples.length)
                                return { sampleIndex: n.sampleIndex + 1, correctSampleFound: !0 };
                        } else if (a.trackData.get(this.internalTrack.id))
                            return { sampleIndex: 0, correctSampleFound: !0 };
                        return { sampleIndex: -1, correctSampleFound: !1 };
                    },
                    -1 / 0,
                    1 / 0,
                    r
                );
            }
            async getKeyPacket(e, r) {
                let i = this.mapTimestampIntoTimescale(e),
                    n = this.internalTrack.demuxer.getSampleTableForTrack(this.internalTrack),
                    a = di(n, i),
                    s = a === -1 ? -1 : kn(n, a),
                    o = await this.fetchPacketForSampleIndex(s, r);
                return !fi(n) || !this.internalTrack.demuxer.isFragmented
                    ? o
                    : this.performFragmentedLookup(
                          null,
                          (c) => {
                              let l = c.trackData.get(this.internalTrack.id);
                              if (!l) return { sampleIndex: -1, correctSampleFound: !1 };
                              let d = bt(
                                      l.presentationTimestamps,
                                      (h) => l.samples[h.sampleIndex].isKeyFrame && h.presentationTimestamp <= i
                                  ),
                                  u = d !== -1 ? l.presentationTimestamps[d].sampleIndex : -1,
                                  f = d !== -1 && i < l.endTimestamp;
                              return { sampleIndex: u, correctSampleFound: f };
                          },
                          i,
                          i,
                          r
                      );
            }
            async getNextKeyPacket(e, r) {
                let i = this.packetToSampleIndex.get(e);
                if (i !== void 0) {
                    let a = this.internalTrack.demuxer.getSampleTableForTrack(this.internalTrack),
                        s = bn(a, i);
                    return this.fetchPacketForSampleIndex(s, r);
                }
                let n = this.packetToFragmentLocation.get(e);
                if (n === void 0) throw new Error("Packet was not created from this track.");
                return this.performFragmentedLookup(
                    n.fragment,
                    (a) => {
                        if (a === n.fragment) {
                            let o = a.trackData
                                .get(this.internalTrack.id)
                                .samples.findIndex((c, l) => c.isKeyFrame && l > n.sampleIndex);
                            if (o !== -1) return { sampleIndex: o, correctSampleFound: !0 };
                        } else {
                            let s = a.trackData.get(this.internalTrack.id);
                            if (s && s.firstKeyFrameTimestamp !== null) {
                                let o = s.samples.findIndex((c) => c.isKeyFrame);
                                return p(o !== -1), { sampleIndex: o, correctSampleFound: !0 };
                            }
                        }
                        return { sampleIndex: -1, correctSampleFound: !1 };
                    },
                    -1 / 0,
                    1 / 0,
                    r
                );
            }
            async fetchPacketForSampleIndex(e, r) {
                if (e === -1) return null;
                let i = this.internalTrack.demuxer.getSampleTableForTrack(this.internalTrack),
                    n = gn(i, e);
                if (!n) return null;
                let a;
                if (r.metadataOnly) a = V;
                else {
                    let l = this.internalTrack.demuxer.reader.requestSlice(n.sampleOffset, n.sampleSize);
                    l instanceof Promise && (l = await l), p(l), (a = _(l, n.sampleSize));
                }
                let s = (n.presentationTimestamp - this.internalTrack.editListOffset) / this.internalTrack.timescale,
                    o = n.duration / this.internalTrack.timescale,
                    c = new U(a, n.isKeyFrame ? "key" : "delta", s, o, e, n.sampleSize);
                return this.packetToSampleIndex.set(c, e), c;
            }
            async fetchPacketInFragment(e, r, i) {
                if (r === -1) return null;
                let a = e.trackData.get(this.internalTrack.id).samples[r];
                p(a);
                let s;
                if (i.metadataOnly) s = V;
                else {
                    let d = this.internalTrack.demuxer.reader.requestSlice(a.byteOffset, a.byteSize);
                    d instanceof Promise && (d = await d), p(d), (s = _(d, a.byteSize));
                }
                let o = (a.presentationTimestamp - this.internalTrack.editListOffset) / this.internalTrack.timescale,
                    c = a.duration / this.internalTrack.timescale,
                    l = new U(s, a.isKeyFrame ? "key" : "delta", o, c, e.moofOffset + r, a.byteSize);
                return this.packetToFragmentLocation.set(l, { fragment: e, sampleIndex: r }), l;
            }
            async performFragmentedLookup(e, r, i, n, a) {
                let s = this.internalTrack.demuxer,
                    o = null,
                    c = null,
                    l = -1;
                if (e) {
                    let { sampleIndex: b, correctSampleFound: x } = r(e);
                    if (x) return this.fetchPacketInFragment(e, b, a);
                    b !== -1 && ((c = e), (l = b));
                }
                let d = F(this.internalTrack.fragmentLookupTable, i, (b) => b.timestamp),
                    u = d !== -1 ? this.internalTrack.fragmentLookupTable[d] : null,
                    f = F(this.internalTrack.fragmentPositionCache, i, (b) => b.startTimestamp),
                    h = f !== -1 ? this.internalTrack.fragmentPositionCache[f] : null,
                    m = Math.max(u?.moofOffset ?? 0, h?.moofOffset ?? 0) || null,
                    k;
                for (
                    e
                        ? m === null || e.moofOffset >= m
                            ? ((k = e.moofOffset + e.moofSize), (o = e))
                            : (k = m)
                        : (k = m ?? 0);
                    ;

                ) {
                    if (o) {
                        let w = o.trackData.get(this.internalTrack.id);
                        if (w && w.startTimestamp > n) break;
                    }
                    let b = s.reader.requestSliceRange(k, _e, Ne);
                    if ((b instanceof Promise && (b = await b), !b)) break;
                    let x = k,
                        g = se(b);
                    if (!g) break;
                    if (g.name === "moof") {
                        o = await s.readFragment(x);
                        let { sampleIndex: w, correctSampleFound: T } = r(o);
                        if (T) return this.fetchPacketInFragment(o, w, a);
                        w !== -1 && ((c = o), (l = w));
                    }
                    k = x + g.totalSize;
                }
                if (u && (!c || c.moofOffset < u.moofOffset)) {
                    let b = this.internalTrack.fragmentLookupTable[d - 1];
                    p(!b || b.timestamp < u.timestamp);
                    let x = b?.timestamp ?? -1 / 0;
                    return this.performFragmentedLookup(null, r, x, n, a);
                }
                return c ? this.fetchPacketInFragment(c, l, a) : null;
            }
        },
        xr = class extends Ft {
            constructor(e) {
                super(e), (this.decoderConfigPromise = null), (this.internalTrack = e);
            }
            getCodec() {
                return this.internalTrack.info.codec;
            }
            getCodedWidth() {
                return this.internalTrack.info.width;
            }
            getCodedHeight() {
                return this.internalTrack.info.height;
            }
            getRotation() {
                return this.internalTrack.rotation;
            }
            async getColorSpace() {
                return {
                    primaries: this.internalTrack.info.colorSpace?.primaries,
                    transfer: this.internalTrack.info.colorSpace?.transfer,
                    matrix: this.internalTrack.info.colorSpace?.matrix,
                    fullRange: this.internalTrack.info.colorSpace?.fullRange,
                };
            }
            async canBeTransparent() {
                return !1;
            }
            async getDecoderConfig() {
                return this.internalTrack.info.codec
                    ? (this.decoderConfigPromise ??= (async () => {
                          if (this.internalTrack.info.codec === "vp9" && !this.internalTrack.info.vp9CodecInfo) {
                              let e = await this.getFirstPacket({});
                              this.internalTrack.info.vp9CodecInfo = e && _t(e.data);
                          } else if (this.internalTrack.info.codec === "av1" && !this.internalTrack.info.av1CodecInfo) {
                              let e = await this.getFirstPacket({});
                              this.internalTrack.info.av1CodecInfo = e && Et(e.data);
                          }
                          return {
                              codec: yt(this.internalTrack.info),
                              codedWidth: this.internalTrack.info.width,
                              codedHeight: this.internalTrack.info.height,
                              description: this.internalTrack.info.codecDescription ?? void 0,
                              colorSpace: this.internalTrack.info.colorSpace ?? void 0,
                          };
                      })())
                    : null;
            }
        },
        Tr = class extends Ft {
            constructor(e) {
                super(e), (this.decoderConfig = null), (this.internalTrack = e);
            }
            getCodec() {
                return this.internalTrack.info.codec;
            }
            getNumberOfChannels() {
                return this.internalTrack.info.numberOfChannels;
            }
            getSampleRate() {
                return this.internalTrack.info.sampleRate;
            }
            async getDecoderConfig() {
                return this.internalTrack.info.codec
                    ? (this.decoderConfig ??= {
                          codec: Pt(this.internalTrack.info),
                          numberOfChannels: this.internalTrack.info.numberOfChannels,
                          sampleRate: this.internalTrack.info.sampleRate,
                          description: this.internalTrack.info.codecDescription ?? void 0,
                      })
                    : null;
            }
        },
        di = (t, e) => {
            if (t.presentationTimestamps) {
                let r = F(t.presentationTimestamps, e, (i) => i.presentationTimestamp);
                return r === -1 ? -1 : t.presentationTimestamps[r].sampleIndex;
            } else {
                let r = F(t.sampleTimingEntries, e, (n) => n.startDecodeTimestamp);
                if (r === -1) return -1;
                let i = t.sampleTimingEntries[r];
                return i.startIndex + Math.min(Math.floor((e - i.startDecodeTimestamp) / i.delta), i.count - 1);
            }
        },
        gn = (t, e) => {
            let r = F(t.sampleTimingEntries, e, (x) => x.startIndex),
                i = t.sampleTimingEntries[r];
            if (!i || i.startIndex + i.count <= e) return null;
            let a = i.startDecodeTimestamp + (e - i.startIndex) * i.delta,
                s = F(t.sampleCompositionTimeOffsets, e, (x) => x.startIndex),
                o = t.sampleCompositionTimeOffsets[s];
            o && e - o.startIndex < o.count && (a += o.offset);
            let c = t.sampleSizes[Math.min(e, t.sampleSizes.length - 1)],
                l = F(t.sampleToChunk, e, (x) => x.startSampleIndex),
                d = t.sampleToChunk[l];
            p(d);
            let u = d.startChunkIndex + Math.floor((e - d.startSampleIndex) / d.samplesPerChunk),
                f = t.chunkOffsets[u],
                h = d.startSampleIndex + (u - d.startChunkIndex) * d.samplesPerChunk,
                m = 0,
                k = f;
            if (t.sampleSizes.length === 1) (k += c * (e - h)), (m += c * d.samplesPerChunk);
            else
                for (let x = h; x < h + d.samplesPerChunk; x++) {
                    let g = t.sampleSizes[x];
                    x < e && (k += g), (m += g);
                }
            let b = i.delta;
            if (t.presentationTimestamps) {
                let x = t.presentationTimestampIndexMap[e];
                p(x !== void 0),
                    x < t.presentationTimestamps.length - 1 &&
                        (b = t.presentationTimestamps[x + 1].presentationTimestamp - a);
            }
            return {
                presentationTimestamp: a,
                duration: b,
                sampleOffset: k,
                sampleSize: c,
                chunkOffset: f,
                chunkSize: m,
                isKeyFrame: t.keySampleIndices ? Fe(t.keySampleIndices, e, (x) => x) !== -1 : !0,
            };
        },
        kn = (t, e) => {
            if (!t.keySampleIndices) return e;
            let r = F(t.keySampleIndices, e, (i) => i);
            return t.keySampleIndices[r] ?? -1;
        },
        bn = (t, e) => {
            if (!t.keySampleIndices) return e + 1;
            let r = F(t.keySampleIndices, e, (i) => i);
            return t.keySampleIndices[r + 1] ?? -1;
        },
        Sr = (t, e) => {
            (t.startTimestamp += e), (t.endTimestamp += e);
            for (let r of t.samples) r.presentationTimestamp += e;
            for (let r of t.presentationTimestamps) r.presentationTimestamp += e;
        },
        Sn = (t) => {
            let [e, , , r] = t,
                i = Math.hypot(e, r),
                n = e / i,
                a = r / i,
                s = -Math.atan2(a, n) * (180 / Math.PI);
            return Number.isFinite(s) ? s : 0;
        },
        fi = (t) => t.sampleSizes.length === 0;
    var S;
    (function (t) {
        (t[(t.EBML = 440786851)] = "EBML"),
            (t[(t.EBMLVersion = 17030)] = "EBMLVersion"),
            (t[(t.EBMLReadVersion = 17143)] = "EBMLReadVersion"),
            (t[(t.EBMLMaxIDLength = 17138)] = "EBMLMaxIDLength"),
            (t[(t.EBMLMaxSizeLength = 17139)] = "EBMLMaxSizeLength"),
            (t[(t.DocType = 17026)] = "DocType"),
            (t[(t.DocTypeVersion = 17031)] = "DocTypeVersion"),
            (t[(t.DocTypeReadVersion = 17029)] = "DocTypeReadVersion"),
            (t[(t.Void = 236)] = "Void"),
            (t[(t.Segment = 408125543)] = "Segment"),
            (t[(t.SeekHead = 290298740)] = "SeekHead"),
            (t[(t.Seek = 19899)] = "Seek"),
            (t[(t.SeekID = 21419)] = "SeekID"),
            (t[(t.SeekPosition = 21420)] = "SeekPosition"),
            (t[(t.Duration = 17545)] = "Duration"),
            (t[(t.Info = 357149030)] = "Info"),
            (t[(t.TimestampScale = 2807729)] = "TimestampScale"),
            (t[(t.MuxingApp = 19840)] = "MuxingApp"),
            (t[(t.WritingApp = 22337)] = "WritingApp"),
            (t[(t.Tracks = 374648427)] = "Tracks"),
            (t[(t.TrackEntry = 174)] = "TrackEntry"),
            (t[(t.TrackNumber = 215)] = "TrackNumber"),
            (t[(t.TrackUID = 29637)] = "TrackUID"),
            (t[(t.TrackType = 131)] = "TrackType"),
            (t[(t.FlagEnabled = 185)] = "FlagEnabled"),
            (t[(t.FlagDefault = 136)] = "FlagDefault"),
            (t[(t.FlagForced = 21930)] = "FlagForced"),
            (t[(t.FlagLacing = 156)] = "FlagLacing"),
            (t[(t.Name = 21358)] = "Name"),
            (t[(t.Language = 2274716)] = "Language"),
            (t[(t.LanguageBCP47 = 2274717)] = "LanguageBCP47"),
            (t[(t.CodecID = 134)] = "CodecID"),
            (t[(t.CodecPrivate = 25506)] = "CodecPrivate"),
            (t[(t.CodecDelay = 22186)] = "CodecDelay"),
            (t[(t.SeekPreRoll = 22203)] = "SeekPreRoll"),
            (t[(t.DefaultDuration = 2352003)] = "DefaultDuration"),
            (t[(t.Video = 224)] = "Video"),
            (t[(t.PixelWidth = 176)] = "PixelWidth"),
            (t[(t.PixelHeight = 186)] = "PixelHeight"),
            (t[(t.AlphaMode = 21440)] = "AlphaMode"),
            (t[(t.Audio = 225)] = "Audio"),
            (t[(t.SamplingFrequency = 181)] = "SamplingFrequency"),
            (t[(t.Channels = 159)] = "Channels"),
            (t[(t.BitDepth = 25188)] = "BitDepth"),
            (t[(t.SimpleBlock = 163)] = "SimpleBlock"),
            (t[(t.BlockGroup = 160)] = "BlockGroup"),
            (t[(t.Block = 161)] = "Block"),
            (t[(t.BlockAdditions = 30113)] = "BlockAdditions"),
            (t[(t.BlockMore = 166)] = "BlockMore"),
            (t[(t.BlockAdditional = 165)] = "BlockAdditional"),
            (t[(t.BlockAddID = 238)] = "BlockAddID"),
            (t[(t.BlockDuration = 155)] = "BlockDuration"),
            (t[(t.ReferenceBlock = 251)] = "ReferenceBlock"),
            (t[(t.Cluster = 524531317)] = "Cluster"),
            (t[(t.Timestamp = 231)] = "Timestamp"),
            (t[(t.Cues = 475249515)] = "Cues"),
            (t[(t.CuePoint = 187)] = "CuePoint"),
            (t[(t.CueTime = 179)] = "CueTime"),
            (t[(t.CueTrackPositions = 183)] = "CueTrackPositions"),
            (t[(t.CueTrack = 247)] = "CueTrack"),
            (t[(t.CueClusterPosition = 241)] = "CueClusterPosition"),
            (t[(t.Colour = 21936)] = "Colour"),
            (t[(t.MatrixCoefficients = 21937)] = "MatrixCoefficients"),
            (t[(t.TransferCharacteristics = 21946)] = "TransferCharacteristics"),
            (t[(t.Primaries = 21947)] = "Primaries"),
            (t[(t.Range = 21945)] = "Range"),
            (t[(t.Projection = 30320)] = "Projection"),
            (t[(t.ProjectionType = 30321)] = "ProjectionType"),
            (t[(t.ProjectionPoseRoll = 30325)] = "ProjectionPoseRoll"),
            (t[(t.Attachments = 423732329)] = "Attachments"),
            (t[(t.AttachedFile = 24999)] = "AttachedFile"),
            (t[(t.FileDescription = 18046)] = "FileDescription"),
            (t[(t.FileName = 18030)] = "FileName"),
            (t[(t.FileMediaType = 18016)] = "FileMediaType"),
            (t[(t.FileData = 18012)] = "FileData"),
            (t[(t.FileUID = 18094)] = "FileUID"),
            (t[(t.Chapters = 272869232)] = "Chapters"),
            (t[(t.Tags = 307544935)] = "Tags"),
            (t[(t.Tag = 29555)] = "Tag"),
            (t[(t.Targets = 25536)] = "Targets"),
            (t[(t.TargetTypeValue = 26826)] = "TargetTypeValue"),
            (t[(t.TargetType = 25546)] = "TargetType"),
            (t[(t.TagTrackUID = 25541)] = "TagTrackUID"),
            (t[(t.TagEditionUID = 25545)] = "TagEditionUID"),
            (t[(t.TagChapterUID = 25540)] = "TagChapterUID"),
            (t[(t.TagAttachmentUID = 25542)] = "TagAttachmentUID"),
            (t[(t.SimpleTag = 26568)] = "SimpleTag"),
            (t[(t.TagName = 17827)] = "TagName"),
            (t[(t.TagLanguage = 17530)] = "TagLanguage"),
            (t[(t.TagString = 17543)] = "TagString"),
            (t[(t.TagBinary = 17541)] = "TagBinary"),
            (t[(t.ContentEncodings = 28032)] = "ContentEncodings"),
            (t[(t.ContentEncoding = 25152)] = "ContentEncoding"),
            (t[(t.ContentEncodingOrder = 20529)] = "ContentEncodingOrder"),
            (t[(t.ContentEncodingScope = 20530)] = "ContentEncodingScope"),
            (t[(t.ContentCompression = 20532)] = "ContentCompression"),
            (t[(t.ContentCompAlgo = 16980)] = "ContentCompAlgo"),
            (t[(t.ContentCompSettings = 16981)] = "ContentCompSettings"),
            (t[(t.ContentEncryption = 20533)] = "ContentEncryption");
    })(S || (S = {}));
    var xn = [S.EBML, S.Segment],
        Ue = [S.SeekHead, S.Info, S.Cluster, S.Tracks, S.Cues, S.Attachments, S.Chapters, S.Tags],
        nt = [...xn, ...Ue];
    var wr = 8,
        X = 2,
        te = 2 * wr,
        yr = (t) => {
            let e = P(t);
            if ((t.skip(-1), e === 0)) return null;
            let r = 1,
                i = 128;
            for (; (e & i) === 0; ) r++, (i >>= 1);
            return r;
        },
        Oe = (t) => {
            let e = P(t);
            if (e === 0) return null;
            let r = 1,
                i = 128;
            for (; (e & i) === 0; ) r++, (i >>= 1);
            let n = e & (i - 1);
            for (let a = 1; a < r; a++) (n *= 256), (n += P(t));
            return n;
        },
        D = (t, e) => {
            if (e < 1 || e > 8) throw new Error("Bad unsigned int size " + e);
            let r = 0;
            for (let i = 0; i < e; i++) (r *= 256), (r += P(t));
            return r;
        },
        mi = (t, e) => {
            if (e < 1) throw new Error("Bad unsigned int size " + e);
            let r = 0n;
            for (let i = 0; i < e; i++) (r <<= 8n), (r += BigInt(P(t)));
            return r;
        },
        pi = (t, e) => {
            let r = D(t, e);
            return r & (1 << (e * 8 - 1)) && (r -= 2 ** (e * 8)), r;
        },
        Rt = (t) => {
            let e = yr(t);
            return e === null ? null : D(t, e);
        },
        Pr = (t) => {
            let e = P(t);
            return e === 255 ? (e = null) : (t.skip(-1), (e = Oe(t)), e === 72057594037927940 && (e = null)), e;
        },
        re = (t) => {
            let e = Rt(t);
            if (e === null) return null;
            let r = Pr(t);
            return { id: e, size: r };
        },
        ke = (t, e) => {
            let r = _(t, e),
                i = 0;
            for (; i < e && r[i] !== 0; ) i += 1;
            return String.fromCharCode(...r.subarray(0, i));
        },
        Me = (t, e) => {
            let r = _(t, e),
                i = 0;
            for (; i < e && r[i] !== 0; ) i += 1;
            return H.decode(r.subarray(0, i));
        },
        zt = (t, e) => {
            if (e === 0) return 0;
            if (e !== 4 && e !== 8) throw new Error("Bad float size " + e);
            return e === 4 ? gi(t) : Bt(t);
        },
        Nt = async (t, e, r, i) => {
            let n = new Set(r),
                a = e;
            for (; i === null || a < i; ) {
                let s = t.requestSliceRange(a, X, te);
                if ((s instanceof Promise && (s = await s), !s)) break;
                let o = re(s);
                if (!o) break;
                if (n.has(o.id)) return { pos: a, found: !0 };
                oe(o.size), (a = s.filePos + o.size);
            }
            return { pos: i !== null && i > a ? i : a, found: !1 };
        },
        Cr = async (t, e, r, i) => {
            let a = new Set(r),
                s = e;
            for (; s < i; ) {
                let o = t.requestSliceRange(s, 0, Math.min(65536, i - s));
                if ((o instanceof Promise && (o = await o), !o || o.length < wr)) break;
                for (let c = 0; c < o.length - wr; c++) {
                    o.filePos = s;
                    let l = Rt(o);
                    if (l !== null && a.has(l)) return s;
                    s++;
                }
            }
            return null;
        },
        ie = {
            avc: "V_MPEG4/ISO/AVC",
            hevc: "V_MPEGH/ISO/HEVC",
            vp8: "V_VP8",
            vp9: "V_VP9",
            av1: "V_AV1",
            aac: "A_AAC",
            mp3: "A_MPEG/L3",
            opus: "A_OPUS",
            vorbis: "A_VORBIS",
            flac: "A_FLAC",
            "pcm-u8": "A_PCM/INT/LIT",
            "pcm-s16": "A_PCM/INT/LIT",
            "pcm-s16be": "A_PCM/INT/BIG",
            "pcm-s24": "A_PCM/INT/LIT",
            "pcm-s24be": "A_PCM/INT/BIG",
            "pcm-s32": "A_PCM/INT/LIT",
            "pcm-s32be": "A_PCM/INT/BIG",
            "pcm-f32": "A_PCM/FLOAT/IEEE",
            "pcm-f64": "A_PCM/FLOAT/IEEE",
            webvtt: "S_TEXT/WEBVTT",
        };
    function oe(t) {
        if (t === null) throw new Error("Undefined element size is used in a place where it is not supported.");
    }
    var ki = (t) => {
        let r = (t.hasVideo ? "video/" : t.hasAudio ? "audio/" : "application/") + (t.isWebM ? "webm" : "x-matroska");
        if (t.codecStrings.length > 0) {
            let i = [...new Set(t.codecStrings.filter(Boolean))];
            r += `; codecs="${i.join(", ")}"`;
        }
        return r;
    };
    var ce;
    (function (t) {
        (t[(t.None = 0)] = "None"),
            (t[(t.Xiph = 1)] = "Xiph"),
            (t[(t.FixedSize = 2)] = "FixedSize"),
            (t[(t.Ebml = 3)] = "Ebml");
    })(ce || (ce = {}));
    var Ut;
    (function (t) {
        (t[(t.Block = 1)] = "Block"), (t[(t.Private = 2)] = "Private"), (t[(t.Next = 4)] = "Next");
    })(Ut || (Ut = {}));
    var st;
    (function (t) {
        (t[(t.Zlib = 0)] = "Zlib"),
            (t[(t.Bzlib = 1)] = "Bzlib"),
            (t[(t.lzo1x = 2)] = "lzo1x"),
            (t[(t.HeaderStripping = 3)] = "HeaderStripping");
    })(st || (st = {}));
    var Ir = [
            { id: S.SeekHead, flag: "seekHeadSeen" },
            { id: S.Info, flag: "infoSeen" },
            { id: S.Tracks, flag: "tracksSeen" },
            { id: S.Cues, flag: "cuesSeen" },
        ],
        bi = 10 * 2 ** 20,
        Ot = class extends K {
            constructor(e) {
                super(e),
                    (this.readMetadataPromise = null),
                    (this.segments = []),
                    (this.currentSegment = null),
                    (this.currentTrack = null),
                    (this.currentCluster = null),
                    (this.currentBlock = null),
                    (this.currentBlockAdditional = null),
                    (this.currentCueTime = null),
                    (this.currentDecodingInstruction = null),
                    (this.currentTagTargetIsMovie = !0),
                    (this.currentSimpleTagName = null),
                    (this.currentAttachedFile = null),
                    (this.isWebM = !1),
                    (this.reader = e._reader);
            }
            async computeDuration() {
                let e = await this.getTracks(),
                    r = await Promise.all(e.map((i) => i.computeDuration()));
                return Math.max(0, ...r);
            }
            async getTracks() {
                return await this.readMetadata(), this.segments.flatMap((e) => e.tracks.map((r) => r.inputTrack));
            }
            async getMimeType() {
                await this.readMetadata();
                let e = await this.getTracks(),
                    r = await Promise.all(e.map((i) => i.getCodecParameterString()));
                return ki({
                    isWebM: this.isWebM,
                    hasVideo: this.segments.some((i) => i.tracks.some((n) => n.info?.type === "video")),
                    hasAudio: this.segments.some((i) => i.tracks.some((n) => n.info?.type === "audio")),
                    codecStrings: r.filter(Boolean),
                });
            }
            async getMetadataTags() {
                await this.readMetadata();
                for (let r of this.segments)
                    r.metadataTagsCollected ||
                        (this.reader.fileSize !== null && (await this.loadSegmentMetadata(r)),
                        (r.metadataTagsCollected = !0));
                let e = {};
                for (let r of this.segments) e = { ...e, ...r.metadataTags };
                return e;
            }
            readMetadata() {
                return (this.readMetadataPromise ??= (async () => {
                    let e = 0;
                    for (;;) {
                        let r = this.reader.requestSliceRange(e, X, te);
                        if ((r instanceof Promise && (r = await r), !r)) break;
                        let i = re(r);
                        if (!i) break;
                        let n = i.id,
                            a = i.size,
                            s = r.filePos;
                        if (n === S.EBML) {
                            oe(a);
                            let o = this.reader.requestSlice(s, a);
                            if ((o instanceof Promise && (o = await o), !o)) break;
                            this.readContiguousElements(o);
                        } else if (n === S.Segment) {
                            if ((await this.readSegment(s, a), a === null || this.reader.fileSize === null)) break;
                        } else if (n === S.Cluster) {
                            if (this.reader.fileSize === null) break;
                            a === null && (a = (await Nt(this.reader, s, nt, this.reader.fileSize)).pos - s);
                            let o = G(this.segments);
                            o && (o.elementEndPos = s + a);
                        }
                        oe(a), (e = s + a);
                    }
                })());
            }
            async readSegment(e, r) {
                (this.currentSegment = {
                    seekHeadSeen: !1,
                    infoSeen: !1,
                    tracksSeen: !1,
                    cuesSeen: !1,
                    tagsSeen: !1,
                    attachmentsSeen: !1,
                    timestampScale: -1,
                    timestampFactor: -1,
                    duration: -1,
                    seekEntries: [],
                    tracks: [],
                    cuePoints: [],
                    dataStartPos: e,
                    elementEndPos: r === null ? null : e + r,
                    clusterSeekStartPos: e,
                    lastReadCluster: null,
                    metadataTags: {},
                    metadataTagsCollected: !1,
                }),
                    this.segments.push(this.currentSegment);
                let i = e;
                for (; this.currentSegment.elementEndPos === null || i < this.currentSegment.elementEndPos; ) {
                    let o = this.reader.requestSliceRange(i, X, te);
                    if ((o instanceof Promise && (o = await o), !o)) break;
                    let c = i,
                        l = re(o);
                    if (!l || (!Ue.includes(l.id) && l.id !== S.Void)) {
                        let m = await Cr(
                            this.reader,
                            c,
                            Ue,
                            Math.min(this.currentSegment.elementEndPos ?? 1 / 0, c + bi)
                        );
                        if (m) {
                            i = m;
                            continue;
                        } else break;
                    }
                    let { id: d, size: u } = l,
                        f = o.filePos,
                        h = Ir.findIndex((m) => m.id === d);
                    if (h !== -1) {
                        let m = Ir[h].flag;
                        (this.currentSegment[m] = !0), oe(u);
                        let k = this.reader.requestSlice(f, u);
                        k instanceof Promise && (k = await k), k && this.readContiguousElements(k);
                    } else if (d === S.Tags || d === S.Attachments) {
                        d === S.Tags ? (this.currentSegment.tagsSeen = !0) : (this.currentSegment.attachmentsSeen = !0),
                            oe(u);
                        let m = this.reader.requestSlice(f, u);
                        m instanceof Promise && (m = await m), m && this.readContiguousElements(m);
                    } else if (d === S.Cluster) {
                        this.currentSegment.clusterSeekStartPos = c;
                        break;
                    }
                    if (u === null) break;
                    i = f + u;
                }
                if (
                    (this.currentSegment.seekEntries.sort((o, c) => o.segmentPosition - c.segmentPosition),
                    this.reader.fileSize !== null)
                )
                    for (let o of this.currentSegment.seekEntries) {
                        let c = Ir.find((m) => m.id === o.id);
                        if (!c || this.currentSegment[c.flag]) continue;
                        let l = this.reader.requestSliceRange(e + o.segmentPosition, X, te);
                        if ((l instanceof Promise && (l = await l), !l)) continue;
                        let d = re(l);
                        if (!d) continue;
                        let { id: u, size: f } = d;
                        if (u !== c.id) continue;
                        oe(f), (this.currentSegment[c.flag] = !0);
                        let h = this.reader.requestSlice(l.filePos, f);
                        h instanceof Promise && (h = await h), h && this.readContiguousElements(h);
                    }
                this.currentSegment.timestampScale === -1 &&
                    ((this.currentSegment.timestampScale = 1e6), (this.currentSegment.timestampFactor = 1e9 / 1e6)),
                    this.currentSegment.tracks.sort((o, c) => Number(c.isDefault) - Number(o.isDefault));
                let n = new Map(this.currentSegment.tracks.map((o) => [o.id, o]));
                for (let o of this.currentSegment.cuePoints) {
                    let c = n.get(o.trackId);
                    c && c.cuePoints.push(o);
                }
                for (let o of this.currentSegment.tracks) {
                    o.cuePoints.sort((c, l) => c.time - l.time);
                    for (let c = 0; c < o.cuePoints.length - 1; c++) {
                        let l = o.cuePoints[c],
                            d = o.cuePoints[c + 1];
                        l.time === d.time && (o.cuePoints.splice(c + 1, 1), c--);
                    }
                }
                let a = null,
                    s = -1 / 0;
                for (let o of this.currentSegment.tracks) o.cuePoints.length > s && ((s = o.cuePoints.length), (a = o));
                for (let o of this.currentSegment.tracks) o.cuePoints.length === 0 && (o.cuePoints = a.cuePoints);
                this.currentSegment = null;
            }
            async readCluster(e, r) {
                if (r.lastReadCluster?.elementStartPos === e) return r.lastReadCluster;
                let i = this.reader.requestSliceRange(e, X, te);
                i instanceof Promise && (i = await i), p(i);
                let n = e,
                    a = re(i);
                p(a);
                let s = a.id;
                p(s === S.Cluster);
                let o = a.size,
                    c = i.filePos;
                o === null && (o = (await Nt(this.reader, c, nt, r.elementEndPos)).pos - c);
                let l = this.reader.requestSlice(c, o);
                l instanceof Promise && (l = await l);
                let d = {
                    segment: r,
                    elementStartPos: n,
                    elementEndPos: c + o,
                    dataStartPos: c,
                    timestamp: -1,
                    trackData: new Map(),
                };
                if (((this.currentCluster = d), l)) {
                    let u = this.readContiguousElements(l, nt);
                    d.elementEndPos = u;
                }
                for (let [, u] of d.trackData) {
                    let f = u.track;
                    p(u.blocks.length > 0);
                    let h = !1,
                        m = !1;
                    for (let g = 0; g < u.blocks.length; g++) {
                        let w = u.blocks[g];
                        (w.timestamp += d.timestamp),
                            (h ||= w.referencedTimestamps.length > 0),
                            (m ||= w.lacing !== ce.None);
                    }
                    h && (u.blocks = Tn(u.blocks)),
                        (u.presentationTimestamps = u.blocks
                            .map((g, w) => ({ timestamp: g.timestamp, blockIndex: w }))
                            .sort((g, w) => g.timestamp - w.timestamp));
                    for (let g = 0; g < u.presentationTimestamps.length; g++) {
                        let w = u.presentationTimestamps[g],
                            T = u.blocks[w.blockIndex];
                        if (
                            (u.firstKeyFrameTimestamp === null &&
                                T.isKeyFrame &&
                                (u.firstKeyFrameTimestamp = T.timestamp),
                            g < u.presentationTimestamps.length - 1)
                        ) {
                            let I = u.presentationTimestamps[g + 1];
                            T.duration = I.timestamp - T.timestamp;
                        } else
                            T.duration === 0 &&
                                f.defaultDuration != null &&
                                T.lacing === ce.None &&
                                (T.duration = f.defaultDuration);
                    }
                    m &&
                        (this.expandLacedBlocks(u.blocks, f),
                        (u.presentationTimestamps = u.blocks
                            .map((g, w) => ({ timestamp: g.timestamp, blockIndex: w }))
                            .sort((g, w) => g.timestamp - w.timestamp)));
                    let k = u.blocks[u.presentationTimestamps[0].blockIndex],
                        b = u.blocks[G(u.presentationTimestamps).blockIndex];
                    (u.startTimestamp = k.timestamp), (u.endTimestamp = b.timestamp + b.duration);
                    let x = F(f.clusterPositionCache, u.startTimestamp, (g) => g.startTimestamp);
                    (x === -1 || f.clusterPositionCache[x].elementStartPos !== n) &&
                        f.clusterPositionCache.splice(x + 1, 0, {
                            elementStartPos: d.elementStartPos,
                            startTimestamp: u.startTimestamp,
                        });
                }
                return (r.lastReadCluster = d), d;
            }
            getTrackDataInCluster(e, r) {
                let i = e.trackData.get(r);
                if (!i) {
                    let n = e.segment.tracks.find((a) => a.id === r);
                    if (!n) return null;
                    (i = {
                        track: n,
                        startTimestamp: 0,
                        endTimestamp: 0,
                        firstKeyFrameTimestamp: null,
                        blocks: [],
                        presentationTimestamps: [],
                    }),
                        e.trackData.set(r, i);
                }
                return i;
            }
            expandLacedBlocks(e, r) {
                for (let i = 0; i < e.length; i++) {
                    let n = e[i];
                    if (n.lacing === ce.None) continue;
                    n.decoded || ((n.data = this.decodeBlockData(r, n.data)), (n.decoded = !0));
                    let a = Ve.tempFromBytes(n.data),
                        s = [],
                        o = P(a) + 1;
                    switch (n.lacing) {
                        case ce.Xiph:
                            {
                                let c = 0;
                                for (let l = 0; l < o - 1; l++) {
                                    let d = 0;
                                    for (; a.bufferPos < a.length; ) {
                                        let u = P(a);
                                        if (((d += u), u < 255)) {
                                            s.push(d), (c += d);
                                            break;
                                        }
                                    }
                                }
                                s.push(a.length - (a.bufferPos + c));
                            }
                            break;
                        case ce.FixedSize:
                            {
                                let c = a.length - 1,
                                    l = Math.floor(c / o);
                                for (let d = 0; d < o; d++) s.push(l);
                            }
                            break;
                        case ce.Ebml:
                            {
                                let c = Oe(a);
                                p(c !== null);
                                let l = c;
                                s.push(l);
                                let d = l;
                                for (let u = 1; u < o - 1; u++) {
                                    let f = a.bufferPos,
                                        h = Oe(a);
                                    p(h !== null);
                                    let m = h,
                                        b = (1 << ((a.bufferPos - f) * 7 - 1)) - 1,
                                        x = m - b;
                                    (l += x), s.push(l), (d += l);
                                }
                                s.push(a.length - (a.bufferPos + d));
                            }
                            break;
                        default:
                            p(!1);
                    }
                    p(s.length === o), e.splice(i, 1);
                    for (let c = 0; c < o; c++) {
                        let l = s[c],
                            d = _(a, l),
                            u = n.duration || o * (r.defaultDuration ?? 0),
                            f = n.timestamp + (u * c) / o,
                            h = u / o;
                        e.splice(i + c, 0, {
                            timestamp: f,
                            duration: h,
                            isKeyFrame: n.isKeyFrame,
                            referencedTimestamps: n.referencedTimestamps,
                            data: d,
                            lacing: ce.None,
                            decoded: !0,
                            mainAdditional: n.mainAdditional,
                        });
                    }
                    (i += o), i--;
                }
            }
            async loadSegmentMetadata(e) {
                for (let r of e.seekEntries) {
                    if (!(r.id === S.Tags && !e.tagsSeen)) {
                        if (!(r.id === S.Attachments && !e.attachmentsSeen)) continue;
                    }
                    let i = this.reader.requestSliceRange(e.dataStartPos + r.segmentPosition, X, te);
                    if ((i instanceof Promise && (i = await i), !i)) continue;
                    let n = re(i);
                    if (!n || n.id !== r.id) continue;
                    let { size: a } = n;
                    oe(a), p(!this.currentSegment), (this.currentSegment = e);
                    let s = this.reader.requestSlice(i.filePos, a);
                    s instanceof Promise && (s = await s),
                        s && this.readContiguousElements(s),
                        (this.currentSegment = null),
                        r.id === S.Tags ? (e.tagsSeen = !0) : r.id === S.Attachments && (e.attachmentsSeen = !0);
                }
            }
            readContiguousElements(e, r) {
                let i = e.filePos;
                for (; e.filePos - i <= e.length - X; ) {
                    let n = e.filePos;
                    if (!this.traverseElement(e, r)) return n;
                }
                return e.filePos;
            }
            traverseElement(e, r) {
                let i = re(e);
                if (!i || (r && r.includes(i.id))) return !1;
                let { id: n, size: a } = i,
                    s = e.filePos;
                switch ((oe(a), n)) {
                    case S.DocType:
                        this.isWebM = ke(e, a) === "webm";
                        break;
                    case S.Seek:
                        {
                            if (!this.currentSegment) break;
                            let o = { id: -1, segmentPosition: -1 };
                            this.currentSegment.seekEntries.push(o),
                                this.readContiguousElements(e.slice(s, a)),
                                (o.id === -1 || o.segmentPosition === -1) && this.currentSegment.seekEntries.pop();
                        }
                        break;
                    case S.SeekID:
                        {
                            let o = this.currentSegment?.seekEntries[this.currentSegment.seekEntries.length - 1];
                            if (!o) break;
                            o.id = D(e, a);
                        }
                        break;
                    case S.SeekPosition:
                        {
                            let o = this.currentSegment?.seekEntries[this.currentSegment.seekEntries.length - 1];
                            if (!o) break;
                            o.segmentPosition = D(e, a);
                        }
                        break;
                    case S.TimestampScale:
                        {
                            if (!this.currentSegment) break;
                            (this.currentSegment.timestampScale = D(e, a)),
                                (this.currentSegment.timestampFactor = 1e9 / this.currentSegment.timestampScale);
                        }
                        break;
                    case S.Duration:
                        {
                            if (!this.currentSegment) break;
                            this.currentSegment.duration = zt(e, a);
                        }
                        break;
                    case S.TrackEntry:
                        {
                            if (!this.currentSegment) break;
                            if (
                                ((this.currentTrack = {
                                    id: -1,
                                    segment: this.currentSegment,
                                    demuxer: this,
                                    clusterPositionCache: [],
                                    cuePoints: [],
                                    isDefault: !1,
                                    inputTrack: null,
                                    codecId: null,
                                    codecPrivate: null,
                                    defaultDuration: null,
                                    name: null,
                                    languageCode: q,
                                    decodingInstructions: [],
                                    info: null,
                                }),
                                this.readContiguousElements(e.slice(s, a)),
                                this.currentTrack.decodingInstructions.some(
                                    (o) =>
                                        o.data?.type !== "decompress" ||
                                        o.scope !== Ut.Block ||
                                        o.data.algorithm !== st.HeaderStripping
                                ) &&
                                    (console.warn(
                                        `Track #${this.currentTrack.id} has an unsupported content encoding; dropping.`
                                    ),
                                    (this.currentTrack = null)),
                                this.currentTrack &&
                                    this.currentTrack.id !== -1 &&
                                    this.currentTrack.codecId &&
                                    this.currentTrack.info)
                            ) {
                                let o = this.currentTrack.codecId.indexOf("/"),
                                    c = o === -1 ? this.currentTrack.codecId : this.currentTrack.codecId.slice(0, o);
                                if (
                                    this.currentTrack.info.type === "video" &&
                                    this.currentTrack.info.width !== -1 &&
                                    this.currentTrack.info.height !== -1
                                ) {
                                    this.currentTrack.codecId === ie.avc
                                        ? ((this.currentTrack.info.codec = "avc"),
                                          (this.currentTrack.info.codecDescription = this.currentTrack.codecPrivate))
                                        : this.currentTrack.codecId === ie.hevc
                                          ? ((this.currentTrack.info.codec = "hevc"),
                                            (this.currentTrack.info.codecDescription = this.currentTrack.codecPrivate))
                                          : c === ie.vp8
                                            ? (this.currentTrack.info.codec = "vp8")
                                            : c === ie.vp9
                                              ? (this.currentTrack.info.codec = "vp9")
                                              : c === ie.av1 && (this.currentTrack.info.codec = "av1");
                                    let l = this.currentTrack,
                                        d = new me(this.input, new _r(l));
                                    (this.currentTrack.inputTrack = d),
                                        this.currentSegment.tracks.push(this.currentTrack);
                                } else if (
                                    this.currentTrack.info.type === "audio" &&
                                    this.currentTrack.info.numberOfChannels !== -1 &&
                                    this.currentTrack.info.sampleRate !== -1
                                ) {
                                    c === ie.aac
                                        ? ((this.currentTrack.info.codec = "aac"),
                                          (this.currentTrack.info.aacCodecInfo = {
                                              isMpeg2: this.currentTrack.codecId.includes("MPEG2"),
                                          }),
                                          (this.currentTrack.info.codecDescription = this.currentTrack.codecPrivate))
                                        : this.currentTrack.codecId === ie.mp3
                                          ? (this.currentTrack.info.codec = "mp3")
                                          : c === ie.opus
                                            ? ((this.currentTrack.info.codec = "opus"),
                                              (this.currentTrack.info.codecDescription =
                                                  this.currentTrack.codecPrivate),
                                              (this.currentTrack.info.sampleRate = Pe))
                                            : c === ie.vorbis
                                              ? ((this.currentTrack.info.codec = "vorbis"),
                                                (this.currentTrack.info.codecDescription =
                                                    this.currentTrack.codecPrivate))
                                              : c === ie.flac
                                                ? ((this.currentTrack.info.codec = "flac"),
                                                  (this.currentTrack.info.codecDescription =
                                                      this.currentTrack.codecPrivate))
                                                : this.currentTrack.codecId === "A_PCM/INT/LIT"
                                                  ? this.currentTrack.info.bitDepth === 8
                                                      ? (this.currentTrack.info.codec = "pcm-u8")
                                                      : this.currentTrack.info.bitDepth === 16
                                                        ? (this.currentTrack.info.codec = "pcm-s16")
                                                        : this.currentTrack.info.bitDepth === 24
                                                          ? (this.currentTrack.info.codec = "pcm-s24")
                                                          : this.currentTrack.info.bitDepth === 32 &&
                                                            (this.currentTrack.info.codec = "pcm-s32")
                                                  : this.currentTrack.codecId === "A_PCM/INT/BIG"
                                                    ? this.currentTrack.info.bitDepth === 8
                                                        ? (this.currentTrack.info.codec = "pcm-u8")
                                                        : this.currentTrack.info.bitDepth === 16
                                                          ? (this.currentTrack.info.codec = "pcm-s16be")
                                                          : this.currentTrack.info.bitDepth === 24
                                                            ? (this.currentTrack.info.codec = "pcm-s24be")
                                                            : this.currentTrack.info.bitDepth === 32 &&
                                                              (this.currentTrack.info.codec = "pcm-s32be")
                                                    : this.currentTrack.codecId === "A_PCM/FLOAT/IEEE" &&
                                                      (this.currentTrack.info.bitDepth === 32
                                                          ? (this.currentTrack.info.codec = "pcm-f32")
                                                          : this.currentTrack.info.bitDepth === 64 &&
                                                            (this.currentTrack.info.codec = "pcm-f64"));
                                    let l = this.currentTrack,
                                        d = new W(this.input, new Er(l));
                                    (this.currentTrack.inputTrack = d),
                                        this.currentSegment.tracks.push(this.currentTrack);
                                }
                            }
                            this.currentTrack = null;
                        }
                        break;
                    case S.TrackNumber:
                        {
                            if (!this.currentTrack) break;
                            this.currentTrack.id = D(e, a);
                        }
                        break;
                    case S.TrackType:
                        {
                            if (!this.currentTrack) break;
                            let o = D(e, a);
                            o === 1
                                ? (this.currentTrack.info = {
                                      type: "video",
                                      width: -1,
                                      height: -1,
                                      rotation: 0,
                                      codec: null,
                                      codecDescription: null,
                                      colorSpace: null,
                                      alphaMode: !1,
                                  })
                                : o === 2 &&
                                  (this.currentTrack.info = {
                                      type: "audio",
                                      numberOfChannels: -1,
                                      sampleRate: -1,
                                      bitDepth: -1,
                                      codec: null,
                                      codecDescription: null,
                                      aacCodecInfo: null,
                                  });
                        }
                        break;
                    case S.FlagEnabled:
                        {
                            if (!this.currentTrack) break;
                            D(e, a) || (this.currentSegment.tracks.pop(), (this.currentTrack = null));
                        }
                        break;
                    case S.FlagDefault:
                        {
                            if (!this.currentTrack) break;
                            this.currentTrack.isDefault = !!D(e, a);
                        }
                        break;
                    case S.CodecID:
                        {
                            if (!this.currentTrack) break;
                            this.currentTrack.codecId = ke(e, a);
                        }
                        break;
                    case S.CodecPrivate:
                        {
                            if (!this.currentTrack) break;
                            this.currentTrack.codecPrivate = _(e, a);
                        }
                        break;
                    case S.DefaultDuration:
                        {
                            if (!this.currentTrack) break;
                            this.currentTrack.defaultDuration =
                                (this.currentTrack.segment.timestampFactor * D(e, a)) / 1e9;
                        }
                        break;
                    case S.Name:
                        {
                            if (!this.currentTrack) break;
                            this.currentTrack.name = Me(e, a);
                        }
                        break;
                    case S.Language:
                        {
                            if (!this.currentTrack || this.currentTrack.languageCode !== q) break;
                            (this.currentTrack.languageCode = ke(e, a)),
                                St(this.currentTrack.languageCode) || (this.currentTrack.languageCode = q);
                        }
                        break;
                    case S.LanguageBCP47:
                        {
                            if (!this.currentTrack) break;
                            let c = ke(e, a).split("-")[0];
                            c ? (this.currentTrack.languageCode = c) : (this.currentTrack.languageCode = q);
                        }
                        break;
                    case S.Video:
                        {
                            if (this.currentTrack?.info?.type !== "video") break;
                            this.readContiguousElements(e.slice(s, a));
                        }
                        break;
                    case S.PixelWidth:
                        {
                            if (this.currentTrack?.info?.type !== "video") break;
                            this.currentTrack.info.width = D(e, a);
                        }
                        break;
                    case S.PixelHeight:
                        {
                            if (this.currentTrack?.info?.type !== "video") break;
                            this.currentTrack.info.height = D(e, a);
                        }
                        break;
                    case S.AlphaMode:
                        {
                            if (this.currentTrack?.info?.type !== "video") break;
                            this.currentTrack.info.alphaMode = D(e, a) === 1;
                        }
                        break;
                    case S.Colour:
                        {
                            if (this.currentTrack?.info?.type !== "video") break;
                            (this.currentTrack.info.colorSpace = {}), this.readContiguousElements(e.slice(s, a));
                        }
                        break;
                    case S.MatrixCoefficients:
                        {
                            if (this.currentTrack?.info?.type !== "video" || !this.currentTrack.info.colorSpace) break;
                            let o = D(e, a),
                                c = kt[o] ?? null;
                            this.currentTrack.info.colorSpace.matrix = c;
                        }
                        break;
                    case S.Range:
                        {
                            if (this.currentTrack?.info?.type !== "video" || !this.currentTrack.info.colorSpace) break;
                            this.currentTrack.info.colorSpace.fullRange = D(e, a) === 2;
                        }
                        break;
                    case S.TransferCharacteristics:
                        {
                            if (this.currentTrack?.info?.type !== "video" || !this.currentTrack.info.colorSpace) break;
                            let o = D(e, a),
                                c = gt[o] ?? null;
                            this.currentTrack.info.colorSpace.transfer = c;
                        }
                        break;
                    case S.Primaries:
                        {
                            if (this.currentTrack?.info?.type !== "video" || !this.currentTrack.info.colorSpace) break;
                            let o = D(e, a),
                                c = pt[o] ?? null;
                            this.currentTrack.info.colorSpace.primaries = c;
                        }
                        break;
                    case S.Projection:
                        {
                            if (this.currentTrack?.info?.type !== "video") break;
                            this.readContiguousElements(e.slice(s, a));
                        }
                        break;
                    case S.ProjectionPoseRoll:
                        {
                            if (this.currentTrack?.info?.type !== "video") break;
                            let c = -zt(e, a);
                            try {
                                this.currentTrack.info.rotation = ht(c);
                            } catch {}
                        }
                        break;
                    case S.Audio:
                        {
                            if (this.currentTrack?.info?.type !== "audio") break;
                            this.readContiguousElements(e.slice(s, a));
                        }
                        break;
                    case S.SamplingFrequency:
                        {
                            if (this.currentTrack?.info?.type !== "audio") break;
                            this.currentTrack.info.sampleRate = zt(e, a);
                        }
                        break;
                    case S.Channels:
                        {
                            if (this.currentTrack?.info?.type !== "audio") break;
                            this.currentTrack.info.numberOfChannels = D(e, a);
                        }
                        break;
                    case S.BitDepth:
                        {
                            if (this.currentTrack?.info?.type !== "audio") break;
                            this.currentTrack.info.bitDepth = D(e, a);
                        }
                        break;
                    case S.CuePoint:
                        {
                            if (!this.currentSegment) break;
                            this.readContiguousElements(e.slice(s, a)), (this.currentCueTime = null);
                        }
                        break;
                    case S.CueTime:
                        this.currentCueTime = D(e, a);
                        break;
                    case S.CueTrackPositions:
                        {
                            if (this.currentCueTime === null) break;
                            p(this.currentSegment);
                            let o = { time: this.currentCueTime, trackId: -1, clusterPosition: -1 };
                            this.currentSegment.cuePoints.push(o),
                                this.readContiguousElements(e.slice(s, a)),
                                (o.trackId === -1 || o.clusterPosition === -1) && this.currentSegment.cuePoints.pop();
                        }
                        break;
                    case S.CueTrack:
                        {
                            let o = this.currentSegment?.cuePoints[this.currentSegment.cuePoints.length - 1];
                            if (!o) break;
                            o.trackId = D(e, a);
                        }
                        break;
                    case S.CueClusterPosition:
                        {
                            let o = this.currentSegment?.cuePoints[this.currentSegment.cuePoints.length - 1];
                            if (!o) break;
                            p(this.currentSegment), (o.clusterPosition = this.currentSegment.dataStartPos + D(e, a));
                        }
                        break;
                    case S.Timestamp:
                        {
                            if (!this.currentCluster) break;
                            this.currentCluster.timestamp = D(e, a);
                        }
                        break;
                    case S.SimpleBlock:
                        {
                            if (!this.currentCluster) break;
                            let o = Oe(e);
                            if (o === null) break;
                            let c = this.getTrackDataInCluster(this.currentCluster, o);
                            if (!c) break;
                            let l = it(e),
                                d = P(e),
                                u = !!(d & 128),
                                f = (d >> 1) & 3,
                                h = _(e, a - (e.filePos - s)),
                                m = c.track.decodingInstructions.length > 0;
                            c.blocks.push({
                                timestamp: l,
                                duration: 0,
                                isKeyFrame: u,
                                referencedTimestamps: [],
                                data: h,
                                lacing: f,
                                decoded: !m,
                                mainAdditional: null,
                            });
                        }
                        break;
                    case S.BlockGroup:
                        {
                            if (!this.currentCluster) break;
                            if ((this.readContiguousElements(e.slice(s, a)), this.currentBlock)) {
                                for (let o = 0; o < this.currentBlock.referencedTimestamps.length; o++)
                                    this.currentBlock.referencedTimestamps[o] += this.currentBlock.timestamp;
                                this.currentBlock = null;
                            }
                        }
                        break;
                    case S.Block:
                        {
                            if (!this.currentCluster) break;
                            let o = Oe(e);
                            if (o === null) break;
                            let c = this.getTrackDataInCluster(this.currentCluster, o);
                            if (!c) break;
                            let l = it(e),
                                u = (P(e) >> 1) & 3,
                                f = _(e, a - (e.filePos - s)),
                                h = c.track.decodingInstructions.length > 0;
                            (this.currentBlock = {
                                timestamp: l,
                                duration: 0,
                                isKeyFrame: !0,
                                referencedTimestamps: [],
                                data: f,
                                lacing: u,
                                decoded: !h,
                                mainAdditional: null,
                            }),
                                c.blocks.push(this.currentBlock);
                        }
                        break;
                    case S.BlockAdditions:
                        this.readContiguousElements(e.slice(s, a));
                        break;
                    case S.BlockMore:
                        {
                            if (!this.currentBlock) break;
                            (this.currentBlockAdditional = { addId: 1, data: null }),
                                this.readContiguousElements(e.slice(s, a)),
                                this.currentBlockAdditional.data &&
                                    this.currentBlockAdditional.addId === 1 &&
                                    (this.currentBlock.mainAdditional = this.currentBlockAdditional.data),
                                (this.currentBlockAdditional = null);
                        }
                        break;
                    case S.BlockAdditional:
                        {
                            if (!this.currentBlockAdditional) break;
                            this.currentBlockAdditional.data = _(e, a);
                        }
                        break;
                    case S.BlockAddID:
                        {
                            if (!this.currentBlockAdditional) break;
                            this.currentBlockAdditional.addId = D(e, a);
                        }
                        break;
                    case S.BlockDuration:
                        {
                            if (!this.currentBlock) break;
                            this.currentBlock.duration = D(e, a);
                        }
                        break;
                    case S.ReferenceBlock:
                        {
                            if (!this.currentBlock) break;
                            this.currentBlock.isKeyFrame = !1;
                            let o = pi(e, a);
                            this.currentBlock.referencedTimestamps.push(o);
                        }
                        break;
                    case S.Tag:
                        (this.currentTagTargetIsMovie = !0), this.readContiguousElements(e.slice(s, a));
                        break;
                    case S.Targets:
                        this.readContiguousElements(e.slice(s, a));
                        break;
                    case S.TargetTypeValue:
                        D(e, a) !== 50 && (this.currentTagTargetIsMovie = !1);
                        break;
                    case S.TagTrackUID:
                    case S.TagEditionUID:
                    case S.TagChapterUID:
                    case S.TagAttachmentUID:
                        this.currentTagTargetIsMovie = !1;
                        break;
                    case S.SimpleTag:
                        {
                            if (!this.currentTagTargetIsMovie) break;
                            (this.currentSimpleTagName = null), this.readContiguousElements(e.slice(s, a));
                        }
                        break;
                    case S.TagName:
                        this.currentSimpleTagName = Me(e, a);
                        break;
                    case S.TagString:
                        {
                            if (!this.currentSimpleTagName) break;
                            let o = Me(e, a);
                            this.processTagValue(this.currentSimpleTagName, o);
                        }
                        break;
                    case S.TagBinary:
                        {
                            if (!this.currentSimpleTagName) break;
                            let o = _(e, a);
                            this.processTagValue(this.currentSimpleTagName, o);
                        }
                        break;
                    case S.AttachedFile:
                        {
                            if (!this.currentSegment) break;
                            (this.currentAttachedFile = {
                                fileUid: null,
                                fileName: null,
                                fileMediaType: null,
                                fileData: null,
                                fileDescription: null,
                            }),
                                this.readContiguousElements(e.slice(s, a));
                            let o = this.currentSegment.metadataTags;
                            if (
                                (this.currentAttachedFile.fileUid &&
                                    this.currentAttachedFile.fileData &&
                                    ((o.raw ??= {}),
                                    (o.raw[this.currentAttachedFile.fileUid.toString()] = new wt(
                                        this.currentAttachedFile.fileData,
                                        this.currentAttachedFile.fileMediaType ?? void 0,
                                        this.currentAttachedFile.fileName ?? void 0,
                                        this.currentAttachedFile.fileDescription ?? void 0
                                    ))),
                                this.currentAttachedFile.fileMediaType?.startsWith("image/") &&
                                    this.currentAttachedFile.fileData)
                            ) {
                                let c = this.currentAttachedFile.fileName,
                                    l = "unknown";
                                if (c) {
                                    let d = c.toLowerCase();
                                    d.startsWith("cover.")
                                        ? (l = "coverFront")
                                        : d.startsWith("back.") && (l = "coverBack");
                                }
                                (o.images ??= []),
                                    o.images.push({
                                        data: this.currentAttachedFile.fileData,
                                        mimeType: this.currentAttachedFile.fileMediaType,
                                        kind: l,
                                        name: this.currentAttachedFile.fileName ?? void 0,
                                        description: this.currentAttachedFile.fileDescription ?? void 0,
                                    });
                            }
                            this.currentAttachedFile = null;
                        }
                        break;
                    case S.FileUID:
                        {
                            if (!this.currentAttachedFile) break;
                            this.currentAttachedFile.fileUid = mi(e, a);
                        }
                        break;
                    case S.FileName:
                        {
                            if (!this.currentAttachedFile) break;
                            this.currentAttachedFile.fileName = Me(e, a);
                        }
                        break;
                    case S.FileMediaType:
                        {
                            if (!this.currentAttachedFile) break;
                            this.currentAttachedFile.fileMediaType = ke(e, a);
                        }
                        break;
                    case S.FileData:
                        {
                            if (!this.currentAttachedFile) break;
                            this.currentAttachedFile.fileData = _(e, a);
                        }
                        break;
                    case S.FileDescription:
                        {
                            if (!this.currentAttachedFile) break;
                            this.currentAttachedFile.fileDescription = Me(e, a);
                        }
                        break;
                    case S.ContentEncodings:
                        {
                            if (!this.currentTrack) break;
                            this.readContiguousElements(e.slice(s, a)),
                                this.currentTrack.decodingInstructions.sort((o, c) => c.order - o.order);
                        }
                        break;
                    case S.ContentEncoding:
                        (this.currentDecodingInstruction = { order: 0, scope: Ut.Block, data: null }),
                            this.readContiguousElements(e.slice(s, a)),
                            this.currentDecodingInstruction.data &&
                                this.currentTrack.decodingInstructions.push(this.currentDecodingInstruction),
                            (this.currentDecodingInstruction = null);
                        break;
                    case S.ContentEncodingOrder:
                        {
                            if (!this.currentDecodingInstruction) break;
                            this.currentDecodingInstruction.order = D(e, a);
                        }
                        break;
                    case S.ContentEncodingScope:
                        {
                            if (!this.currentDecodingInstruction) break;
                            this.currentDecodingInstruction.scope = D(e, a);
                        }
                        break;
                    case S.ContentCompression:
                        {
                            if (!this.currentDecodingInstruction) break;
                            (this.currentDecodingInstruction.data = {
                                type: "decompress",
                                algorithm: st.Zlib,
                                settings: null,
                            }),
                                this.readContiguousElements(e.slice(s, a));
                        }
                        break;
                    case S.ContentCompAlgo:
                        {
                            if (this.currentDecodingInstruction?.data?.type !== "decompress") break;
                            this.currentDecodingInstruction.data.algorithm = D(e, a);
                        }
                        break;
                    case S.ContentCompSettings:
                        {
                            if (this.currentDecodingInstruction?.data?.type !== "decompress") break;
                            this.currentDecodingInstruction.data.settings = _(e, a);
                        }
                        break;
                    case S.ContentEncryption:
                        {
                            if (!this.currentDecodingInstruction) break;
                            this.currentDecodingInstruction.data = { type: "decrypt" };
                        }
                        break;
                }
                return (e.filePos = s + a), !0;
            }
            decodeBlockData(e, r) {
                p(e.decodingInstructions.length > 0);
                let i = r;
                for (let n of e.decodingInstructions)
                    switch ((p(n.data), n.data.type)) {
                        case "decompress":
                            switch (n.data.algorithm) {
                                case st.HeaderStripping:
                                    if (n.data.settings && n.data.settings.length > 0) {
                                        let a = n.data.settings,
                                            s = new Uint8Array(a.length + i.length);
                                        s.set(a, 0), s.set(i, a.length), (i = s);
                                    }
                                    break;
                                default:
                            }
                            break;
                        default:
                    }
                return i;
            }
            processTagValue(e, r) {
                if (!this.currentSegment?.metadataTags) return;
                let i = this.currentSegment.metadataTags;
                if (((i.raw ??= {}), (i.raw[e] ??= r), typeof r == "string"))
                    switch (e.toLowerCase()) {
                        case "title":
                            i.title ??= r;
                            break;
                        case "description":
                            i.description ??= r;
                            break;
                        case "artist":
                            i.artist ??= r;
                            break;
                        case "album":
                            i.album ??= r;
                            break;
                        case "album_artist":
                            i.albumArtist ??= r;
                            break;
                        case "genre":
                            i.genre ??= r;
                            break;
                        case "comment":
                            i.comment ??= r;
                            break;
                        case "lyrics":
                            i.lyrics ??= r;
                            break;
                        case "date":
                            {
                                let n = new Date(r);
                                Number.isNaN(n.getTime()) || (i.date ??= n);
                            }
                            break;
                        case "track_number":
                        case "part_number":
                            {
                                let n = r.split("/"),
                                    a = Number.parseInt(n[0], 10),
                                    s = n[1] && Number.parseInt(n[1], 10);
                                Number.isInteger(a) && a > 0 && (i.trackNumber ??= a),
                                    s && Number.isInteger(s) && s > 0 && (i.tracksTotal ??= s);
                            }
                            break;
                        case "disc_number":
                        case "disc":
                            {
                                let n = r.split("/"),
                                    a = Number.parseInt(n[0], 10),
                                    s = n[1] && Number.parseInt(n[1], 10);
                                Number.isInteger(a) && a > 0 && (i.discNumber ??= a),
                                    s && Number.isInteger(s) && s > 0 && (i.discsTotal ??= s);
                            }
                            break;
                    }
            }
        },
        Mt = class {
            constructor(e) {
                (this.internalTrack = e), (this.packetToClusterLocation = new WeakMap());
            }
            getId() {
                return this.internalTrack.id;
            }
            getCodec() {
                throw new Error("Not implemented on base class.");
            }
            getInternalCodecId() {
                return this.internalTrack.codecId;
            }
            async computeDuration() {
                let e = await this.getPacket(1 / 0, { metadataOnly: !0 });
                return (e?.timestamp ?? 0) + (e?.duration ?? 0);
            }
            getName() {
                return this.internalTrack.name;
            }
            getLanguageCode() {
                return this.internalTrack.languageCode;
            }
            async getFirstTimestamp() {
                return (await this.getFirstPacket({ metadataOnly: !0 }))?.timestamp ?? 0;
            }
            getTimeResolution() {
                return this.internalTrack.segment.timestampFactor;
            }
            async getFirstPacket(e) {
                return this.performClusterLookup(
                    null,
                    (r) =>
                        r.trackData.get(this.internalTrack.id)
                            ? { blockIndex: 0, correctBlockFound: !0 }
                            : { blockIndex: -1, correctBlockFound: !1 },
                    -1 / 0,
                    1 / 0,
                    e
                );
            }
            intoTimescale(e) {
                return Te(e * this.internalTrack.segment.timestampFactor, 14);
            }
            async getPacket(e, r) {
                let i = this.intoTimescale(e);
                return this.performClusterLookup(
                    null,
                    (n) => {
                        let a = n.trackData.get(this.internalTrack.id);
                        if (!a) return { blockIndex: -1, correctBlockFound: !1 };
                        let s = F(a.presentationTimestamps, i, (l) => l.timestamp),
                            o = s !== -1 ? a.presentationTimestamps[s].blockIndex : -1,
                            c = s !== -1 && i < a.endTimestamp;
                        return { blockIndex: o, correctBlockFound: c };
                    },
                    i,
                    i,
                    r
                );
            }
            async getNextPacket(e, r) {
                let i = this.packetToClusterLocation.get(e);
                if (i === void 0) throw new Error("Packet was not created from this track.");
                return this.performClusterLookup(
                    i.cluster,
                    (n) => {
                        if (n === i.cluster) {
                            let a = n.trackData.get(this.internalTrack.id);
                            if (i.blockIndex + 1 < a.blocks.length)
                                return { blockIndex: i.blockIndex + 1, correctBlockFound: !0 };
                        } else if (n.trackData.get(this.internalTrack.id))
                            return { blockIndex: 0, correctBlockFound: !0 };
                        return { blockIndex: -1, correctBlockFound: !1 };
                    },
                    -1 / 0,
                    1 / 0,
                    r
                );
            }
            async getKeyPacket(e, r) {
                let i = this.intoTimescale(e);
                return this.performClusterLookup(
                    null,
                    (n) => {
                        let a = n.trackData.get(this.internalTrack.id);
                        if (!a) return { blockIndex: -1, correctBlockFound: !1 };
                        let s = bt(
                                a.presentationTimestamps,
                                (l) => a.blocks[l.blockIndex].isKeyFrame && l.timestamp <= i
                            ),
                            o = s !== -1 ? a.presentationTimestamps[s].blockIndex : -1,
                            c = s !== -1 && i < a.endTimestamp;
                        return { blockIndex: o, correctBlockFound: c };
                    },
                    i,
                    i,
                    r
                );
            }
            async getNextKeyPacket(e, r) {
                let i = this.packetToClusterLocation.get(e);
                if (i === void 0) throw new Error("Packet was not created from this track.");
                return this.performClusterLookup(
                    i.cluster,
                    (n) => {
                        if (n === i.cluster) {
                            let s = n.trackData
                                .get(this.internalTrack.id)
                                .blocks.findIndex((o, c) => o.isKeyFrame && c > i.blockIndex);
                            if (s !== -1) return { blockIndex: s, correctBlockFound: !0 };
                        } else {
                            let a = n.trackData.get(this.internalTrack.id);
                            if (a && a.firstKeyFrameTimestamp !== null) {
                                let s = a.blocks.findIndex((o) => o.isKeyFrame);
                                return p(s !== -1), { blockIndex: s, correctBlockFound: !0 };
                            }
                        }
                        return { blockIndex: -1, correctBlockFound: !1 };
                    },
                    -1 / 0,
                    1 / 0,
                    r
                );
            }
            async fetchPacketInCluster(e, r, i) {
                if (r === -1) return null;
                let a = e.trackData.get(this.internalTrack.id).blocks[r];
                p(a),
                    a.decoded ||
                        ((a.data = this.internalTrack.demuxer.decodeBlockData(this.internalTrack, a.data)),
                        (a.decoded = !0));
                let s = i.metadataOnly ? V : a.data,
                    o = a.timestamp / this.internalTrack.segment.timestampFactor,
                    c = a.duration / this.internalTrack.segment.timestampFactor,
                    l = {};
                a.mainAdditional &&
                    this.internalTrack.info?.type === "video" &&
                    this.internalTrack.info.alphaMode &&
                    ((l.alpha = i.metadataOnly ? V : a.mainAdditional),
                    (l.alphaByteLength = a.mainAdditional.byteLength));
                let d = new U(s, a.isKeyFrame ? "key" : "delta", o, c, e.dataStartPos + r, a.data.byteLength, l);
                return this.packetToClusterLocation.set(d, { cluster: e, blockIndex: r }), d;
            }
            async performClusterLookup(e, r, i, n, a) {
                let { demuxer: s, segment: o } = this.internalTrack,
                    c = null,
                    l = null,
                    d = -1;
                if (e) {
                    let { blockIndex: x, correctBlockFound: g } = r(e);
                    if (g) return this.fetchPacketInCluster(e, x, a);
                    x !== -1 && ((l = e), (d = x));
                }
                let u = F(this.internalTrack.cuePoints, i, (x) => x.time),
                    f = u !== -1 ? this.internalTrack.cuePoints[u] : null,
                    h = F(this.internalTrack.clusterPositionCache, i, (x) => x.startTimestamp),
                    m = h !== -1 ? this.internalTrack.clusterPositionCache[h] : null,
                    k = Math.max(f?.clusterPosition ?? 0, m?.elementStartPos ?? 0) || null,
                    b;
                for (
                    e
                        ? k === null || e.elementStartPos >= k
                            ? ((b = e.elementEndPos), (c = e))
                            : (b = k)
                        : (b = k ?? o.clusterSeekStartPos);
                    o.elementEndPos === null || b <= o.elementEndPos - X;

                ) {
                    if (c) {
                        let v = c.trackData.get(this.internalTrack.id);
                        if (v && v.startTimestamp > n) break;
                    }
                    let x = s.reader.requestSliceRange(b, X, te);
                    if ((x instanceof Promise && (x = await x), !x)) break;
                    let g = b,
                        w = re(x);
                    if (!w || (!Ue.includes(w.id) && w.id !== S.Void)) {
                        let v = await Cr(s.reader, g, Ue, Math.min(o.elementEndPos ?? 1 / 0, g + bi));
                        if (v) {
                            b = v;
                            continue;
                        } else break;
                    }
                    let T = w.id,
                        I = w.size,
                        E = x.filePos;
                    if (T === S.Cluster) {
                        (c = await s.readCluster(g, o)), (I = c.elementEndPos - E);
                        let { blockIndex: v, correctBlockFound: R } = r(c);
                        if (R) return this.fetchPacketInCluster(c, v, a);
                        v !== -1 && ((l = c), (d = v));
                    }
                    I === null && (p(T !== S.Cluster), (I = (await Nt(s.reader, E, nt, o.elementEndPos)).pos - E));
                    let A = E + I;
                    if (o.elementEndPos === null) {
                        let v = s.reader.requestSliceRange(A, X, te);
                        if ((v instanceof Promise && (v = await v), !v)) break;
                        if (Rt(v) === S.Segment) {
                            o.elementEndPos = A;
                            break;
                        }
                    }
                    b = A;
                }
                if (f && (!l || l.elementStartPos < f.clusterPosition)) {
                    let x = this.internalTrack.cuePoints[u - 1];
                    p(!x || x.time < f.time);
                    let g = x?.time ?? -1 / 0;
                    return this.performClusterLookup(null, r, g, n, a);
                }
                return l ? this.fetchPacketInCluster(l, d, a) : null;
            }
        },
        _r = class extends Mt {
            constructor(e) {
                super(e), (this.decoderConfigPromise = null), (this.internalTrack = e);
            }
            getCodec() {
                return this.internalTrack.info.codec;
            }
            getCodedWidth() {
                return this.internalTrack.info.width;
            }
            getCodedHeight() {
                return this.internalTrack.info.height;
            }
            getRotation() {
                return this.internalTrack.info.rotation;
            }
            async getColorSpace() {
                return {
                    primaries: this.internalTrack.info.colorSpace?.primaries,
                    transfer: this.internalTrack.info.colorSpace?.transfer,
                    matrix: this.internalTrack.info.colorSpace?.matrix,
                    fullRange: this.internalTrack.info.colorSpace?.fullRange,
                };
            }
            async canBeTransparent() {
                return this.internalTrack.info.alphaMode;
            }
            async getDecoderConfig() {
                return this.internalTrack.info.codec
                    ? (this.decoderConfigPromise ??= (async () => {
                          let e = null;
                          return (
                              (this.internalTrack.info.codec === "vp9" ||
                                  this.internalTrack.info.codec === "av1" ||
                                  (this.internalTrack.info.codec === "avc" &&
                                      !this.internalTrack.info.codecDescription) ||
                                  (this.internalTrack.info.codec === "hevc" &&
                                      !this.internalTrack.info.codecDescription)) &&
                                  (e = await this.getFirstPacket({})),
                              {
                                  codec: yt({
                                      width: this.internalTrack.info.width,
                                      height: this.internalTrack.info.height,
                                      codec: this.internalTrack.info.codec,
                                      codecDescription: this.internalTrack.info.codecDescription,
                                      colorSpace: this.internalTrack.info.colorSpace,
                                      avcCodecInfo: this.internalTrack.info.codec === "avc" && e ? Jr(e.data) : null,
                                      hevcCodecInfo: this.internalTrack.info.codec === "hevc" && e ? ei(e.data) : null,
                                      vp9CodecInfo: this.internalTrack.info.codec === "vp9" && e ? _t(e.data) : null,
                                      av1CodecInfo: this.internalTrack.info.codec === "av1" && e ? Et(e.data) : null,
                                  }),
                                  codedWidth: this.internalTrack.info.width,
                                  codedHeight: this.internalTrack.info.height,
                                  description: this.internalTrack.info.codecDescription ?? void 0,
                                  colorSpace: this.internalTrack.info.colorSpace ?? void 0,
                              }
                          );
                      })())
                    : null;
            }
        },
        Er = class extends Mt {
            constructor(e) {
                super(e), (this.decoderConfig = null), (this.internalTrack = e);
            }
            getCodec() {
                return this.internalTrack.info.codec;
            }
            getNumberOfChannels() {
                return this.internalTrack.info.numberOfChannels;
            }
            getSampleRate() {
                return this.internalTrack.info.sampleRate;
            }
            async getDecoderConfig() {
                return this.internalTrack.info.codec
                    ? (this.decoderConfig ??= {
                          codec: Pt({
                              codec: this.internalTrack.info.codec,
                              codecDescription: this.internalTrack.info.codecDescription,
                              aacCodecInfo: this.internalTrack.info.aacCodecInfo,
                          }),
                          numberOfChannels: this.internalTrack.info.numberOfChannels,
                          sampleRate: this.internalTrack.info.sampleRate,
                          description: this.internalTrack.info.codecDescription ?? void 0,
                      })
                    : null;
            }
        },
        Tn = (t) => {
            let e = new Map();
            for (let a = 0; a < t.length; a++) {
                let s = t[a];
                e.set(s.timestamp, s);
            }
            let r = new Set(),
                i = [],
                n = (a) => {
                    if (!r.has(a)) {
                        r.add(a);
                        for (let s = 0; s < a.referencedTimestamps.length; s++) {
                            let o = a.referencedTimestamps[s],
                                c = e.get(o);
                            c && n(c);
                        }
                        i.push(a);
                    }
                };
            for (let a = 0; a < t.length; a++) n(t[a]);
            return i;
        };
    var wn = [44100, 48e3, 32e3],
        yn = [
            -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 32, 40, 48, 56, 64, 80, 96, 112, 128,
            160, 192, 224, 256, 320, -1, -1, 32, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, 384, -1, -1, 32,
            64, 96, 128, 160, 192, 224, 256, 288, 320, 352, 384, 416, 448, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
            -1, -1, -1, -1, -1, -1, -1, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160, -1, -1, 8, 16, 24,
            32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160, -1, -1, 32, 48, 56, 64, 80, 96, 112, 128, 144, 160, 176,
            192, 224, 256, -1,
        ],
        Si = 1483304551,
        xi = 1231971951,
        Pn = (t, e, r, i, n) =>
            e === 0
                ? 0
                : e === 1
                  ? Math.floor((144 * r) / (i << t)) + n
                  : e === 2
                    ? Math.floor((144 * r) / i) + n
                    : (Math.floor((12 * r) / i) + n) * 4,
        Ti = (t, e) => (t === 3 ? (e === 3 ? 21 : 36) : e === 3 ? 13 : 21),
        wi = (t, e) => {
            let r = t >>> 24,
                i = (t >>> 16) & 255,
                n = (t >>> 8) & 255,
                a = t & 255;
            if (r !== 255 && i !== 255 && n !== 255 && a !== 255) return { header: null, bytesAdvanced: 4 };
            if (r !== 255) return { header: null, bytesAdvanced: 1 };
            if ((i & 224) !== 224) return { header: null, bytesAdvanced: 1 };
            let s = 0,
                o = 0;
            i & 16 ? (s = i & 8 ? 0 : 1) : ((s = 1), (o = 1));
            let c = (i >> 3) & 3,
                l = (i >> 1) & 3,
                d = (n >> 4) & 15,
                u = ((n >> 2) & 3) % 3,
                f = (n >> 1) & 1,
                h = (a >> 6) & 3,
                m = (a >> 4) & 3,
                k = (a >> 3) & 1,
                b = (a >> 2) & 1,
                x = a & 3,
                g = yn[s * 16 * 4 + l * 16 + d];
            if (g === -1) return { header: null, bytesAdvanced: 1 };
            let w = g * 1e3,
                T = wn[u] >> (s + o),
                I = Pn(s, l, w, T, f);
            if (e !== null && e < I) return { header: null, bytesAdvanced: 1 };
            let E;
            return (
                c === 3 ? (E = l === 3 ? 384 : 1152) : l === 3 ? (E = 384) : l === 2 ? (E = 1152) : (E = 576),
                {
                    header: {
                        totalSize: I,
                        mpegVersionId: c,
                        layer: l,
                        bitrate: w,
                        frequencyIndex: u,
                        sampleRate: T,
                        channel: h,
                        modeExtension: m,
                        copyright: k,
                        original: b,
                        emphasis: x,
                        audioSamplesInFrame: E,
                    },
                    bytesAdvanced: 1,
                }
            );
        };
    var Vt = (t) => {
        let e = 2130706432,
            r = 0;
        for (; e !== 0; ) (r >>= 1), (r |= t & e), (e >>= 8);
        return r;
    };
    var He;
    (function (t) {
        (t[(t.Unsynchronisation = 128)] = "Unsynchronisation"),
            (t[(t.ExtendedHeader = 64)] = "ExtendedHeader"),
            (t[(t.ExperimentalIndicator = 32)] = "ExperimentalIndicator"),
            (t[(t.Footer = 16)] = "Footer");
    })(He || (He = {}));
    var qe;
    (function (t) {
        (t[(t.ISO_8859_1 = 0)] = "ISO_8859_1"),
            (t[(t.UTF_16_WITH_BOM = 1)] = "UTF_16_WITH_BOM"),
            (t[(t.UTF_16_BE_NO_BOM = 2)] = "UTF_16_BE_NO_BOM"),
            (t[(t.UTF_8 = 3)] = "UTF_8");
    })(qe || (qe = {}));
    var at = 128,
        je = 10,
        We = [
            "Blues",
            "Classic rock",
            "Country",
            "Dance",
            "Disco",
            "Funk",
            "Grunge",
            "Hip-hop",
            "Jazz",
            "Metal",
            "New age",
            "Oldies",
            "Other",
            "Pop",
            "Rhythm and blues",
            "Rap",
            "Reggae",
            "Rock",
            "Techno",
            "Industrial",
            "Alternative",
            "Ska",
            "Death metal",
            "Pranks",
            "Soundtrack",
            "Euro-techno",
            "Ambient",
            "Trip-hop",
            "Vocal",
            "Jazz & funk",
            "Fusion",
            "Trance",
            "Classical",
            "Instrumental",
            "Acid",
            "House",
            "Game",
            "Sound clip",
            "Gospel",
            "Noise",
            "Alternative rock",
            "Bass",
            "Soul",
            "Punk",
            "Space",
            "Meditative",
            "Instrumental pop",
            "Instrumental rock",
            "Ethnic",
            "Gothic",
            "Darkwave",
            "Techno-industrial",
            "Electronic",
            "Pop-folk",
            "Eurodance",
            "Dream",
            "Southern rock",
            "Comedy",
            "Cult",
            "Gangsta",
            "Top 40",
            "Christian rap",
            "Pop/funk",
            "Jungle music",
            "Native US",
            "Cabaret",
            "New wave",
            "Psychedelic",
            "Rave",
            "Showtunes",
            "Trailer",
            "Lo-fi",
            "Tribal",
            "Acid punk",
            "Acid jazz",
            "Polka",
            "Retro",
            "Musical",
            "Rock 'n' roll",
            "Hard rock",
            "Folk",
            "Folk rock",
            "National folk",
            "Swing",
            "Fast fusion",
            "Bebop",
            "Latin",
            "Revival",
            "Celtic",
            "Bluegrass",
            "Avantgarde",
            "Gothic rock",
            "Progressive rock",
            "Psychedelic rock",
            "Symphonic rock",
            "Slow rock",
            "Big band",
            "Chorus",
            "Easy listening",
            "Acoustic",
            "Humour",
            "Speech",
            "Chanson",
            "Opera",
            "Chamber music",
            "Sonata",
            "Symphony",
            "Booty bass",
            "Primus",
            "Porn groove",
            "Satire",
            "Slow jam",
            "Club",
            "Tango",
            "Samba",
            "Folklore",
            "Ballad",
            "Power ballad",
            "Rhythmic Soul",
            "Freestyle",
            "Duet",
            "Punk rock",
            "Drum solo",
            "A cappella",
            "Euro-house",
            "Dance hall",
            "Goa music",
            "Drum & bass",
            "Club-house",
            "Hardcore techno",
            "Terror",
            "Indie",
            "Britpop",
            "Negerpunk",
            "Polsk punk",
            "Beat",
            "Christian gangsta rap",
            "Heavy metal",
            "Black metal",
            "Crossover",
            "Contemporary Christian",
            "Christian rock",
            "Merengue",
            "Salsa",
            "Thrash metal",
            "Anime",
            "Jpop",
            "Synthpop",
            "Christmas",
            "Art rock",
            "Baroque",
            "Bhangra",
            "Big beat",
            "Breakbeat",
            "Chillout",
            "Downtempo",
            "Dub",
            "EBM",
            "Eclectic",
            "Electro",
            "Electroclash",
            "Emo",
            "Experimental",
            "Garage",
            "Global",
            "IDM",
            "Illbient",
            "Industro-Goth",
            "Jam Band",
            "Krautrock",
            "Leftfield",
            "Lounge",
            "Math rock",
            "New romantic",
            "Nu-breakz",
            "Post-punk",
            "Post-rock",
            "Psytrance",
            "Shoegaze",
            "Space rock",
            "Trop rock",
            "World music",
            "Neoclassical",
            "Audiobook",
            "Audio theatre",
            "Neue Deutsche Welle",
            "Podcast",
            "Indie rock",
            "G-Funk",
            "Dubstep",
            "Garage rock",
            "Psybient",
        ],
        yi = (t, e) => {
            let r = t.filePos;
            (e.raw ??= {}), (e.raw.TAG ??= _(t, at - 3)), (t.filePos = r);
            let i = Le(t, 30);
            i && (e.title ??= i);
            let n = Le(t, 30);
            n && (e.artist ??= n);
            let a = Le(t, 30);
            a && (e.album ??= a);
            let s = Le(t, 4),
                o = Number.parseInt(s, 10);
            Number.isInteger(o) && o > 0 && (e.date ??= new Date(o, 0, 1));
            let c = _(t, 30),
                l;
            if (c[28] === 0 && c[29] !== 0) {
                let u = c[29];
                u > 0 && (e.trackNumber ??= u), t.skip(-30), (l = Le(t, 28)), t.skip(2);
            } else t.skip(-30), (l = Le(t, 30));
            l && (e.comment ??= l);
            let d = P(t);
            d < We.length && (e.genre ??= We[d]);
        },
        Le = (t, e) => {
            let r = _(t, e),
                i = we(r.indexOf(0), r.length),
                n = r.subarray(0, i),
                a = "";
            for (let s = 0; s < n.length; s++) a += String.fromCharCode(n[s]);
            return a.trimEnd();
        },
        Ee = (t) => {
            let e = t.filePos,
                r = M(t, 3),
                i = P(t),
                n = P(t),
                a = P(t),
                s = y(t);
            if (r !== "ID3" || i === 255 || n === 255 || (s & 2155905152) !== 0) return (t.filePos = e), null;
            let o = Vt(s);
            return { majorVersion: i, revision: n, flags: a, size: o };
        },
        Lt = (t, e, r) => {
            if (![2, 3, 4].includes(e.majorVersion)) {
                console.warn(`Unsupported ID3v2 major version: ${e.majorVersion}`);
                return;
            }
            let i = _(t, e.size),
                n = new vr(e, i);
            if (
                (e.flags & He.Footer && n.removeFooter(),
                e.flags & He.Unsynchronisation && e.majorVersion === 3 && n.ununsynchronizeAll(),
                e.flags & He.ExtendedHeader)
            ) {
                let a = n.readU32();
                e.majorVersion === 3 ? (n.pos += a) : (n.pos += a - 4);
            }
            for (; n.pos <= n.bytes.length - n.frameHeaderSize(); ) {
                let a = n.readId3V2Frame();
                if (!a) break;
                let s = n.pos,
                    o = n.pos + a.size,
                    c = !1,
                    l = !1,
                    d = !1;
                if (
                    (e.majorVersion === 3
                        ? ((c = !!(a.flags & 64)), (l = !!(a.flags & 128)))
                        : e.majorVersion === 4 &&
                          ((c = !!(a.flags & 4)),
                          (l = !!(a.flags & 8)),
                          (d = !!(a.flags & 2) || !!(e.flags & He.Unsynchronisation))),
                    c)
                ) {
                    console.warn(`Skipping encrypted ID3v2 frame ${a.id}`), (n.pos = o);
                    continue;
                }
                if (l) {
                    console.warn(`Skipping compressed ID3v2 frame ${a.id}`), (n.pos = o);
                    continue;
                }
                switch (
                    (d && n.ununsynchronizeRegion(n.pos, o),
                    (r.raw ??= {}),
                    a.id[0] === "T"
                        ? (r.raw[a.id] ??= n.readId3V2EncodingAndText(o))
                        : (r.raw[a.id] ??= n.readBytes(a.size)),
                    (n.pos = s),
                    a.id)
                ) {
                    case "TIT2":
                    case "TT2":
                        r.title ??= n.readId3V2EncodingAndText(o);
                        break;
                    case "TIT3":
                    case "TT3":
                        r.description ??= n.readId3V2EncodingAndText(o);
                        break;
                    case "TPE1":
                    case "TP1":
                        r.artist ??= n.readId3V2EncodingAndText(o);
                        break;
                    case "TALB":
                    case "TAL":
                        r.album ??= n.readId3V2EncodingAndText(o);
                        break;
                    case "TPE2":
                    case "TP2":
                        r.albumArtist ??= n.readId3V2EncodingAndText(o);
                        break;
                    case "TRCK":
                    case "TRK":
                        {
                            let f = n.readId3V2EncodingAndText(o).split("/"),
                                h = Number.parseInt(f[0], 10),
                                m = f[1] && Number.parseInt(f[1], 10);
                            Number.isInteger(h) && h > 0 && (r.trackNumber ??= h),
                                m && Number.isInteger(m) && m > 0 && (r.tracksTotal ??= m);
                        }
                        break;
                    case "TPOS":
                    case "TPA":
                        {
                            let f = n.readId3V2EncodingAndText(o).split("/"),
                                h = Number.parseInt(f[0], 10),
                                m = f[1] && Number.parseInt(f[1], 10);
                            Number.isInteger(h) && h > 0 && (r.discNumber ??= h),
                                m && Number.isInteger(m) && m > 0 && (r.discsTotal ??= m);
                        }
                        break;
                    case "TCON":
                    case "TCO":
                        {
                            let u = n.readId3V2EncodingAndText(o),
                                f = /^\((\d+)\)/.exec(u);
                            if (f) {
                                let h = Number.parseInt(f[1]);
                                if (We[h] !== void 0) {
                                    r.genre ??= We[h];
                                    break;
                                }
                            }
                            if (((f = /^\d+$/.exec(u)), f)) {
                                let h = Number.parseInt(f[0]);
                                if (We[h] !== void 0) {
                                    r.genre ??= We[h];
                                    break;
                                }
                            }
                            r.genre ??= u;
                        }
                        break;
                    case "TDRC":
                    case "TDAT":
                        {
                            let u = n.readId3V2EncodingAndText(o),
                                f = new Date(u);
                            Number.isNaN(f.getTime()) || (r.date ??= f);
                        }
                        break;
                    case "TYER":
                    case "TYE":
                        {
                            let u = n.readId3V2EncodingAndText(o),
                                f = Number.parseInt(u, 10);
                            Number.isInteger(f) && (r.date ??= new Date(f, 0, 1));
                        }
                        break;
                    case "USLT":
                    case "ULT":
                        {
                            let u = n.readU8();
                            (n.pos += 3), n.readId3V2Text(u, o), (r.lyrics ??= n.readId3V2Text(u, o));
                        }
                        break;
                    case "COMM":
                    case "COM":
                        {
                            let u = n.readU8();
                            (n.pos += 3), n.readId3V2Text(u, o), (r.comment ??= n.readId3V2Text(u, o));
                        }
                        break;
                    case "APIC":
                    case "PIC":
                        {
                            let u = n.readId3V2TextEncoding(),
                                f;
                            if (e.majorVersion === 2) {
                                let b = n.readAscii(3);
                                f = b === "PNG" ? "image/png" : b === "JPG" ? "image/jpeg" : "image/*";
                            } else f = n.readId3V2Text(u, o);
                            let h = n.readU8(),
                                m = n.readId3V2Text(u, o).trimEnd(),
                                k = o - n.pos;
                            if (k >= 0) {
                                let b = n.readBytes(k);
                                r.images || (r.images = []),
                                    r.images.push({
                                        data: b,
                                        mimeType: f,
                                        kind: h === 3 ? "coverFront" : h === 4 ? "coverBack" : "unknown",
                                        description: m,
                                    });
                            }
                        }
                        break;
                    default:
                        n.pos += a.size;
                        break;
                }
                n.pos = o;
            }
        },
        vr = class {
            constructor(e, r) {
                (this.header = e),
                    (this.bytes = r),
                    (this.pos = 0),
                    (this.view = new DataView(r.buffer, r.byteOffset, r.byteLength));
            }
            frameHeaderSize() {
                return this.header.majorVersion === 2 ? 6 : 10;
            }
            ununsynchronizeAll() {
                let e = [];
                for (let r = 0; r < this.bytes.length; r++) {
                    let i = this.bytes[r];
                    e.push(i), i === 255 && r !== this.bytes.length - 1 && this.bytes[r] === 0 && r++;
                }
                (this.bytes = new Uint8Array(e)), (this.view = new DataView(this.bytes.buffer));
            }
            ununsynchronizeRegion(e, r) {
                let i = [];
                for (let s = e; s < r; s++) {
                    let o = this.bytes[s];
                    i.push(o), o === 255 && s !== r - 1 && this.bytes[s + 1] === 0 && s++;
                }
                let n = this.bytes.subarray(0, e),
                    a = this.bytes.subarray(r);
                (this.bytes = new Uint8Array(n.length + i.length + a.length)),
                    this.bytes.set(n, 0),
                    this.bytes.set(i, n.length),
                    this.bytes.set(a, n.length + i.length),
                    (this.view = new DataView(this.bytes.buffer));
            }
            removeFooter() {
                (this.bytes = this.bytes.subarray(0, this.bytes.length - je)),
                    (this.view = new DataView(this.bytes.buffer));
            }
            readBytes(e) {
                let r = this.bytes.subarray(this.pos, this.pos + e);
                return (this.pos += e), r;
            }
            readU8() {
                let e = this.view.getUint8(this.pos);
                return (this.pos += 1), e;
            }
            readU16() {
                let e = this.view.getUint16(this.pos, !1);
                return (this.pos += 2), e;
            }
            readU24() {
                let e = this.view.getUint16(this.pos, !1),
                    r = this.view.getUint8(this.pos + 1);
                return (this.pos += 3), e * 256 + r;
            }
            readU32() {
                let e = this.view.getUint32(this.pos, !1);
                return (this.pos += 4), e;
            }
            readAscii(e) {
                let r = "";
                for (let i = 0; i < e; i++) r += String.fromCharCode(this.view.getUint8(this.pos + i));
                return (this.pos += e), r;
            }
            readId3V2Frame() {
                if (this.header.majorVersion === 2) {
                    let e = this.readAscii(3);
                    if (e === "\0\0\0") return null;
                    let r = this.readU24();
                    return { id: e, size: r, flags: 0 };
                } else {
                    let e = this.readAscii(4);
                    if (e === "\0\0\0\0") return null;
                    let r = this.readU32(),
                        i = this.header.majorVersion === 4 ? Vt(r) : r,
                        n = this.readU16(),
                        a = this.pos,
                        s = (o) => {
                            let c = this.pos + o;
                            if (c > this.bytes.length) return !1;
                            if (c <= this.bytes.length - this.frameHeaderSize()) {
                                this.pos += o;
                                let l = this.readAscii(4);
                                if (l !== "\0\0\0\0" && !/[0-9A-Z]{4}/.test(l)) return !1;
                            }
                            return !0;
                        };
                    if (!s(i)) {
                        let o = this.header.majorVersion === 4 ? r : Vt(r);
                        s(o) && (i = o);
                    }
                    return (this.pos = a), { id: e, size: i, flags: n };
                }
            }
            readId3V2TextEncoding() {
                let e = this.readU8();
                if (e > 3) throw new Error(`Unsupported text encoding: ${e}`);
                return e;
            }
            readId3V2Text(e, r) {
                let i = this.pos,
                    n = this.readBytes(r - this.pos);
                switch (e) {
                    case qe.ISO_8859_1: {
                        let a = "";
                        for (let s = 0; s < n.length; s++) {
                            let o = n[s];
                            if (o === 0) {
                                this.pos = i + s + 1;
                                break;
                            }
                            a += String.fromCharCode(o);
                        }
                        return a;
                    }
                    case qe.UTF_16_WITH_BOM:
                        if (n[0] === 255 && n[1] === 254) {
                            let a = new TextDecoder("utf-16le"),
                                s = we(
                                    n.findIndex((o, c) => o === 0 && n[c + 1] === 0 && c % 2 === 0),
                                    n.length
                                );
                            return (this.pos = i + Math.min(s + 2, n.length)), a.decode(n.subarray(2, s));
                        } else if (n[0] === 254 && n[1] === 255) {
                            let a = new TextDecoder("utf-16be"),
                                s = we(
                                    n.findIndex((o, c) => o === 0 && n[c + 1] === 0 && c % 2 === 0),
                                    n.length
                                );
                            return (this.pos = i + Math.min(s + 2, n.length)), a.decode(n.subarray(2, s));
                        } else {
                            let a = we(
                                n.findIndex((s) => s === 0),
                                n.length
                            );
                            return (this.pos = i + Math.min(a + 1, n.length)), H.decode(n.subarray(0, a));
                        }
                    case qe.UTF_16_BE_NO_BOM: {
                        let a = new TextDecoder("utf-16be"),
                            s = we(
                                n.findIndex((o, c) => o === 0 && n[c + 1] === 0 && c % 2 === 0),
                                n.length
                            );
                        return (this.pos = i + Math.min(s + 2, n.length)), a.decode(n.subarray(0, s));
                    }
                    case qe.UTF_8: {
                        let a = we(
                            n.findIndex((s) => s === 0),
                            n.length
                        );
                        return (this.pos = i + Math.min(a + 1, n.length)), H.decode(n.subarray(0, a));
                    }
                }
            }
            readId3V2EncodingAndText(e) {
                if (this.pos >= e) return "";
                let r = this.readId3V2TextEncoding();
                return this.readId3V2Text(r, e);
            }
        };
    var ot = async (t, e, r) => {
        let i = e;
        for (; r === null || i < r; ) {
            let n = t.requestSlice(i, 4);
            if ((n instanceof Promise && (n = await n), !n)) break;
            let a = y(n),
                s = wi(a, t.fileSize !== null ? t.fileSize - i : null);
            if (s.header) return { header: s.header, startPos: i };
            i += s.bytesAdvanced;
        }
        return null;
    };
    var Ht = class extends K {
            constructor(e) {
                super(e),
                    (this.metadataPromise = null),
                    (this.firstFrameHeader = null),
                    (this.loadedSamples = []),
                    (this.metadataTags = null),
                    (this.tracks = []),
                    (this.readingMutex = new ne()),
                    (this.lastSampleLoaded = !1),
                    (this.lastLoadedPos = 0),
                    (this.nextTimestampInSamples = 0),
                    (this.reader = e._reader);
            }
            async readMetadata() {
                return (this.metadataPromise ??= (async () => {
                    for (; !this.firstFrameHeader && !this.lastSampleLoaded; ) await this.advanceReader();
                    if (!this.firstFrameHeader) throw new Error("No valid MP3 frame found.");
                    this.tracks = [new W(this.input, new Ar(this))];
                })());
            }
            async advanceReader() {
                if (this.lastLoadedPos === 0)
                    for (;;) {
                        let o = this.reader.requestSlice(this.lastLoadedPos, je);
                        if ((o instanceof Promise && (o = await o), !o)) {
                            this.lastSampleLoaded = !0;
                            return;
                        }
                        let c = Ee(o);
                        if (!c) break;
                        this.lastLoadedPos = o.filePos + c.size;
                    }
                let e = await ot(this.reader, this.lastLoadedPos, this.reader.fileSize);
                if (!e) {
                    this.lastSampleLoaded = !0;
                    return;
                }
                let r = e.header;
                this.lastLoadedPos = e.startPos + r.totalSize - 1;
                let i = Ti(r.mpegVersionId, r.channel),
                    n = this.reader.requestSlice(e.startPos + i, 4);
                if ((n instanceof Promise && (n = await n), n)) {
                    let o = y(n);
                    if (o === Si || o === xi) return;
                }
                this.firstFrameHeader || (this.firstFrameHeader = r),
                    r.sampleRate !== this.firstFrameHeader.sampleRate &&
                        console.warn(
                            `MP3 changed sample rate mid-file: ${this.firstFrameHeader.sampleRate} Hz to ${r.sampleRate} Hz. Might be a bug, so please report this file.`
                        );
                let a = r.audioSamplesInFrame / this.firstFrameHeader.sampleRate,
                    s = {
                        timestamp: this.nextTimestampInSamples / this.firstFrameHeader.sampleRate,
                        duration: a,
                        dataStart: e.startPos,
                        dataSize: r.totalSize,
                    };
                this.loadedSamples.push(s), (this.nextTimestampInSamples += r.audioSamplesInFrame);
            }
            async getMimeType() {
                return "audio/mpeg";
            }
            async getTracks() {
                return await this.readMetadata(), this.tracks;
            }
            async computeDuration() {
                await this.readMetadata();
                let e = this.tracks[0];
                return p(e), e.computeDuration();
            }
            async getMetadataTags() {
                let e = await this.readingMutex.acquire();
                try {
                    if ((await this.readMetadata(), this.metadataTags)) return this.metadataTags;
                    this.metadataTags = {};
                    let r = 0,
                        i = !1;
                    for (;;) {
                        let n = this.reader.requestSlice(r, je);
                        if ((n instanceof Promise && (n = await n), !n)) break;
                        let a = Ee(n);
                        if (!a) break;
                        i = !0;
                        let s = this.reader.requestSlice(n.filePos, a.size);
                        if ((s instanceof Promise && (s = await s), !s)) break;
                        Lt(s, a, this.metadataTags), (r = n.filePos + a.size);
                    }
                    if (!i && this.reader.fileSize !== null && this.reader.fileSize >= at) {
                        let n = this.reader.requestSlice(this.reader.fileSize - at, at);
                        n instanceof Promise && (n = await n), p(n), M(n, 3) === "TAG" && yi(n, this.metadataTags);
                    }
                    return this.metadataTags;
                } finally {
                    e();
                }
            }
        },
        Ar = class {
            constructor(e) {
                this.demuxer = e;
            }
            getId() {
                return 1;
            }
            async getFirstTimestamp() {
                return 0;
            }
            getTimeResolution() {
                return (
                    p(this.demuxer.firstFrameHeader),
                    this.demuxer.firstFrameHeader.sampleRate / this.demuxer.firstFrameHeader.audioSamplesInFrame
                );
            }
            async computeDuration() {
                let e = await this.getPacket(1 / 0, { metadataOnly: !0 });
                return (e?.timestamp ?? 0) + (e?.duration ?? 0);
            }
            getName() {
                return null;
            }
            getLanguageCode() {
                return q;
            }
            getCodec() {
                return "mp3";
            }
            getInternalCodecId() {
                return null;
            }
            getNumberOfChannels() {
                return p(this.demuxer.firstFrameHeader), this.demuxer.firstFrameHeader.channel === 3 ? 1 : 2;
            }
            getSampleRate() {
                return p(this.demuxer.firstFrameHeader), this.demuxer.firstFrameHeader.sampleRate;
            }
            async getDecoderConfig() {
                return (
                    p(this.demuxer.firstFrameHeader),
                    {
                        codec: "mp3",
                        numberOfChannels: this.demuxer.firstFrameHeader.channel === 3 ? 1 : 2,
                        sampleRate: this.demuxer.firstFrameHeader.sampleRate,
                    }
                );
            }
            async getPacketAtIndex(e, r) {
                if (e === -1) return null;
                let i = this.demuxer.loadedSamples[e];
                if (!i) return null;
                let n;
                if (r.metadataOnly) n = V;
                else {
                    let a = this.demuxer.reader.requestSlice(i.dataStart, i.dataSize);
                    if ((a instanceof Promise && (a = await a), !a)) return null;
                    n = _(a, i.dataSize);
                }
                return new U(n, "key", i.timestamp, i.duration, e, i.dataSize);
            }
            getFirstPacket(e) {
                return this.getPacketAtIndex(0, e);
            }
            async getNextPacket(e, r) {
                let i = await this.demuxer.readingMutex.acquire();
                try {
                    let n = Fe(this.demuxer.loadedSamples, e.timestamp, (s) => s.timestamp);
                    if (n === -1) throw new Error("Packet was not created from this track.");
                    let a = n + 1;
                    for (; a >= this.demuxer.loadedSamples.length && !this.demuxer.lastSampleLoaded; )
                        await this.demuxer.advanceReader();
                    return this.getPacketAtIndex(a, r);
                } finally {
                    i();
                }
            }
            async getPacket(e, r) {
                let i = await this.demuxer.readingMutex.acquire();
                try {
                    for (;;) {
                        let n = F(this.demuxer.loadedSamples, e, (a) => a.timestamp);
                        if (n === -1 && this.demuxer.loadedSamples.length > 0) return null;
                        if (this.demuxer.lastSampleLoaded) return this.getPacketAtIndex(n, r);
                        if (n >= 0 && n + 1 < this.demuxer.loadedSamples.length) return this.getPacketAtIndex(n, r);
                        await this.demuxer.advanceReader();
                    }
                } finally {
                    i();
                }
            }
            getKeyPacket(e, r) {
                return this.getPacket(e, r);
            }
            getNextKeyPacket(e, r) {
                return this.getNextPacket(e, r);
            }
        };
    var Dr = 1399285583,
        Cn = 79764919,
        Ci = new Uint32Array(256);
    for (let t = 0; t < 256; t++) {
        let e = t << 24;
        for (let r = 0; r < 8; r++) e = e & 2147483648 ? (e << 1) ^ Cn : e << 1;
        Ci[t] = (e >>> 0) & 4294967295;
    }
    var Ii = (t) => {
            let e = O(t),
                r = e.getUint32(22, !0);
            e.setUint32(22, 0, !0);
            let i = 0;
            for (let n = 0; n < t.length; n++) {
                let a = t[n];
                i = ((i << 8) ^ Ci[(i >>> 24) ^ a]) >>> 0;
            }
            return e.setUint32(22, r, !0), i;
        },
        _i = (t, e, r) => {
            let i = 0,
                n = null;
            if (t.length > 0)
                if (e.codec === "vorbis") {
                    p(e.vorbisInfo);
                    let a = e.vorbisInfo.modeBlockflags.length,
                        o = ((1 << jr(a - 1)) - 1) << 1,
                        c = (t[0] & o) >> 1;
                    if (c >= e.vorbisInfo.modeBlockflags.length) throw new Error("Invalid mode number.");
                    let l = r,
                        d = e.vorbisInfo.modeBlockflags[c];
                    if (((n = e.vorbisInfo.blocksizes[d]), d === 1)) {
                        let u = (o | 1) + 1,
                            f = t[0] & u ? 1 : 0;
                        l = e.vorbisInfo.blocksizes[f];
                    }
                    i = l !== null ? (l + n) >> 2 : 0;
                } else e.codec === "opus" && (i = ii(t).durationInSamples);
            return { durationInSamples: i, vorbisBlockSize: n };
        },
        Ei = (t) => {
            let e = "audio/ogg";
            if (t.codecStrings) {
                let r = [...new Set(t.codecStrings)];
                e += `; codecs="${r.join(", ")}"`;
            }
            return e;
        };
    var be = 27,
        Ae = 282,
        vi = Ae + 65025,
        Ke = (t) => {
            let e = t.filePos;
            if (ve(t) !== Dr) return null;
            t.skip(1);
            let i = P(t),
                n = Di(t),
                a = ve(t),
                s = ve(t),
                o = ve(t),
                c = P(t),
                l = new Uint8Array(c);
            for (let h = 0; h < c; h++) l[h] = P(t);
            let d = 27 + c,
                u = l.reduce((h, m) => h + m, 0),
                f = d + u;
            return {
                headerStartPos: e,
                totalSize: f,
                dataStartPos: e + d,
                dataSize: u,
                headerType: i,
                granulePosition: n,
                serialNumber: a,
                sequenceNumber: s,
                checksum: o,
                lacingValues: l,
            };
        },
        Ai = (t, e) => {
            for (; t.filePos < e - 3; ) {
                let r = ve(t),
                    i = r & 255,
                    n = (r >>> 8) & 255,
                    a = (r >>> 16) & 255,
                    s = (r >>> 24) & 255,
                    o = 79;
                if (!(i !== o && n !== o && a !== o && s !== o)) {
                    if ((t.skip(-4), r === Dr)) return !0;
                    t.skip(1);
                }
            }
            return !1;
        };
    var qt = class extends K {
            constructor(e) {
                super(e),
                    (this.metadataPromise = null),
                    (this.bitstreams = []),
                    (this.tracks = []),
                    (this.metadataTags = {}),
                    (this.reader = e._reader);
            }
            async readMetadata() {
                return (this.metadataPromise ??= (async () => {
                    let e = 0;
                    for (;;) {
                        let r = this.reader.requestSliceRange(e, be, Ae);
                        if ((r instanceof Promise && (r = await r), !r)) break;
                        let i = Ke(r);
                        if (!i || !!!(i.headerType & 2)) break;
                        this.bitstreams.push({
                            serialNumber: i.serialNumber,
                            bosPage: i,
                            description: null,
                            numberOfChannels: -1,
                            sampleRate: -1,
                            codecInfo: { codec: null, vorbisInfo: null, opusInfo: null },
                            lastMetadataPacket: null,
                        }),
                            (e = i.headerStartPos + i.totalSize);
                    }
                    for (let r of this.bitstreams) {
                        let i = await this.readPacket(r.bosPage, 0);
                        i &&
                            (i.data.byteLength >= 7 &&
                            i.data[0] === 1 &&
                            i.data[1] === 118 &&
                            i.data[2] === 111 &&
                            i.data[3] === 114 &&
                            i.data[4] === 98 &&
                            i.data[5] === 105 &&
                            i.data[6] === 115
                                ? await this.readVorbisMetadata(i, r)
                                : i.data.byteLength >= 8 &&
                                  i.data[0] === 79 &&
                                  i.data[1] === 112 &&
                                  i.data[2] === 117 &&
                                  i.data[3] === 115 &&
                                  i.data[4] === 72 &&
                                  i.data[5] === 101 &&
                                  i.data[6] === 97 &&
                                  i.data[7] === 100 &&
                                  (await this.readOpusMetadata(i, r)),
                            r.codecInfo.codec !== null && this.tracks.push(new W(this.input, new Fr(r, this))));
                    }
                })());
            }
            async readVorbisMetadata(e, r) {
                let i = await this.findNextPacketStart(e);
                if (!i) return;
                let n = await this.readPacket(i.startPage, i.startSegmentIndex);
                if (!n || ((i = await this.findNextPacketStart(n)), !i)) return;
                let a = await this.readPacket(i.startPage, i.startSegmentIndex);
                if (!a || n.data[0] !== 3 || a.data[0] !== 5) return;
                let s = [],
                    o = (u) => {
                        for (; s.push(Math.min(255, u)), !(u < 255); ) u -= 255;
                    };
                o(e.data.length), o(n.data.length);
                let c = new Uint8Array(1 + s.length + e.data.length + n.data.length + a.data.length);
                (c[0] = 2),
                    c.set(s, 1),
                    c.set(e.data, 1 + s.length),
                    c.set(n.data, 1 + s.length + e.data.length),
                    c.set(a.data, 1 + s.length + e.data.length + n.data.length),
                    (r.codecInfo.codec = "vorbis"),
                    (r.description = c),
                    (r.lastMetadataPacket = a);
                let l = O(e.data);
                (r.numberOfChannels = l.getUint8(11)), (r.sampleRate = l.getUint32(12, !0));
                let d = l.getUint8(28);
                (r.codecInfo.vorbisInfo = {
                    blocksizes: [1 << (d & 15), 1 << (d >> 4)],
                    modeBlockflags: ni(a.data).modeBlockflags,
                }),
                    rt(n.data.subarray(7), this.metadataTags);
            }
            async readOpusMetadata(e, r) {
                let i = await this.findNextPacketStart(e);
                if (!i) return;
                let n = await this.readPacket(i.startPage, i.startSegmentIndex);
                if (!n) return;
                (r.codecInfo.codec = "opus"), (r.description = e.data), (r.lastMetadataPacket = n);
                let a = ri(e.data);
                (r.numberOfChannels = a.outputChannelCount),
                    (r.sampleRate = Pe),
                    (r.codecInfo.opusInfo = { preSkip: a.preSkip }),
                    rt(n.data.subarray(8), this.metadataTags);
            }
            async readPacket(e, r) {
                p(r < e.lacingValues.length);
                let i = 0;
                for (let u = 0; u < r; u++) i += e.lacingValues[u];
                let n = e,
                    a = i,
                    s = r,
                    o = [];
                e: for (;;) {
                    let u = this.reader.requestSlice(n.dataStartPos, n.dataSize);
                    u instanceof Promise && (u = await u), p(u);
                    let f = _(u, n.dataSize);
                    for (;;) {
                        if (s === n.lacingValues.length) {
                            o.push(f.subarray(i, a));
                            break;
                        }
                        let m = n.lacingValues[s];
                        if (((a += m), m < 255)) {
                            o.push(f.subarray(i, a));
                            break e;
                        }
                        s++;
                    }
                    let h = n.headerStartPos + n.totalSize;
                    for (;;) {
                        let m = this.reader.requestSliceRange(h, be, Ae);
                        if ((m instanceof Promise && (m = await m), !m)) return null;
                        let k = Ke(m);
                        if (!k) return null;
                        if (((n = k), n.serialNumber === e.serialNumber)) break;
                        h = n.headerStartPos + n.totalSize;
                    }
                    (i = 0), (a = 0), (s = 0);
                }
                let c = o.reduce((u, f) => u + f.length, 0),
                    l = new Uint8Array(c),
                    d = 0;
                for (let u = 0; u < o.length; u++) {
                    let f = o[u];
                    l.set(f, d), (d += f.length);
                }
                return { data: l, endPage: n, endSegmentIndex: s };
            }
            async findNextPacketStart(e) {
                if (e.endSegmentIndex < e.endPage.lacingValues.length - 1)
                    return { startPage: e.endPage, startSegmentIndex: e.endSegmentIndex + 1 };
                if (!!(e.endPage.headerType & 4)) return null;
                let i = e.endPage.headerStartPos + e.endPage.totalSize;
                for (;;) {
                    let n = this.reader.requestSliceRange(i, be, Ae);
                    if ((n instanceof Promise && (n = await n), !n)) return null;
                    let a = Ke(n);
                    if (!a) return null;
                    if (a.serialNumber === e.endPage.serialNumber) return { startPage: a, startSegmentIndex: 0 };
                    i = a.headerStartPos + a.totalSize;
                }
            }
            async getMimeType() {
                await this.readMetadata();
                let e = await Promise.all(this.tracks.map((r) => r.getCodecParameterString()));
                return Ei({ codecStrings: e.filter(Boolean) });
            }
            async getTracks() {
                return await this.readMetadata(), this.tracks;
            }
            async computeDuration() {
                let e = await this.getTracks(),
                    r = await Promise.all(e.map((i) => i.computeDuration()));
                return Math.max(0, ...r);
            }
            async getMetadataTags() {
                return await this.readMetadata(), this.metadataTags;
            }
        },
        Fr = class {
            constructor(e, r) {
                (this.bitstream = e),
                    (this.demuxer = r),
                    (this.encodedPacketToMetadata = new WeakMap()),
                    (this.sequentialScanCache = []),
                    (this.sequentialScanMutex = new ne()),
                    (this.internalSampleRate = e.codecInfo.codec === "opus" ? Pe : e.sampleRate);
            }
            getId() {
                return this.bitstream.serialNumber;
            }
            getNumberOfChannels() {
                return this.bitstream.numberOfChannels;
            }
            getSampleRate() {
                return this.bitstream.sampleRate;
            }
            getTimeResolution() {
                return this.bitstream.sampleRate;
            }
            getCodec() {
                return this.bitstream.codecInfo.codec;
            }
            getInternalCodecId() {
                return null;
            }
            async getDecoderConfig() {
                return (
                    p(this.bitstream.codecInfo.codec),
                    {
                        codec: this.bitstream.codecInfo.codec,
                        numberOfChannels: this.bitstream.numberOfChannels,
                        sampleRate: this.bitstream.sampleRate,
                        description: this.bitstream.description ?? void 0,
                    }
                );
            }
            getName() {
                return null;
            }
            getLanguageCode() {
                return q;
            }
            async getFirstTimestamp() {
                return 0;
            }
            async computeDuration() {
                let e = await this.getPacket(1 / 0, { metadataOnly: !0 });
                return (e?.timestamp ?? 0) + (e?.duration ?? 0);
            }
            granulePositionToTimestampInSamples(e) {
                return this.bitstream.codecInfo.codec === "opus"
                    ? (p(this.bitstream.codecInfo.opusInfo), e - this.bitstream.codecInfo.opusInfo.preSkip)
                    : e;
            }
            createEncodedPacketFromOggPacket(e, r, i) {
                if (!e) return null;
                let { durationInSamples: n, vorbisBlockSize: a } = _i(
                        e.data,
                        this.bitstream.codecInfo,
                        r.vorbisLastBlocksize
                    ),
                    s = new U(
                        i.metadataOnly ? V : e.data,
                        "key",
                        Math.max(0, r.timestampInSamples) / this.internalSampleRate,
                        n / this.internalSampleRate,
                        e.endPage.headerStartPos + e.endSegmentIndex,
                        e.data.byteLength
                    );
                return (
                    this.encodedPacketToMetadata.set(s, {
                        packet: e,
                        timestampInSamples: r.timestampInSamples,
                        durationInSamples: n,
                        vorbisLastBlockSize: r.vorbisLastBlocksize,
                        vorbisBlockSize: a,
                    }),
                    s
                );
            }
            async getFirstPacket(e) {
                p(this.bitstream.lastMetadataPacket);
                let r = await this.demuxer.findNextPacketStart(this.bitstream.lastMetadataPacket);
                if (!r) return null;
                let i = 0;
                this.bitstream.codecInfo.codec === "opus" &&
                    (p(this.bitstream.codecInfo.opusInfo), (i -= this.bitstream.codecInfo.opusInfo.preSkip));
                let n = await this.demuxer.readPacket(r.startPage, r.startSegmentIndex);
                return this.createEncodedPacketFromOggPacket(
                    n,
                    { timestampInSamples: i, vorbisLastBlocksize: null },
                    e
                );
            }
            async getNextPacket(e, r) {
                let i = this.encodedPacketToMetadata.get(e);
                if (!i) throw new Error("Packet was not created from this track.");
                let n = await this.demuxer.findNextPacketStart(i.packet);
                if (!n) return null;
                let a = i.timestampInSamples + i.durationInSamples,
                    s = await this.demuxer.readPacket(n.startPage, n.startSegmentIndex);
                return this.createEncodedPacketFromOggPacket(
                    s,
                    { timestampInSamples: a, vorbisLastBlocksize: i.vorbisBlockSize },
                    r
                );
            }
            async getPacket(e, r) {
                if (this.demuxer.reader.fileSize === null) return this.getPacketSequential(e, r);
                let i = Te(e * this.internalSampleRate, 14);
                if (i === 0) return this.getFirstPacket(r);
                if (i < 0) return null;
                p(this.bitstream.lastMetadataPacket);
                let n = await this.demuxer.findNextPacketStart(this.bitstream.lastMetadataPacket);
                if (!n) return null;
                let a = n.startPage,
                    s = this.demuxer.reader.fileSize,
                    o = [a];
                e: for (; a.headerStartPos + a.totalSize < s; ) {
                    let g = a.headerStartPos,
                        w = Math.floor((g + s) / 2),
                        T = w;
                    for (;;) {
                        let I = Math.min(T + vi, s - be),
                            E = this.demuxer.reader.requestSlice(T, I - T);
                        if ((E instanceof Promise && (E = await E), p(E), !Ai(E, I))) {
                            s = w + be;
                            continue e;
                        }
                        let v = this.demuxer.reader.requestSliceRange(E.filePos, be, Ae);
                        v instanceof Promise && (v = await v), p(v);
                        let R = Ke(v);
                        p(R);
                        let z = !1;
                        if (R.serialNumber === this.bitstream.serialNumber) z = !0;
                        else {
                            let J = this.demuxer.reader.requestSlice(R.headerStartPos, R.totalSize);
                            J instanceof Promise && (J = await J), p(J);
                            let Ye = _(J, R.totalSize);
                            z = Ii(Ye) === R.checksum;
                        }
                        if (!z) {
                            T = R.headerStartPos + 4;
                            continue;
                        }
                        if (z && R.serialNumber !== this.bitstream.serialNumber) {
                            T = R.headerStartPos + R.totalSize;
                            continue;
                        }
                        if (R.granulePosition === -1) {
                            T = R.headerStartPos + R.totalSize;
                            continue;
                        }
                        this.granulePositionToTimestampInSamples(R.granulePosition) > i
                            ? (s = R.headerStartPos)
                            : ((a = R), o.push(R));
                        continue e;
                    }
                }
                let c = n.startPage;
                for (let g of o) {
                    if (g.granulePosition === a.granulePosition) break;
                    (!c || g.headerStartPos > c.headerStartPos) && (c = g);
                }
                let l = c,
                    d = [l];
                for (; !(l.serialNumber === this.bitstream.serialNumber && l.granulePosition === a.granulePosition); ) {
                    let g = l.headerStartPos + l.totalSize,
                        w = this.demuxer.reader.requestSliceRange(g, be, Ae);
                    w instanceof Promise && (w = await w), p(w);
                    let T = Ke(w);
                    p(T), (l = T), l.serialNumber === this.bitstream.serialNumber && d.push(l);
                }
                p(l.granulePosition !== -1);
                let u = null,
                    f,
                    h,
                    m = l,
                    k = 0;
                if (l.headerStartPos === n.startPage.headerStartPos)
                    (f = this.granulePositionToTimestampInSamples(0)), (h = !0), (u = 0);
                else {
                    (f = 0), (h = !1);
                    for (let T = l.lacingValues.length - 1; T >= 0; T--)
                        if (l.lacingValues[T] < 255) {
                            u = T + 1;
                            break;
                        }
                    if (u === null) throw new Error("Invalid page with granule position: no packets end on this page.");
                    k = u - 1;
                    let g = { data: V, endPage: m, endSegmentIndex: k };
                    if (await this.demuxer.findNextPacketStart(g)) {
                        let T = Bi(d, l, u);
                        p(T);
                        let I = Fi(d, T.page, T.segmentIndex);
                        I && ((l = I.page), (u = I.segmentIndex));
                    } else
                        for (;;) {
                            let T = Bi(d, l, u);
                            if (!T) break;
                            let I = Fi(d, T.page, T.segmentIndex);
                            if (!I) break;
                            if (((l = I.page), (u = I.segmentIndex), T.page.headerStartPos !== m.headerStartPos)) {
                                (m = T.page), (k = T.segmentIndex);
                                break;
                            }
                        }
                }
                let b = null,
                    x = null;
                for (; l !== null; ) {
                    p(u !== null);
                    let g = await this.demuxer.readPacket(l, u);
                    if (!g) break;
                    if (!(l.headerStartPos === n.startPage.headerStartPos && u < n.startSegmentIndex)) {
                        let I = this.createEncodedPacketFromOggPacket(
                            g,
                            { timestampInSamples: f, vorbisLastBlocksize: x?.vorbisBlockSize ?? null },
                            r
                        );
                        p(I);
                        let E = this.encodedPacketToMetadata.get(I);
                        if (
                            (p(E),
                            !h && g.endPage.headerStartPos === m.headerStartPos && g.endSegmentIndex === k
                                ? ((f = this.granulePositionToTimestampInSamples(l.granulePosition)),
                                  (h = !0),
                                  (I = this.createEncodedPacketFromOggPacket(
                                      g,
                                      {
                                          timestampInSamples: f - E.durationInSamples,
                                          vorbisLastBlocksize: x?.vorbisBlockSize ?? null,
                                      },
                                      r
                                  )),
                                  p(I),
                                  (E = this.encodedPacketToMetadata.get(I)),
                                  p(E))
                                : (f += E.durationInSamples),
                            (b = I),
                            (x = E),
                            h && (Math.max(f, 0) > i || Math.max(E.timestampInSamples, 0) === i))
                        )
                            break;
                    }
                    let T = await this.demuxer.findNextPacketStart(g);
                    if (!T) break;
                    (l = T.startPage), (u = T.startSegmentIndex);
                }
                return b;
            }
            async getPacketSequential(e, r) {
                let i = await this.sequentialScanMutex.acquire();
                try {
                    let n = Te(e * this.internalSampleRate, 14);
                    e = n / this.internalSampleRate;
                    let a = F(this.sequentialScanCache, n, (c) => c.timestampInSamples),
                        s;
                    if (a !== -1) {
                        let c = this.sequentialScanCache[a];
                        s = this.createEncodedPacketFromOggPacket(
                            c.packet,
                            { timestampInSamples: c.timestampInSamples, vorbisLastBlocksize: c.vorbisLastBlockSize },
                            r
                        );
                    } else s = await this.getFirstPacket(r);
                    let o = 0;
                    for (; s && s.timestamp < e; ) {
                        let c = await this.getNextPacket(s, r);
                        if (!c || c.timestamp > e) break;
                        if (((s = c), o++, o === 100)) {
                            o = 0;
                            let l = this.encodedPacketToMetadata.get(s);
                            p(l),
                                this.sequentialScanCache.length > 0 &&
                                    p(G(this.sequentialScanCache).timestampInSamples <= l.timestampInSamples),
                                this.sequentialScanCache.push(l);
                        }
                    }
                    return s;
                } finally {
                    i();
                }
            }
            getKeyPacket(e, r) {
                return this.getPacket(e, r);
            }
            getNextKeyPacket(e, r) {
                return this.getNextPacket(e, r);
            }
        },
        Fi = (t, e, r) => {
            let i = e,
                n = r;
            e: for (;;) {
                for (n--, n; n >= 0; n--)
                    if (i.lacingValues[n] < 255) {
                        n++;
                        break e;
                    }
                if ((p(n === -1), !(i.headerType & 1))) {
                    n = 0;
                    break;
                }
                let s = ur(t, (o) => o.headerStartPos < i.headerStartPos);
                if (!s) return null;
                (i = s), (n = i.lacingValues.length);
            }
            if ((p(n !== -1), n === i.lacingValues.length)) {
                let a = t[t.indexOf(i) + 1];
                p(a), (i = a), (n = 0);
            }
            return { page: i, segmentIndex: n };
        },
        Bi = (t, e, r) => {
            if (r > 0) return { page: e, segmentIndex: r - 1 };
            let i = ur(t, (n) => n.headerStartPos < e.headerStartPos);
            return i ? { page: i, segmentIndex: i.lacingValues.length - 1 } : null;
        };
    var le;
    (function (t) {
        (t[(t.PCM = 1)] = "PCM"),
            (t[(t.IEEE_FLOAT = 3)] = "IEEE_FLOAT"),
            (t[(t.ALAW = 6)] = "ALAW"),
            (t[(t.MULAW = 7)] = "MULAW"),
            (t[(t.EXTENSIBLE = 65534)] = "EXTENSIBLE");
    })(le || (le = {}));
    var Wt = class extends K {
            constructor(e) {
                super(e),
                    (this.metadataPromise = null),
                    (this.dataStart = -1),
                    (this.dataSize = -1),
                    (this.audioInfo = null),
                    (this.tracks = []),
                    (this.lastKnownPacketIndex = 0),
                    (this.metadataTags = {}),
                    (this.reader = e._reader);
            }
            async readMetadata() {
                return (this.metadataPromise ??= (async () => {
                    let e = this.reader.requestSlice(0, 12);
                    e instanceof Promise && (e = await e), p(e);
                    let r = M(e, 4),
                        i = r !== "RIFX",
                        n = r === "RF64",
                        a = ue(e, i),
                        s = n ? this.reader.fileSize : Math.min(a + 8, this.reader.fileSize ?? 1 / 0);
                    if (M(e, 4) !== "WAVE") throw new Error("Invalid WAVE file - wrong format");
                    let c = 0,
                        l = null,
                        d = e.filePos;
                    for (; s === null || d < s; ) {
                        let f = this.reader.requestSlice(d, 8);
                        if ((f instanceof Promise && (f = await f), !f)) break;
                        let h = M(f, 4),
                            m = ue(f, i),
                            k = f.filePos;
                        if (n && c === 0 && h !== "ds64")
                            throw new Error('Invalid RF64 file: First chunk must be "ds64".');
                        if (h === "fmt ") await this.parseFmtChunk(k, m, i);
                        else if (h === "data") {
                            if (
                                ((l ??= m),
                                (this.dataStart = f.filePos),
                                (this.dataSize = Math.min(l, (s ?? 1 / 0) - this.dataStart)),
                                this.reader.fileSize === null)
                            )
                                break;
                        } else if (h === "ds64") {
                            let b = this.reader.requestSlice(k, m);
                            if ((b instanceof Promise && (b = await b), !b)) break;
                            let x = Rr(b, i);
                            (l = Rr(b, i)), (s = Math.min(x + 8, this.reader.fileSize ?? 1 / 0));
                        } else
                            h === "LIST"
                                ? await this.parseListChunk(k, m, i)
                                : (h === "ID3 " || h === "id3 ") && (await this.parseId3Chunk(k, m));
                        (d = k + m + (m & 1)), c++;
                    }
                    if (!this.audioInfo) throw new Error('Invalid WAVE file - missing "fmt " chunk');
                    if (this.dataStart === -1) throw new Error('Invalid WAVE file - missing "data" chunk');
                    let u = this.audioInfo.blockSizeInBytes;
                    (this.dataSize = Math.floor(this.dataSize / u) * u),
                        this.tracks.push(new W(this.input, new Br(this)));
                })());
            }
            async parseFmtChunk(e, r, i) {
                let n = this.reader.requestSlice(e, r);
                if ((n instanceof Promise && (n = await n), !n)) return;
                let a = Qe(n, i),
                    s = Qe(n, i),
                    o = ue(n, i);
                n.skip(4);
                let c = Qe(n, i),
                    l;
                if ((r === 14 ? (l = 8) : (l = Qe(n, i)), r >= 18 && a !== 357)) {
                    let d = Qe(n, i),
                        u = r - 18;
                    if (Math.min(u, d) >= 22 && a === le.EXTENSIBLE) {
                        n.skip(6);
                        let h = _(n, 16);
                        a = h[0] | (h[1] << 8);
                    }
                }
                (a === le.MULAW || a === le.ALAW) && (l = 8),
                    (this.audioInfo = {
                        format: a,
                        numberOfChannels: s,
                        sampleRate: o,
                        sampleSizeInBytes: Math.ceil(l / 8),
                        blockSizeInBytes: c,
                    });
            }
            async parseListChunk(e, r, i) {
                let n = this.reader.requestSlice(e, r);
                if ((n instanceof Promise && (n = await n), !n)) return;
                let a = M(n, 4);
                if (a !== "INFO" && a !== "INF0") return;
                let s = n.filePos;
                for (; s <= e + r - 8; ) {
                    n.filePos = s;
                    let o = M(n, 4),
                        c = ue(n, i),
                        l = _(n, c),
                        d = 0;
                    for (let f = 0; f < l.length && l[f] !== 0; f++) d++;
                    let u = String.fromCharCode(...l.subarray(0, d));
                    switch (((this.metadataTags.raw ??= {}), (this.metadataTags.raw[o] = u), o)) {
                        case "INAM":
                        case "TITL":
                            this.metadataTags.title ??= u;
                            break;
                        case "TIT3":
                            this.metadataTags.description ??= u;
                            break;
                        case "IART":
                            this.metadataTags.artist ??= u;
                            break;
                        case "IPRD":
                            this.metadataTags.album ??= u;
                            break;
                        case "IPRT":
                        case "ITRK":
                        case "TRCK":
                            {
                                let f = u.split("/"),
                                    h = Number.parseInt(f[0], 10),
                                    m = f[1] && Number.parseInt(f[1], 10);
                                Number.isInteger(h) && h > 0 && (this.metadataTags.trackNumber ??= h),
                                    m && Number.isInteger(m) && m > 0 && (this.metadataTags.tracksTotal ??= m);
                            }
                            break;
                        case "ICRD":
                        case "IDIT":
                            {
                                let f = new Date(u);
                                Number.isNaN(f.getTime()) || (this.metadataTags.date ??= f);
                            }
                            break;
                        case "YEAR":
                            {
                                let f = Number.parseInt(u, 10);
                                Number.isInteger(f) && f > 0 && (this.metadataTags.date ??= new Date(f, 0, 1));
                            }
                            break;
                        case "IGNR":
                        case "GENR":
                            this.metadataTags.genre ??= u;
                            break;
                        case "ICMT":
                        case "CMNT":
                        case "COMM":
                            this.metadataTags.comment ??= u;
                            break;
                    }
                    s += 8 + c + (c & 1);
                }
            }
            async parseId3Chunk(e, r) {
                let i = this.reader.requestSlice(e, r);
                if ((i instanceof Promise && (i = await i), !i)) return;
                let n = Ee(i);
                if (n) {
                    let a = i.slice(e + 10, n.size);
                    Lt(a, n, this.metadataTags);
                }
            }
            getCodec() {
                if ((p(this.audioInfo), this.audioInfo.format === le.MULAW)) return "ulaw";
                if (this.audioInfo.format === le.ALAW) return "alaw";
                if (this.audioInfo.format === le.PCM) {
                    if (this.audioInfo.sampleSizeInBytes === 1) return "pcm-u8";
                    if (this.audioInfo.sampleSizeInBytes === 2) return "pcm-s16";
                    if (this.audioInfo.sampleSizeInBytes === 3) return "pcm-s24";
                    if (this.audioInfo.sampleSizeInBytes === 4) return "pcm-s32";
                }
                return this.audioInfo.format === le.IEEE_FLOAT && this.audioInfo.sampleSizeInBytes === 4
                    ? "pcm-f32"
                    : null;
            }
            async getMimeType() {
                return "audio/wav";
            }
            async computeDuration() {
                await this.readMetadata();
                let e = this.tracks[0];
                return p(e), e.computeDuration();
            }
            async getTracks() {
                return await this.readMetadata(), this.tracks;
            }
            async getMetadataTags() {
                return await this.readMetadata(), this.metadataTags;
            }
        },
        Ge = 2048,
        Br = class {
            constructor(e) {
                this.demuxer = e;
            }
            getId() {
                return 1;
            }
            getCodec() {
                return this.demuxer.getCodec();
            }
            getInternalCodecId() {
                return p(this.demuxer.audioInfo), this.demuxer.audioInfo.format;
            }
            async getDecoderConfig() {
                let e = this.demuxer.getCodec();
                return e
                    ? (p(this.demuxer.audioInfo),
                      {
                          codec: e,
                          numberOfChannels: this.demuxer.audioInfo.numberOfChannels,
                          sampleRate: this.demuxer.audioInfo.sampleRate,
                      })
                    : null;
            }
            async computeDuration() {
                let e = await this.getPacket(1 / 0, { metadataOnly: !0 });
                return (e?.timestamp ?? 0) + (e?.duration ?? 0);
            }
            getNumberOfChannels() {
                return p(this.demuxer.audioInfo), this.demuxer.audioInfo.numberOfChannels;
            }
            getSampleRate() {
                return p(this.demuxer.audioInfo), this.demuxer.audioInfo.sampleRate;
            }
            getTimeResolution() {
                return p(this.demuxer.audioInfo), this.demuxer.audioInfo.sampleRate;
            }
            getName() {
                return null;
            }
            getLanguageCode() {
                return q;
            }
            async getFirstTimestamp() {
                return 0;
            }
            async getPacketAtIndex(e, r) {
                p(this.demuxer.audioInfo);
                let i = e * Ge * this.demuxer.audioInfo.blockSizeInBytes;
                if (i >= this.demuxer.dataSize) return null;
                let n = Math.min(Ge * this.demuxer.audioInfo.blockSizeInBytes, this.demuxer.dataSize - i);
                if (this.demuxer.reader.fileSize === null) {
                    let c = this.demuxer.reader.requestSlice(this.demuxer.dataStart + i, n);
                    if ((c instanceof Promise && (c = await c), !c)) return null;
                }
                let a;
                if (r.metadataOnly) a = V;
                else {
                    let c = this.demuxer.reader.requestSlice(this.demuxer.dataStart + i, n);
                    c instanceof Promise && (c = await c), p(c), (a = _(c, n));
                }
                let s = (e * Ge) / this.demuxer.audioInfo.sampleRate,
                    o = n / this.demuxer.audioInfo.blockSizeInBytes / this.demuxer.audioInfo.sampleRate;
                return (this.demuxer.lastKnownPacketIndex = Math.max(e, s)), new U(a, "key", s, o, e, n);
            }
            getFirstPacket(e) {
                return this.getPacketAtIndex(0, e);
            }
            async getPacket(e, r) {
                p(this.demuxer.audioInfo);
                let i = Math.floor(
                        Math.min(
                            (e * this.demuxer.audioInfo.sampleRate) / Ge,
                            (this.demuxer.dataSize - 1) / (Ge * this.demuxer.audioInfo.blockSizeInBytes)
                        )
                    ),
                    n = await this.getPacketAtIndex(i, r);
                if (n) return n;
                if (i === 0) return null;
                p(this.demuxer.reader.fileSize === null);
                let a = await this.getPacketAtIndex(this.demuxer.lastKnownPacketIndex, r);
                for (; a; ) {
                    let s = await this.getNextPacket(a, r);
                    if (!s) break;
                    a = s;
                }
                return a;
            }
            getNextPacket(e, r) {
                p(this.demuxer.audioInfo);
                let i = Math.round((e.timestamp * this.demuxer.audioInfo.sampleRate) / Ge);
                return this.getPacketAtIndex(i + 1, r);
            }
            getKeyPacket(e, r) {
                return this.getPacket(e, r);
            }
            getNextKeyPacket(e, r) {
                return this.getNextPacket(e, r);
            }
        };
    var $e = 7,
        Xe = 9,
        ct = (t) => {
            let e = t.filePos,
                r = _(t, 9),
                i = new N(r);
            if (i.readBits(12) !== 4095 || (i.skipBits(1), i.readBits(2) !== 0)) return null;
            let s = i.readBits(1),
                o = i.readBits(2) + 1,
                c = i.readBits(4);
            if (c === 15) return null;
            i.skipBits(1);
            let l = i.readBits(3);
            if (l === 0) throw new Error("ADTS frames with channel configuration 0 are not supported.");
            i.skipBits(1), i.skipBits(1), i.skipBits(1), i.skipBits(1);
            let d = i.readBits(13);
            i.skipBits(11);
            let u = i.readBits(2) + 1;
            if (u !== 1) throw new Error("ADTS frames with more than one AAC frame are not supported.");
            let f = null;
            return (
                s === 1 ? (t.filePos -= 2) : (f = i.readBits(16)),
                {
                    objectType: o,
                    samplingFrequencyIndex: c,
                    channelConfiguration: l,
                    frameLength: d,
                    numberOfAacFrames: u,
                    crcCheck: f,
                    startPos: e,
                }
            );
        };
    var zr = 1024,
        jt = class extends K {
            constructor(e) {
                super(e),
                    (this.metadataPromise = null),
                    (this.firstFrameHeader = null),
                    (this.loadedSamples = []),
                    (this.tracks = []),
                    (this.readingMutex = new ne()),
                    (this.lastSampleLoaded = !1),
                    (this.lastLoadedPos = 0),
                    (this.nextTimestampInSamples = 0),
                    (this.reader = e._reader);
            }
            async readMetadata() {
                return (this.metadataPromise ??= (async () => {
                    for (; !this.firstFrameHeader && !this.lastSampleLoaded; ) await this.advanceReader();
                    p(this.firstFrameHeader), (this.tracks = [new W(this.input, new Nr(this))]);
                })());
            }
            async advanceReader() {
                let e = this.reader.requestSliceRange(this.lastLoadedPos, $e, Xe);
                if ((e instanceof Promise && (e = await e), !e)) {
                    this.lastSampleLoaded = !0;
                    return;
                }
                let r = ct(e);
                if (!r) {
                    this.lastSampleLoaded = !0;
                    return;
                }
                if (this.reader.fileSize !== null && r.startPos + r.frameLength > this.reader.fileSize) {
                    this.lastSampleLoaded = !0;
                    return;
                }
                this.firstFrameHeader || (this.firstFrameHeader = r);
                let i = et[r.samplingFrequencyIndex];
                p(i !== void 0);
                let n = zr / i,
                    a = r.crcCheck ? Xe : $e,
                    s = {
                        timestamp: this.nextTimestampInSamples / i,
                        duration: n,
                        dataStart: r.startPos + a,
                        dataSize: r.frameLength - a,
                    };
                this.loadedSamples.push(s),
                    (this.nextTimestampInSamples += zr),
                    (this.lastLoadedPos = r.startPos + r.frameLength);
            }
            async getMimeType() {
                return "audio/aac";
            }
            async getTracks() {
                return await this.readMetadata(), this.tracks;
            }
            async computeDuration() {
                await this.readMetadata();
                let e = this.tracks[0];
                return p(e), e.computeDuration();
            }
            async getMetadataTags() {
                return {};
            }
        },
        Nr = class {
            constructor(e) {
                this.demuxer = e;
            }
            getId() {
                return 1;
            }
            async getFirstTimestamp() {
                return 0;
            }
            getTimeResolution() {
                return this.getSampleRate() / zr;
            }
            async computeDuration() {
                let e = await this.getPacket(1 / 0, { metadataOnly: !0 });
                return (e?.timestamp ?? 0) + (e?.duration ?? 0);
            }
            getName() {
                return null;
            }
            getLanguageCode() {
                return q;
            }
            getCodec() {
                return "aac";
            }
            getInternalCodecId() {
                return p(this.demuxer.firstFrameHeader), this.demuxer.firstFrameHeader.objectType;
            }
            getNumberOfChannels() {
                p(this.demuxer.firstFrameHeader);
                let e = pr[this.demuxer.firstFrameHeader.channelConfiguration];
                return p(e !== void 0), e;
            }
            getSampleRate() {
                p(this.demuxer.firstFrameHeader);
                let e = et[this.demuxer.firstFrameHeader.samplingFrequencyIndex];
                return p(e !== void 0), e;
            }
            async getDecoderConfig() {
                p(this.demuxer.firstFrameHeader);
                let e = new Uint8Array(3),
                    r = new N(e),
                    {
                        objectType: i,
                        samplingFrequencyIndex: n,
                        channelConfiguration: a,
                    } = this.demuxer.firstFrameHeader;
                return (
                    i > 31 ? (r.writeBits(5, 31), r.writeBits(6, i - 32)) : r.writeBits(5, i),
                    r.writeBits(4, n),
                    r.writeBits(4, a),
                    {
                        codec: `mp4a.40.${this.demuxer.firstFrameHeader.objectType}`,
                        numberOfChannels: this.getNumberOfChannels(),
                        sampleRate: this.getSampleRate(),
                        description: e.subarray(0, Math.ceil((r.pos - 1) / 8)),
                    }
                );
            }
            async getPacketAtIndex(e, r) {
                if (e === -1) return null;
                let i = this.demuxer.loadedSamples[e];
                if (!i) return null;
                let n;
                if (r.metadataOnly) n = V;
                else {
                    let a = this.demuxer.reader.requestSlice(i.dataStart, i.dataSize);
                    if ((a instanceof Promise && (a = await a), !a)) return null;
                    n = _(a, i.dataSize);
                }
                return new U(n, "key", i.timestamp, i.duration, e, i.dataSize);
            }
            getFirstPacket(e) {
                return this.getPacketAtIndex(0, e);
            }
            async getNextPacket(e, r) {
                let i = await this.demuxer.readingMutex.acquire();
                try {
                    let n = Fe(this.demuxer.loadedSamples, e.timestamp, (s) => s.timestamp);
                    if (n === -1) throw new Error("Packet was not created from this track.");
                    let a = n + 1;
                    for (; a >= this.demuxer.loadedSamples.length && !this.demuxer.lastSampleLoaded; )
                        await this.demuxer.advanceReader();
                    return this.getPacketAtIndex(a, r);
                } finally {
                    i();
                }
            }
            async getPacket(e, r) {
                let i = await this.demuxer.readingMutex.acquire();
                try {
                    for (;;) {
                        let n = F(this.demuxer.loadedSamples, e, (a) => a.timestamp);
                        if (n === -1 && this.demuxer.loadedSamples.length > 0) return null;
                        if (this.demuxer.lastSampleLoaded) return this.getPacketAtIndex(n, r);
                        if (n >= 0 && n + 1 < this.demuxer.loadedSamples.length) return this.getPacketAtIndex(n, r);
                        await this.demuxer.advanceReader();
                    }
                } finally {
                    i();
                }
            }
            getKeyPacket(e, r) {
                return this.getPacket(e, r);
            }
            getNextKeyPacket(e, r) {
                return this.getNextPacket(e, r);
            }
        };
    var Ri = (t) =>
            t === 0
                ? null
                : t === 1
                  ? 192
                  : t >= 2 && t <= 5
                    ? 144 * 2 ** t
                    : t === 6
                      ? "uncommon-u8"
                      : t === 7
                        ? "uncommon-u16"
                        : t >= 8 && t <= 15
                          ? 2 ** t
                          : null,
        zi = (t, e) => {
            switch (t) {
                case 0:
                    return e;
                case 1:
                    return 88200;
                case 2:
                    return 176400;
                case 3:
                    return 192e3;
                case 4:
                    return 8e3;
                case 5:
                    return 16e3;
                case 6:
                    return 22050;
                case 7:
                    return 24e3;
                case 8:
                    return 32e3;
                case 9:
                    return 44100;
                case 10:
                    return 48e3;
                case 11:
                    return 96e3;
                case 12:
                    return "uncommon-u8";
                case 13:
                    return "uncommon-u16";
                case 14:
                    return "uncommon-u16-10";
                default:
                    return null;
            }
        },
        Ni = (t) => {
            let e = 0,
                r = new N(_(t, 1));
            for (; r.readBits(1) === 1; ) e++;
            if (e === 0) return r.readBits(7);
            let i = [],
                n = e - 1,
                a = new N(_(t, n)),
                s = 8 - e - 1;
            for (let c = 0; c < s; c++) i.unshift(r.readBits(1));
            for (let c = 0; c < n; c++)
                for (let l = 0; l < 8; l++) {
                    let d = a.readBits(1);
                    l < 2 || i.unshift(d);
                }
            return i.reduce((c, l, d) => c | (l << d), 0);
        },
        Ui = (t, e) => {
            if (e === "uncommon-u16") return L(t) + 1;
            if (e === "uncommon-u8") return P(t) + 1;
            if (typeof e == "number") return e;
            de(e), p(!1);
        },
        Oi = (t, e) =>
            e === "uncommon-u16"
                ? L(t)
                : e === "uncommon-u16-10"
                  ? L(t) * 10
                  : e === "uncommon-u8"
                    ? P(t)
                    : typeof e == "number"
                      ? e
                      : null,
        Mi = (t) => {
            let r = 0;
            for (let i of t) {
                r ^= i;
                for (let n = 0; n < 8; n++) (r & 128) !== 0 ? (r = (r << 1) ^ 7) : (r <<= 1), (r &= 255);
            }
            return r;
        };
    var Kt = class extends K {
            constructor(e) {
                super(e),
                    (this.loadedSamples = []),
                    (this.metadataPromise = null),
                    (this.track = null),
                    (this.metadataTags = {}),
                    (this.audioInfo = null),
                    (this.lastLoadedPos = null),
                    (this.blockingBit = null),
                    (this.readingMutex = new ne()),
                    (this.lastSampleLoaded = !1),
                    (this.reader = e._reader);
            }
            async computeDuration() {
                return await this.readMetadata(), p(this.track), this.track.computeDuration();
            }
            async getMetadataTags() {
                return await this.readMetadata(), this.metadataTags;
            }
            async getTracks() {
                return await this.readMetadata(), p(this.track), [this.track];
            }
            async getMimeType() {
                return "audio/flac";
            }
            async readMetadata() {
                let e = 4;
                return (this.metadataPromise ??= (async () => {
                    for (; this.reader.fileSize === null || e < this.reader.fileSize; ) {
                        let r = this.reader.requestSlice(e, 4);
                        if ((r instanceof Promise && (r = await r), (e += 4), r === null))
                            throw new Error(`Metadata block at position ${e} is too small! Corrupted file.`);
                        p(r);
                        let i = P(r),
                            n = ge(r),
                            a = (i & 128) !== 0;
                        switch (i & 127) {
                            case he.STREAMINFO: {
                                let o = this.reader.requestSlice(e, n);
                                if ((o instanceof Promise && (o = await o), p(o), o === null))
                                    throw new Error(`StreamInfo block at position ${e} is too small! Corrupted file.`);
                                let c = _(o, 34),
                                    l = new N(c),
                                    d = l.readBits(16),
                                    u = l.readBits(16),
                                    f = l.readBits(24),
                                    h = l.readBits(24),
                                    m = l.readBits(20),
                                    k = l.readBits(3) + 1;
                                l.readBits(5);
                                let b = l.readBits(36);
                                l.skipBits(128);
                                let x = new Uint8Array(42);
                                x.set(new Uint8Array([102, 76, 97, 67]), 0),
                                    x.set(new Uint8Array([128, 0, 0, 34]), 4),
                                    x.set(c, 8),
                                    (this.audioInfo = {
                                        numberOfChannels: k,
                                        sampleRate: m,
                                        totalSamples: b,
                                        minimumBlockSize: d,
                                        maximumBlockSize: u,
                                        minimumFrameSize: f,
                                        maximumFrameSize: h,
                                        description: x,
                                    }),
                                    (this.track = new W(this.input, new Ur(this)));
                                break;
                            }
                            case he.VORBIS_COMMENT: {
                                let o = this.reader.requestSlice(e, n);
                                o instanceof Promise && (o = await o), p(o), rt(_(o, n), this.metadataTags);
                                break;
                            }
                            case he.PICTURE: {
                                let o = this.reader.requestSlice(e, n);
                                o instanceof Promise && (o = await o), p(o);
                                let c = y(o),
                                    l = y(o),
                                    d = H.decode(_(o, l)),
                                    u = y(o),
                                    f = H.decode(_(o, u));
                                o.skip(16);
                                let h = y(o),
                                    m = _(o, h);
                                (this.metadataTags.images ??= []),
                                    this.metadataTags.images.push({
                                        data: m,
                                        mimeType: d,
                                        kind: c === 3 ? "coverFront" : c === 4 ? "coverBack" : "unknown",
                                        description: f,
                                    });
                                break;
                            }
                            default:
                                break;
                        }
                        if (((e += n), a)) {
                            this.lastLoadedPos = e;
                            break;
                        }
                    }
                })());
            }
            async readNextFlacFrame({ startPos: e, isFirstPacket: r }) {
                p(this.audioInfo);
                let i = 6,
                    a = this.audioInfo.maximumFrameSize + 16,
                    s = await this.reader.requestSliceRange(e, this.audioInfo.minimumFrameSize, a);
                if (!s) return null;
                let o = this.readFlacFrameHeader({ slice: s, isFirstPacket: r });
                if (!o) return null;
                for (s.filePos = e + this.audioInfo.minimumFrameSize; ; ) {
                    if (s.filePos > s.end - i)
                        return {
                            num: o.num,
                            blockSize: o.blockSize,
                            sampleRate: o.sampleRate,
                            size: s.end - e,
                            isLastFrame: !0,
                        };
                    if (P(s) === 255) {
                        let l = P(s),
                            d = this.blockingBit === 1 ? 249 : 248;
                        if (l !== d) {
                            s.skip(-1);
                            continue;
                        }
                        s.skip(-2);
                        let u = s.filePos - e;
                        if (!this.readFlacFrameHeader({ slice: s, isFirstPacket: !1 })) {
                            s.skip(-1);
                            continue;
                        }
                        return {
                            num: o.num,
                            blockSize: o.blockSize,
                            sampleRate: o.sampleRate,
                            size: u,
                            isLastFrame: !1,
                        };
                    }
                }
            }
            readFlacFrameHeader({ slice: e, isFirstPacket: r }) {
                let i = e.filePos,
                    n = _(e, 4),
                    a = new N(n);
                if (a.readBits(15) !== 32764) return null;
                if (this.blockingBit === null) {
                    p(r);
                    let b = a.readBits(1);
                    this.blockingBit = b;
                } else if (this.blockingBit === 1) {
                    if ((p(!r), a.readBits(1) !== 1)) return null;
                } else if (this.blockingBit === 0) {
                    if ((p(!r), a.readBits(1) !== 0)) return null;
                } else throw new Error("Invalid blocking bit");
                let o = Ri(a.readBits(4));
                if (!o) return null;
                p(this.audioInfo);
                let c = zi(a.readBits(4), this.audioInfo.sampleRate);
                if (!c || (a.readBits(4), a.readBits(3), a.readBits(1) !== 0)) return null;
                let d = Ni(e),
                    u = Ui(e, o),
                    f = Oi(e, c);
                if (f === null) return null;
                let h = e.filePos - i,
                    m = P(e);
                e.skip(-h), e.skip(-1);
                let k = Mi(_(e, h));
                return m !== k ? null : { num: d, blockSize: u, sampleRate: f };
            }
            async advanceReader() {
                await this.readMetadata(), p(this.lastLoadedPos !== null), p(this.audioInfo);
                let e = this.lastLoadedPos,
                    r = await this.readNextFlacFrame({ startPos: e, isFirstPacket: this.loadedSamples.length === 0 });
                if (!r) {
                    this.lastSampleLoaded = !0;
                    return;
                }
                let i = this.loadedSamples[this.loadedSamples.length - 1],
                    a = {
                        blockOffset: i ? i.blockOffset + i.blockSize : 0,
                        blockSize: r.blockSize,
                        byteOffset: e,
                        byteSize: r.size,
                    };
                if (((this.lastLoadedPos = this.lastLoadedPos + r.size), this.loadedSamples.push(a), r.isLastFrame)) {
                    this.lastSampleLoaded = !0;
                    return;
                }
            }
        },
        Ur = class {
            constructor(e) {
                this.demuxer = e;
            }
            getId() {
                return 1;
            }
            getCodec() {
                return "flac";
            }
            getInternalCodecId() {
                return null;
            }
            getNumberOfChannels() {
                return p(this.demuxer.audioInfo), this.demuxer.audioInfo.numberOfChannels;
            }
            async computeDuration() {
                let e = await this.getPacket(1 / 0, { metadataOnly: !0 });
                return (e?.timestamp ?? 0) + (e?.duration ?? 0);
            }
            getSampleRate() {
                return p(this.demuxer.audioInfo), this.demuxer.audioInfo.sampleRate;
            }
            getName() {
                return null;
            }
            getLanguageCode() {
                return q;
            }
            getTimeResolution() {
                return p(this.demuxer.audioInfo), this.demuxer.audioInfo.sampleRate;
            }
            async getFirstTimestamp() {
                return 0;
            }
            async getDecoderConfig() {
                return (
                    p(this.demuxer.audioInfo),
                    {
                        codec: "flac",
                        numberOfChannels: this.demuxer.audioInfo.numberOfChannels,
                        sampleRate: this.demuxer.audioInfo.sampleRate,
                        description: this.demuxer.audioInfo.description,
                    }
                );
            }
            async getPacket(e, r) {
                if ((p(this.demuxer.audioInfo), e < 0)) throw new Error("Timestamp cannot be negative");
                let i = await this.demuxer.readingMutex.acquire();
                try {
                    for (;;) {
                        let n = F(
                            this.demuxer.loadedSamples,
                            e,
                            (c) => c.blockOffset / this.demuxer.audioInfo.sampleRate
                        );
                        if (n === -1) {
                            await this.demuxer.advanceReader();
                            continue;
                        }
                        let a = this.demuxer.loadedSamples[n],
                            s = a.blockOffset / this.demuxer.audioInfo.sampleRate,
                            o = a.blockSize / this.demuxer.audioInfo.sampleRate;
                        if (s + o <= e) {
                            if (this.demuxer.lastSampleLoaded)
                                return this.getPacketAtIndex(this.demuxer.loadedSamples.length - 1, r);
                            await this.demuxer.advanceReader();
                            continue;
                        }
                        return this.getPacketAtIndex(n, r);
                    }
                } finally {
                    i();
                }
            }
            async getNextPacket(e, r) {
                let i = await this.demuxer.readingMutex.acquire();
                try {
                    let n = e.sequenceNumber + 1;
                    if (this.demuxer.lastSampleLoaded && n >= this.demuxer.loadedSamples.length) return null;
                    for (; n >= this.demuxer.loadedSamples.length && !this.demuxer.lastSampleLoaded; )
                        await this.demuxer.advanceReader();
                    return this.getPacketAtIndex(n, r);
                } finally {
                    i();
                }
            }
            getKeyPacket(e, r) {
                return this.getPacket(e, r);
            }
            getNextKeyPacket(e, r) {
                return this.getNextPacket(e, r);
            }
            async getPacketAtIndex(e, r) {
                let i = this.demuxer.loadedSamples[e];
                if (!i) return null;
                let n;
                if (r.metadataOnly) n = V;
                else {
                    let o = this.demuxer.reader.requestSlice(i.byteOffset, i.byteSize);
                    if ((o instanceof Promise && (o = await o), !o)) return null;
                    n = _(o, i.byteSize);
                }
                p(this.demuxer.audioInfo);
                let a = i.blockOffset / this.demuxer.audioInfo.sampleRate,
                    s = i.blockSize / this.demuxer.audioInfo.sampleRate;
                return new U(n, "key", a, s, e, i.byteSize);
            }
            async getFirstPacket(e) {
                for (; this.demuxer.loadedSamples.length === 0 && !this.demuxer.lastSampleLoaded; )
                    await this.demuxer.advanceReader();
                return this.getPacketAtIndex(0, e);
            }
        };
    var Y = class {},
        lt = class extends Y {
            async _getMajorBrand(e) {
                let r = e._reader.requestSlice(0, 12);
                return r instanceof Promise && (r = await r), !r || (r.skip(4), M(r, 4) !== "ftyp") ? null : M(r, 4);
            }
            _createDemuxer(e) {
                return new Dt(e);
            }
        },
        Gt = class extends lt {
            async _canReadInput(e) {
                let r = await this._getMajorBrand(e);
                return !!r && r !== "qt  ";
            }
            get name() {
                return "MP4";
            }
            get mimeType() {
                return "video/mp4";
            }
        },
        Qt = class extends lt {
            async _canReadInput(e) {
                return (await this._getMajorBrand(e)) === "qt  ";
            }
            get name() {
                return "QuickTime File Format";
            }
            get mimeType() {
                return "video/quicktime";
            }
        },
        ut = class extends Y {
            async isSupportedEBMLOfDocType(e, r) {
                let i = e._reader.requestSlice(0, te);
                if ((i instanceof Promise && (i = await i), !i)) return !1;
                let n = yr(i);
                if (n === null || n < 1 || n > 8 || D(i, n) !== S.EBML) return !1;
                let s = Pr(i);
                if (s === null) return !1;
                let o = e._reader.requestSlice(i.filePos, s);
                if ((o instanceof Promise && (o = await o), !o)) return !1;
                let c = i.filePos;
                for (; o.filePos <= c + s - X; ) {
                    let l = re(o);
                    if (!l) break;
                    let { id: d, size: u } = l,
                        f = o.filePos;
                    if (u === null) return !1;
                    switch (d) {
                        case S.EBMLVersion:
                            if (D(o, u) !== 1) return !1;
                            break;
                        case S.EBMLReadVersion:
                            if (D(o, u) !== 1) return !1;
                            break;
                        case S.DocType:
                            if (ke(o, u) !== r) return !1;
                            break;
                        case S.DocTypeVersion:
                            if (D(o, u) > 4) return !1;
                            break;
                    }
                    o.filePos = f + u;
                }
                return !0;
            }
            _canReadInput(e) {
                return this.isSupportedEBMLOfDocType(e, "matroska");
            }
            _createDemuxer(e) {
                return new Ot(e);
            }
            get name() {
                return "Matroska";
            }
            get mimeType() {
                return "video/x-matroska";
            }
        },
        $t = class extends ut {
            _canReadInput(e) {
                return this.isSupportedEBMLOfDocType(e, "webm");
            }
            get name() {
                return "WebM";
            }
            get mimeType() {
                return "video/webm";
            }
        },
        Xt = class extends Y {
            async _canReadInput(e) {
                let r = e._reader.requestSlice(0, 10);
                if ((r instanceof Promise && (r = await r), !r)) return !1;
                let i = 0,
                    n = !1;
                for (;;) {
                    let l = e._reader.requestSlice(i, je);
                    if ((l instanceof Promise && (l = await l), !l)) break;
                    let d = Ee(l);
                    if (!d) break;
                    (n = !0), (i = l.filePos + d.size);
                }
                let a = await ot(e._reader, i, i + 4096);
                if (!a) return !1;
                if (n) return !0;
                i = a.startPos + a.header.totalSize;
                let s = await ot(e._reader, i, i + 4);
                if (!s) return !1;
                let o = a.header,
                    c = s.header;
                return !(o.channel !== c.channel || o.sampleRate !== c.sampleRate);
            }
            _createDemuxer(e) {
                return new Ht(e);
            }
            get name() {
                return "MP3";
            }
            get mimeType() {
                return "audio/mpeg";
            }
        },
        Zt = class extends Y {
            async _canReadInput(e) {
                let r = e._reader.requestSlice(0, 12);
                if ((r instanceof Promise && (r = await r), !r)) return !1;
                let i = M(r, 4);
                return i !== "RIFF" && i !== "RIFX" && i !== "RF64" ? !1 : (r.skip(4), M(r, 4) === "WAVE");
            }
            _createDemuxer(e) {
                return new Wt(e);
            }
            get name() {
                return "WAVE";
            }
            get mimeType() {
                return "audio/wav";
            }
        },
        Yt = class extends Y {
            async _canReadInput(e) {
                let r = e._reader.requestSlice(0, 4);
                return r instanceof Promise && (r = await r), r ? M(r, 4) === "OggS" : !1;
            }
            _createDemuxer(e) {
                return new qt(e);
            }
            get name() {
                return "Ogg";
            }
            get mimeType() {
                return "application/ogg";
            }
        },
        Jt = class extends Y {
            async _canReadInput(e) {
                let r = e._reader.requestSlice(0, 4);
                return r instanceof Promise && (r = await r), r ? M(r, 4) === "fLaC" : !1;
            }
            get name() {
                return "FLAC";
            }
            get mimeType() {
                return "audio/flac";
            }
            _createDemuxer(e) {
                return new Kt(e);
            }
        },
        er = class extends Y {
            async _canReadInput(e) {
                let r = e._reader.requestSliceRange(0, $e, Xe);
                if ((r instanceof Promise && (r = await r), !r)) return !1;
                let i = ct(r);
                if (
                    !i ||
                    ((r = e._reader.requestSliceRange(i.frameLength, $e, Xe)),
                    r instanceof Promise && (r = await r),
                    !r)
                )
                    return !1;
                let n = ct(r);
                return n
                    ? i.objectType === n.objectType &&
                          i.samplingFrequencyIndex === n.samplingFrequencyIndex &&
                          i.channelConfiguration === n.channelConfiguration
                    : !1;
            }
            _createDemuxer(e) {
                return new jt(e);
            }
            get name() {
                return "ADTS";
            }
            get mimeType() {
                return "audio/aac";
            }
        },
        Vi = new Gt(),
        Li = new Qt(),
        Hi = new ut(),
        qi = new $t(),
        Wi = new Xt(),
        ji = new Zt(),
        Ki = new Yt(),
        Gi = new er(),
        Qi = new Jt(),
        Or = [Vi, Li, Hi, qi, ji, Ki, Qi, Wi, Gi];
    var Ze = class {
        constructor() {
            (this._disposed = !1), (this._sizePromise = null), (this.onread = null);
        }
        async getSizeOrNull() {
            if (this._disposed) throw new j();
            return (this._sizePromise ??= Promise.resolve(this._retrieveSize()));
        }
        async getSize() {
            if (this._disposed) throw new j();
            let e = await this.getSizeOrNull();
            if (e === null) throw new Error("Cannot determine the size of an unsized source.");
            return e;
        }
    };
    var $i = 0.5 * 2 ** 20,
        In = (t, e, r) => {
            if (
                e instanceof Error &&
                (e.message.includes("Failed to fetch") ||
                    e.message.includes("Load failed") ||
                    e.message.includes("NetworkError when attempting to fetch resource"))
            ) {
                let n = null;
                try {
                    typeof window < "u" &&
                        typeof window.location < "u" &&
                        (n = new URL(r instanceof Request ? r.url : r, window.location.href).origin);
                } catch {}
                if (
                    (typeof navigator < "u" && typeof navigator.onLine == "boolean" ? navigator.onLine : !0) &&
                    n !== null &&
                    n !== window.location.origin
                )
                    return null;
            }
            return Math.min(2 ** (t - 2), 16);
        },
        dt = class extends Ze {
            constructor(e, r = {}) {
                if (typeof e != "string" && !(e instanceof URL) && !(typeof Request < "u" && e instanceof Request))
                    throw new TypeError("url must be a string, URL or Request.");
                if (!r || typeof r != "object") throw new TypeError("options must be an object.");
                if (r.requestInit !== void 0 && (!r.requestInit || typeof r.requestInit != "object"))
                    throw new TypeError("options.requestInit, when provided, must be an object.");
                if (r.getRetryDelay !== void 0 && typeof r.getRetryDelay != "function")
                    throw new TypeError("options.getRetryDelay, when provided, must be a function.");
                if (r.maxCacheSize !== void 0 && (!Tt(r.maxCacheSize) || r.maxCacheSize < 0))
                    throw new TypeError("options.maxCacheSize, when provided, must be a non-negative number.");
                if (r.fetchFn !== void 0 && typeof r.fetchFn != "function")
                    throw new TypeError("options.fetchFn, when provided, must be a function.");
                super(),
                    (this._existingResponses = new WeakMap()),
                    (this._url = e),
                    (this._options = r),
                    (this._getRetryDelay = r.getRetryDelay ?? In),
                    (this._orchestrator = new Mr({
                        maxCacheSize: r.maxCacheSize ?? 64 * 2 ** 20,
                        maxWorkerCount: 2,
                        runWorker: this._runWorker.bind(this),
                        prefetchProfile: _n.network,
                    }));
            }
            async _retrieveSize() {
                let e = new AbortController(),
                    r = await mr(
                        this._options.fetchFn ?? fetch,
                        this._url,
                        hr(this._options.requestInit ?? {}, { headers: { Range: "bytes=0-" }, signal: e.signal }),
                        this._getRetryDelay
                    );
                if (!r.ok) throw new Error(`Error fetching ${String(this._url)}: ${r.status} ${r.statusText}`);
                let i, n;
                if (r.status === 206)
                    (n = this._getPartialLengthFromRangeResponse(r)),
                        (i = this._orchestrator.createWorker(0, Math.min(n, $i)));
                else {
                    let a = r.headers.get("Content-Length");
                    if (a)
                        (n = Number(a)),
                            (i = this._orchestrator.createWorker(0, n)),
                            (this._orchestrator.options.maxCacheSize = 1 / 0),
                            console.warn(
                                "HTTP server did not respond with 206 Partial Content, meaning the entire remote resource now has to be downloaded. For efficient media file streaming across a network, please make sure your server supports range requests."
                            );
                    else throw new Error(`HTTP response (status ${r.status}) must surface Content-Length header.`);
                }
                return (
                    (this._orchestrator.fileSize = n),
                    this._existingResponses.set(i, { response: r, abortController: e }),
                    this._orchestrator.runWorker(i),
                    n
                );
            }
            _read(e, r) {
                return this._orchestrator.read(e, r);
            }
            async _runWorker(e) {
                for (; !e.aborted; ) {
                    let r = this._existingResponses.get(e);
                    this._existingResponses.delete(e);
                    let i = r?.abortController,
                        n = r?.response;
                    if (
                        (i ||
                            ((i = new AbortController()),
                            (n = await mr(
                                this._options.fetchFn ?? fetch,
                                this._url,
                                hr(this._options.requestInit ?? {}, {
                                    headers: { Range: `bytes=${e.currentPos}-` },
                                    signal: i.signal,
                                }),
                                this._getRetryDelay
                            ))),
                        p(n),
                        !n.ok)
                    )
                        throw new Error(`Error fetching ${String(this._url)}: ${n.status} ${n.statusText}`);
                    if (e.currentPos > 0 && n.status !== 206)
                        throw new Error(
                            "HTTP server did not respond with 206 Partial Content to a range request. To enable efficient media file streaming across a network, please make sure your server supports range requests."
                        );
                    let a = this._getPartialLengthFromRangeResponse(n),
                        s = e.targetPos - e.currentPos;
                    if (a < s)
                        throw new Error(
                            `HTTP response unexpectedly too short: Needed at least ${s} bytes, got only ${a}.`
                        );
                    if (!n.body)
                        throw new Error(
                            "Missing HTTP response body stream. The used fetch function must provide the response body as a ReadableStream."
                        );
                    let o = n.body.getReader();
                    for (;;) {
                        if (e.currentPos >= e.targetPos || e.aborted) {
                            i.abort(), (e.running = !1);
                            return;
                        }
                        let c;
                        try {
                            c = await o.read();
                        } catch (u) {
                            let f = this._getRetryDelay(1, u, this._url);
                            if (f !== null) {
                                console.error("Error while reading response stream. Attempting to resume.", u),
                                    await new Promise((h) => setTimeout(h, 1e3 * f));
                                break;
                            } else throw u;
                        }
                        let { done: l, value: d } = c;
                        if (l) {
                            if ((this._orchestrator.forgetWorker(e), e.currentPos < e.targetPos))
                                throw new Error(
                                    "Response stream reader stopped unexpectedly before all requested data was read."
                                );
                            e.running = !1;
                            return;
                        }
                        this.onread?.(e.currentPos, e.currentPos + d.length), this._orchestrator.supplyWorkerData(e, d);
                    }
                }
                e.running = !1;
            }
            _getPartialLengthFromRangeResponse(e) {
                let r = e.headers.get("Content-Range");
                if (r) {
                    let i = /\/(\d+)/.exec(r);
                    if (i) return Number(i[1]);
                    throw new Error(`Invalid Content-Range header: ${r}`);
                } else {
                    let i = e.headers.get("Content-Length");
                    if (i) return Number(i);
                    throw new Error(
                        "Partial HTTP response (status 206) must surface either Content-Range or Content-Length header."
                    );
                }
            }
            _dispose() {
                this._orchestrator.dispose();
            }
        };
    var _n = {
            none: (t, e) => ({ start: t, end: e }),
            fileSystem: (t, e) => (
                (t = Math.floor((t - 65536) / 65536) * 65536),
                (e = Math.ceil((e + 65536) / 65536) * 65536),
                { start: t, end: e }
            ),
            network: (t, e, r) => {
                t = Math.max(0, Math.floor((t - 65536) / 65536) * 65536);
                for (let n of r) {
                    let s = Math.max((n.startPos + n.targetPos) / 2, n.targetPos - 8388608);
                    if (xt(t, e, s, n.targetPos)) {
                        let o = n.targetPos - n.startPos,
                            c = Math.ceil((o + 1) / 8388608) * 8388608,
                            l = 2 ** Math.ceil(Math.log2(o + 1)),
                            d = Math.min(l, c);
                        e = Math.max(e, n.startPos + d);
                    }
                }
                return (e = Math.max(e, t + $i)), { start: t, end: e };
            },
        },
        Mr = class {
            constructor(e) {
                (this.options = e),
                    (this.fileSize = null),
                    (this.nextAge = 0),
                    (this.workers = []),
                    (this.cache = []),
                    (this.currentCacheSize = 0),
                    (this.disposed = !1);
            }
            read(e, r) {
                p(this.fileSize !== null);
                let i = this.options.prefetchProfile(e, r, this.workers),
                    n = Math.max(i.start, 0),
                    a = Math.min(i.end, this.fileSize);
                p(n <= e && r <= a);
                let s = null,
                    o = F(this.cache, e, (g) => g.start),
                    c = o !== -1 ? this.cache[o] : null;
                c &&
                    c.start <= e &&
                    r <= c.end &&
                    ((c.age = this.nextAge++), (s = { bytes: c.bytes, view: c.view, offset: c.start }));
                let l = F(this.cache, n, (g) => g.start),
                    d = s ? null : new Uint8Array(r - e),
                    u = 0,
                    f = n,
                    h = [];
                if (l !== -1) {
                    for (let g = l; g < this.cache.length; g++) {
                        let w = this.cache[g];
                        if (w.start >= a) break;
                        if (w.end <= n) continue;
                        let T = Math.max(n, w.start),
                            I = Math.min(a, w.end);
                        if ((p(T <= I), f < T && h.push({ start: f, end: T }), (f = I), d)) {
                            let E = Math.max(e, w.start),
                                A = Math.min(r, w.end);
                            if (E < A) {
                                let v = E - e;
                                d.set(w.bytes.subarray(E - w.start, A - w.start), v), v === u && (u = A - e);
                            }
                        }
                        w.age = this.nextAge++;
                    }
                    f < a && h.push({ start: f, end: a });
                } else h.push({ start: n, end: a });
                if ((d && u >= d.length && (s = { bytes: d, view: O(d), offset: e }), h.length === 0)) return p(s), s;
                let { promise: m, resolve: k, reject: b } = xe(),
                    x = [];
                for (let g of h) {
                    let w = Math.max(e, g.start),
                        T = Math.min(r, g.end);
                    w === g.start && T === g.end ? x.push(g) : w < T && x.push({ start: w, end: T });
                }
                for (let g of h) {
                    let w = d && { start: e, bytes: d, holes: x, resolve: k, reject: b },
                        T = !1;
                    for (let I of this.workers)
                        if (xt(g.start - 131072, g.start, I.currentPos, I.targetPos)) {
                            (I.targetPos = Math.max(I.targetPos, g.end)),
                                (T = !0),
                                w && !I.pendingSlices.includes(w) && I.pendingSlices.push(w),
                                I.running || this.runWorker(I);
                            break;
                        }
                    if (!T) {
                        let I = this.createWorker(g.start, g.end);
                        w && (I.pendingSlices = [w]), this.runWorker(I);
                    }
                }
                return s || (p(d), (s = m.then((g) => ({ bytes: g, view: O(g), offset: e })))), s;
            }
            createWorker(e, r) {
                let i = {
                    startPos: e,
                    currentPos: e,
                    targetPos: r,
                    running: !1,
                    aborted: !1,
                    pendingSlices: [],
                    age: this.nextAge++,
                };
                for (this.workers.push(i); this.workers.length > this.options.maxWorkerCount; ) {
                    let n = 0,
                        a = this.workers[0];
                    for (let s = 1; s < this.workers.length; s++) {
                        let o = this.workers[s];
                        o.age < a.age && ((n = s), (a = o));
                    }
                    if (a.running && a.pendingSlices.length > 0) break;
                    (a.aborted = !0), this.workers.splice(n, 1);
                }
                return i;
            }
            runWorker(e) {
                p(!e.running),
                    p(e.currentPos < e.targetPos),
                    (e.running = !0),
                    (e.age = this.nextAge++),
                    this.options.runWorker(e).catch((r) => {
                        if (((e.running = !1), e.pendingSlices.length > 0))
                            e.pendingSlices.forEach((i) => i.reject(r)), (e.pendingSlices.length = 0);
                        else throw r;
                    });
            }
            supplyWorkerData(e, r) {
                if (this.disposed) return;
                let i = e.currentPos,
                    n = i + r.length;
                this.insertIntoCache({ start: i, end: n, bytes: r, view: O(r), age: this.nextAge++ }),
                    (e.currentPos += r.length),
                    (e.targetPos = Math.max(e.targetPos, e.currentPos));
                for (let a = 0; a < e.pendingSlices.length; a++) {
                    let s = e.pendingSlices[a],
                        o = Math.max(i, s.start),
                        c = Math.min(n, s.start + s.bytes.length);
                    o < c && s.bytes.set(r.subarray(o - i, c - i), o - s.start);
                    for (let l = 0; l < s.holes.length; l++) {
                        let d = s.holes[l];
                        i <= d.start && n > d.start && (d.start = n), d.end <= d.start && (s.holes.splice(l, 1), l--);
                    }
                    s.holes.length === 0 && (s.resolve(s.bytes), e.pendingSlices.splice(a, 1), a--);
                }
                for (let a = 0; a < this.workers.length; a++) {
                    let s = this.workers[a];
                    e === s || s.running || (xt(i, n, s.currentPos, s.targetPos) && (this.workers.splice(a, 1), a--));
                }
            }
            forgetWorker(e) {
                let r = this.workers.indexOf(e);
                p(r !== -1), this.workers.splice(r, 1);
            }
            insertIntoCache(e) {
                if (this.options.maxCacheSize === 0) return;
                let r = F(this.cache, e.start, (i) => i.start) + 1;
                if (r > 0) {
                    let i = this.cache[r - 1];
                    if (i.end >= e.end) return;
                    if (i.end > e.start) {
                        let n = new Uint8Array(e.end - i.start);
                        n.set(i.bytes, 0),
                            n.set(e.bytes, e.start - i.start),
                            (this.currentCacheSize += e.end - i.end),
                            (i.bytes = n),
                            (i.view = O(n)),
                            (i.end = e.end),
                            r--,
                            (e = i);
                    } else this.cache.splice(r, 0, e), (this.currentCacheSize += e.bytes.length);
                } else this.cache.splice(r, 0, e), (this.currentCacheSize += e.bytes.length);
                for (let i = r + 1; i < this.cache.length; i++) {
                    let n = this.cache[i];
                    if (e.end <= n.start) break;
                    if (e.end >= n.end) {
                        this.cache.splice(i, 1), (this.currentCacheSize -= n.bytes.length), i--;
                        continue;
                    }
                    let a = new Uint8Array(n.end - e.start);
                    a.set(e.bytes, 0),
                        a.set(n.bytes, n.start - e.start),
                        (this.currentCacheSize -= e.end - n.start),
                        (e.bytes = a),
                        (e.view = O(a)),
                        (e.end = n.end),
                        this.cache.splice(i, 1);
                    break;
                }
                for (; this.currentCacheSize > this.options.maxCacheSize; ) {
                    let i = 0,
                        n = this.cache[0];
                    for (let a = 1; a < this.cache.length; a++) {
                        let s = this.cache[a];
                        s.age < n.age && ((i = a), (n = s));
                    }
                    if (this.currentCacheSize - n.bytes.length <= this.options.maxCacheSize) break;
                    this.cache.splice(i, 1), (this.currentCacheSize -= n.bytes.length);
                }
            }
            dispose() {
                for (let e of this.workers) e.aborted = !0;
                (this.workers.length = 0), (this.cache.length = 0), (this.disposed = !0);
            }
        };
    Gr();
    var ft = class {
            get disposed() {
                return this._disposed;
            }
            constructor(e) {
                if (
                    ((this._demuxerPromise = null),
                    (this._format = null),
                    (this._disposed = !1),
                    !e || typeof e != "object")
                )
                    throw new TypeError("options must be an object.");
                if (!Array.isArray(e.formats) || e.formats.some((r) => !(r instanceof Y)))
                    throw new TypeError("options.formats must be an array of InputFormat.");
                if (!(e.source instanceof Ze)) throw new TypeError("options.source must be a Source.");
                if (e.source._disposed) throw new Error("options.source must not be disposed.");
                (this._formats = e.formats), (this._source = e.source), (this._reader = new tr(e.source));
            }
            _getDemuxer() {
                return (this._demuxerPromise ??= (async () => {
                    this._reader.fileSize = await this._source.getSizeOrNull();
                    for (let e of this._formats)
                        if (await e._canReadInput(this)) return (this._format = e), e._createDemuxer(this);
                    throw new Error("Input has an unsupported or unrecognizable format.");
                })());
            }
            get source() {
                return this._source;
            }
            async getFormat() {
                return await this._getDemuxer(), p(this._format), this._format;
            }
            async computeDuration() {
                return (await this._getDemuxer()).computeDuration();
            }
            async getTracks() {
                return (await this._getDemuxer()).getTracks();
            }
            async getVideoTracks() {
                return (await this.getTracks()).filter((r) => r.isVideoTrack());
            }
            async getAudioTracks() {
                return (await this.getTracks()).filter((r) => r.isAudioTrack());
            }
            async getPrimaryVideoTrack() {
                return (await this.getTracks()).find((r) => r.isVideoTrack()) ?? null;
            }
            async getPrimaryAudioTrack() {
                return (await this.getTracks()).find((r) => r.isAudioTrack()) ?? null;
            }
            async getMimeType() {
                return (await this._getDemuxer()).getMimeType();
            }
            async getMetadataTags() {
                return (await this._getDemuxer()).getMetadataTags();
            }
            dispose() {
                this._disposed || ((this._disposed = !0), (this._source._disposed = !0), this._source._dispose());
            }
            [Symbol.dispose]() {
                this.dispose();
            }
        },
        j = class extends Error {
            constructor(e = "Input has been disposed.") {
                super(e), (this.name = "InputDisposedError");
            }
        };
    var tr = class {
            constructor(e) {
                this.source = e;
            }
            requestSlice(e, r) {
                if (this.source._disposed) throw new j();
                if (this.fileSize !== null && e + r > this.fileSize) return null;
                let i = e + r,
                    n = this.source._read(e, i);
                return n instanceof Promise
                    ? n.then((a) => (a ? new Ve(a.bytes, a.view, a.offset, e, i) : null))
                    : n
                      ? new Ve(n.bytes, n.view, n.offset, e, i)
                      : null;
            }
            requestSliceRange(e, r, i) {
                if (this.source._disposed) throw new j();
                if (this.fileSize !== null) return this.requestSlice(e, dr(this.fileSize - e, r, i));
                {
                    let n = this.requestSlice(e, i),
                        a = (s) => {
                            if (s) return s;
                            let o = (l) => (p(l !== null), this.requestSlice(e, dr(l - e, r, i))),
                                c = this.source._retrieveSize();
                            return c instanceof Promise ? c.then(o) : o(c);
                        };
                    return n instanceof Promise ? n.then(a) : a(n);
                }
            }
        },
        Ve = class t {
            constructor(e, r, i, n, a) {
                (this.bytes = e),
                    (this.view = r),
                    (this.offset = i),
                    (this.start = n),
                    (this.end = a),
                    (this.bufferPos = n - i);
            }
            static tempFromBytes(e) {
                return new t(e, O(e), 0, 0, e.length);
            }
            get length() {
                return this.end - this.start;
            }
            get filePos() {
                return this.offset + this.bufferPos;
            }
            set filePos(e) {
                this.bufferPos = e - this.offset;
            }
            get remainingLength() {
                return Math.max(this.end - this.filePos, 0);
            }
            skip(e) {
                this.bufferPos += e;
            }
            slice(e, r = this.end - e) {
                if (e < this.start || e + r > this.end) throw new RangeError("Slicing outside of original slice.");
                return new t(this.bytes, this.view, this.offset, e, e + r);
            }
        },
        Q = (t, e) => {
            if (t.filePos < t.start || t.filePos + e > t.end)
                throw new RangeError(
                    `Tried reading [${t.filePos}, ${t.filePos + e}), but slice is [${t.start}, ${t.end}). This is likely an internal error, please report it alongside the file that caused it.`
                );
        },
        _ = (t, e) => {
            Q(t, e);
            let r = t.bytes.subarray(t.bufferPos, t.bufferPos + e);
            return (t.bufferPos += e), r;
        },
        P = (t) => (Q(t, 1), t.view.getUint8(t.bufferPos++)),
        Qe = (t, e) => {
            Q(t, 2);
            let r = t.view.getUint16(t.bufferPos, e);
            return (t.bufferPos += 2), r;
        },
        L = (t) => {
            Q(t, 2);
            let e = t.view.getUint16(t.bufferPos, !1);
            return (t.bufferPos += 2), e;
        },
        ge = (t) => {
            Q(t, 3);
            let e = Je(t.view, t.bufferPos, !1);
            return (t.bufferPos += 3), e;
        },
        it = (t) => {
            Q(t, 2);
            let e = t.view.getInt16(t.bufferPos, !1);
            return (t.bufferPos += 2), e;
        },
        ue = (t, e) => {
            Q(t, 4);
            let r = t.view.getUint32(t.bufferPos, e);
            return (t.bufferPos += 4), r;
        },
        y = (t) => {
            Q(t, 4);
            let e = t.view.getUint32(t.bufferPos, !1);
            return (t.bufferPos += 4), e;
        },
        ve = (t) => {
            Q(t, 4);
            let e = t.view.getUint32(t.bufferPos, !0);
            return (t.bufferPos += 4), e;
        },
        ae = (t) => {
            Q(t, 4);
            let e = t.view.getInt32(t.bufferPos, !1);
            return (t.bufferPos += 4), e;
        },
        En = (t) => {
            Q(t, 4);
            let e = t.view.getInt32(t.bufferPos, !0);
            return (t.bufferPos += 4), e;
        },
        Rr = (t, e) => {
            let r, i;
            return e ? ((r = ue(t, !0)), (i = ue(t, !0))) : ((i = ue(t, !1)), (r = ue(t, !1))), i * 4294967296 + r;
        },
        $ = (t) => {
            let e = y(t),
                r = y(t);
            return e * 4294967296 + r;
        },
        hi = (t) => {
            let e = ae(t),
                r = y(t);
            return e * 4294967296 + r;
        },
        Di = (t) => {
            let e = ve(t);
            return En(t) * 4294967296 + e;
        },
        gi = (t) => {
            Q(t, 4);
            let e = t.view.getFloat32(t.bufferPos, !1);
            return (t.bufferPos += 4), e;
        },
        Bt = (t) => {
            Q(t, 8);
            let e = t.view.getFloat64(t.bufferPos, !1);
            return (t.bufferPos += 8), e;
        },
        M = (t, e) => {
            Q(t, e);
            let r = "";
            for (let i = 0; i < e; i++) r += String.fromCharCode(t.bytes[t.bufferPos++]);
            return r;
        };
    function Vr(t, e) {
        if (!t) throw new Error(e ?? "Assertion failed");
    }
    var Se = 1e6,
        vn = 2e5,
        An = 3e5,
        Lr = 8,
        Hr = class {
            encodedChunks = [];
            frameBuffer = new Map();
            decoderQueue = new Map();
            decoder = null;
            forwardIndex = null;
            backwardIndex = null;
            duration = 0;
            onError;
            seekQueue = [];
            seeking = !1;
            currentTimestamp = 0;
            loading = !1;
            canvas = null;
            ctx = null;
            lastDrawnTimestamp = null;
            drawFrame(e, r, i) {
                if (!this.canvas || !this.ctx) return;
                let n = 1 / 0,
                    a = null;
                for (let [s, o] of this.frameBuffer) {
                    let c = Math.abs(s - this.currentTimestamp);
                    c < n && ((n = c), (a = o));
                }
                a &&
                    a.timestamp != this.lastDrawnTimestamp &&
                    (this.ctx.drawImage(a, 0, 0, a.codedWidth, a.codedHeight), (this.lastDrawnTimestamp = a.timestamp)),
                    e.drawImage(this.canvas, 0, 0, r, i);
            }
            findClosestChunkIndex(e) {
                let r = 1 / 0,
                    i = 0;
                for (let n = 0; n < this.encodedChunks.length; n++) {
                    let a = Math.abs(e - this.encodedChunks[n].timestamp);
                    a < r && ((r = a), (i = n));
                }
                return i;
            }
            findClosestKeyFrameIndex(e) {
                let r = this.findClosestChunkIndex(e);
                for (let i = r; i >= 0; i--) if (this.encodedChunks[i].type === "key") return i;
                return 0;
            }
            seek(e) {
                this.frameBuffer.size !== 0 && (this.seekQueue.push(e), this.seeking || this.processQueue());
            }
            async processQueue() {
                try {
                    for (this.seeking = !0; this.seekQueue.length > 0; ) {
                        let e = this.seekQueue.length > 3 ? this.seekQueue.pop() : this.seekQueue.shift();
                        e !== void 0 && (this.seekQueue.length > 3 && (this.seekQueue = []), await this.dequeueSeek(e));
                    }
                } finally {
                    this.seeking = !1;
                }
            }
            async dequeueSeek(e) {
                let r = Math.floor(this.duration * Math.max(0, Math.min(1, e))),
                    i = this.currentTimestamp,
                    n = [...this.frameBuffer.keys(), ...this.decoderQueue.keys()],
                    a = Math.max(...n),
                    s = Math.min(...n),
                    o = r < s || r > a + Se / 2,
                    c = r - s,
                    l = a - r,
                    d = null,
                    u = null,
                    f = [];
                if (o) {
                    (u = this.findClosestChunkIndex(r + Se)),
                        (d = this.findClosestKeyFrameIndex(r - Se)),
                        this.decodeChunks(d, u),
                        this.forwardIndex !== null
                            ? ((this.forwardIndex = u), (this.backwardIndex = null))
                            : this.backwardIndex !== null && ((this.backwardIndex = d), (this.forwardIndex = null));
                    let h = this.findClosestChunkIndex(r),
                        m = this.encodedChunks[h];
                    f.push(this.decoderQueue.get(m.timestamp)?.promise);
                } else if (r < i && c < An && s > 0)
                    (this.forwardIndex = null),
                        (d = this.findClosestKeyFrameIndex(r - Se)),
                        this.backwardIndex === null
                            ? (u = this.findClosestChunkIndex(a) + Lr)
                            : (u = this.backwardIndex + Lr),
                        u !== d + Lr &&
                            (this.decodeChunks(d, u),
                            (this.backwardIndex = d),
                            f.push(this.decoderQueue.get(this.encodedChunks[d].timestamp)?.promise));
                else if (r > i && l < vn && a < this.duration) {
                    (this.backwardIndex = null),
                        (u = this.findClosestChunkIndex(r + Se)),
                        this.forwardIndex === null
                            ? (d = this.findClosestKeyFrameIndex(s))
                            : (d = this.forwardIndex + 1),
                        this.decodeChunks(d, u),
                        (this.forwardIndex = u);
                    let h = this.encodedChunks[d];
                    h && this.decoderQueue.has(h.timestamp) && (await this.decoderQueue.get(h.timestamp)?.promise),
                        u === this.encodedChunks.length - 1 && f.push(this.decoder?.flush());
                }
                await Promise.all(f), (this.currentTimestamp = r);
            }
            decodeChunks(e, r) {
                for (let i = e; i <= r; i++) this.decodeChunkAt(i);
            }
            decodeChunkAt(e) {
                e = Math.min(Math.max(0, e), this.encodedChunks.length - 1);
                let r = this.encodedChunks[e];
                this.decoderQueue.set(r.timestamp, Promise.withResolvers()), this.decoder?.decode(r);
            }
            destroy() {
                this.frameBuffer.forEach((e) => e.close()),
                    this.frameBuffer.clear(),
                    (this.encodedChunks = []),
                    this.decoderQueue.clear(),
                    this.decoder?.close(),
                    (this.decoder = null),
                    (this.forwardIndex = 0),
                    (this.backwardIndex = null),
                    (this.lastDrawnTimestamp = null);
            }
            frameCallback(e) {
                this.decoderQueue.get(e.timestamp)?.resolve(), this.decoderQueue.delete(e.timestamp);
                let r = this.currentTimestamp - Se,
                    i = this.currentTimestamp + Se;
                for (let n of this.frameBuffer.values())
                    (n.timestamp <= r || n.timestamp > i) && (this.frameBuffer.delete(n.timestamp), n.close());
                this.frameBuffer.has(e.timestamp) ? e.close() : this.frameBuffer.set(e.timestamp, e);
            }
            async init(e) {
                if (this.loading) return;
                this.loading = !0;
                let r = new VideoDecoder({
                        output: this.frameCallback.bind(this),
                        error: this.onError ?? console.error,
                    }),
                    n = await new ft({ source: new dt(e), formats: Or }).getPrimaryVideoTrack();
                Vr(n, "No video track found"),
                    (this.canvas = new OffscreenCanvas(n.codedWidth, n.codedHeight)),
                    (this.ctx = this.canvas.getContext("2d")),
                    (this.duration = Math.floor((await n.computeDuration()) * 1e6));
                let a = await n.getDecoderConfig();
                Vr(a, "No decoder config found"),
                    r.configure(a),
                    (this.encodedChunks = []),
                    (this.decoder = r),
                    (this.forwardIndex = 0),
                    (this.backwardIndex = null);
                let s = new Ie(n);
                for await (let o of s.packets()) {
                    let c = o.toEncodedVideoChunk();
                    this.encodedChunks.push(c),
                        c.timestamp <= Se && (this.decodeChunkAt(this.forwardIndex), this.forwardIndex++);
                }
                this.loading = !1;
            }
        };
    return tn(Dn);
})();

