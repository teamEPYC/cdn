// =========================================================================
    // SECTION 1: GLOBAL DEFAULTS
    // =========================================================================

    const LINEGRID_DEFAULTS = {
      // All values in rem — 1rem = 50px baseline
      colRem:      2.2,    // column width         (110px @ 50px/rem)
      gapRem:      0.2,    // column gap           (10px)
      lineGapRem:  0.2,    // line gap / row height (10px)
      minHRem:     0.02,   // min foreground line height (1px)
      maxHRem:     0.12,   // max foreground line height (6px)
      radiusRem:   0.4,    // rounded corner radius (20px)
      bgOpacity:   0.15,   // ← manually set (unitless, no rem conversion)
      sizeRatio:   0.38,   // cube size relative to canvas height (ratio, no rem)
      stroke:      18,     // cube stroke — stays px (offscreen only)
      threshold:   0.5,    // alpha threshold (unitless)
      trailLen:    12,     // trail length (count, no rem)
      lerp:        0.08,   // cursor lerp (ratio, no rem)
      velDecay:    0.85,
      velScale:    0.04,
      waveSpeed:   0.3,
      flipSpeed:   0.018,
      flipFocal:   900,    // flip perspective focal (stays px — persp math)
      bgColor:     '#222222',
      lineColor:   '#f5f5f5',
      dpr:         Math.min(window.devicePixelRatio || 1, 2),
    };


    // =========================================================================
    // SECTION 2: LINEGRID CLASS
    //
    // Foreground types:
    //   'globe'   — rotating filled world map globe with laurel arcs + plinth
    //   'rhombus' — static SVG path with outward wave animation
    //   'flip'    — two SVG paths that Y-axis rotate and swap at edge-on moment
    //   null      — background + hover only
    //
    // Adding a new foreground type:
    //   1. Add state in constructor
    //   2. Add _buildXxx() called from resize()
    //   3. Add _drawXxx() renderer
    //   4. Wire into _tick() following existing pattern
    //   5. Use _snapY(y) for all y positions to stay on background grid
    // =========================================================================

    class LineGrid {
      constructor(container, options = {}) {
        this.container = typeof container === 'string' ? document.querySelector(container) : container;
        const cfg      = Object.assign({}, LINEGRID_DEFAULTS, options);

        // Grid — all rem-based, actual pixel values computed in resize()
        this.COL_REM     = cfg.colRem;
        this.GAP_REM     = cfg.gapRem;
        this.LINE_GAP_REM= cfg.lineGapRem;
        this.MIN_H_REM   = cfg.minHRem;
        this.MAX_H_REM   = cfg.maxHRem;
        this.RADIUS_REM  = cfg.radiusRem;
        // These are set to px in resize() from rem:
        this.COLS    = 0;
        this.GAP     = 0;
        this.COL_W   = 0;
        this.LINE_GAP= 0;
        this.MIN_H   = 0;
        this.MAX_H   = 0;
        this.RADIUS  = 0;
        this.BG_OPACITY = cfg.bgOpacity;

        // Cube
        this.SIZE_RATIO = cfg.sizeRatio;
        this.STROKE     = cfg.stroke;
        this.THRESHOLD  = cfg.threshold;

        // Hover
        this.TRAIL_LEN  = cfg.trailLen;
        this.LERP       = cfg.lerp;
        this.VEL_DECAY  = cfg.velDecay;
        this.VEL_SCALE  = cfg.velScale;

        // Rhombus wave
        this.WAVE_SPEED = cfg.waveSpeed;

        // Flip
        this.FLIP_SPEED = cfg.flipSpeed;
        this.FLIP_FOCAL = cfg.flipFocal;

        // Colors
        this._bgVar     = options.bgColor   && options.bgColor.startsWith('--')   ? options.bgColor   : null;
        this._lineVar   = options.lineColor  && options.lineColor.startsWith('--') ? options.lineColor : null;
        this.BG_COLOR   = this._bgVar   ? this._readVar(this._bgVar)   : (cfg.bgColor   || '#222222');
        this.LINE_COLOR = this._lineVar ? this._hexToRgb(this._readVar(this._lineVar)) : this._hexToRgb(cfg.lineColor || '#f5f5f5');

        // System
        this.DPR = cfg.dpr;

        // Foreground config
        this.foregroundType = options.foregroundType || null;
        this.shapePath      = options.shapePath      || null;
        this.shapeViewBox   = options.shapeViewBox   || { w: 1450, h: 770 };
        this.flipPaths      = options.flipPaths      || [];
        this.flipBounds     = options.flipBounds     || [];

        // Runtime state
        this.W = 0; this.H = 0; this.COL_W = 0;
        this.sCX = 0; this.sCY = 0; this.LINES = 0;
        this.colXCache   = [];
        this.shapeMinX   = 0; this.shapeMaxX = 0;
        this.angle       = 0;
        this.waveTime    = 0; this.lastTs = null;
        this.trail       = [];
        this.energy      = [];
        this.targetX     = -1; this.targetY     = -1;
        this.smoothX     = -1; this.smoothY     = -1;
        this.prevSmoothX = -1; this.prevSmoothY = -1;
        this.velocity    = 0;
        this._rafId      = null;

        // Rhombus state
        this.rhombusLines    = null;
        this.revealProgress  = 0;  // 0 = hidden, 1 = fully revealed — drive from GSAP

        // Flip state
        this.flipDatas    = [];
        this.flipHalfW    = [];
        this.flipHalfH    = [];
        this.flipIdx      = 0;
        this.flipLastSign = 1;
        this.flipAngle    = 0;

        // Gyroscope state
        this.gyroRings   = null;
        this.GYRO_SLOW   = options.gyroSlow   || 0.75;
        this.GYRO_STROKE = options.gyroStroke || 5;
        this.gyroScale   = 0;   // 0 = invisible, 1 = full size — tween from GSAP
        this.gyroReveal  = 0;   // 0 = all flat, 1 = full rotation — tween from GSAP
        this.globeAngle     = 0;
        this.globeCountries = [];
        this.globeReady     = false;
        this.GLOBE_TILT     = options.globeTilt   || 0.3;
        this.GLOBE_SPEED    = options.globeSpeed  || 0.005;
        this.GLOBE_STROKE   = options.globeStroke || 2;
        // Globe reveal — drive from GSAP on page load
        this.globeRevealScale = 0;  // 0=invisible → 1=full size
        this.globeRevealX     = 0;  // 0=center    → 1=right (W*0.712)
        this.plinthReveal     = 0;  // 0=hidden    → 1=full width
        this.arcReveal        = 0;  // 0=hidden    → 1=visible (bottom→top mask)

        // Canvas
        this.canvas = document.createElement('canvas');
        this.canvas.style.cssText = `display:block;width:100%;height:100%;background:${this.BG_COLOR};`;
        this.container.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');

        // Offscreen
        this.faceCanvas = document.createElement('canvas');
        this.fCtx       = this.faceCanvas.getContext('2d');

        this.CUBE_EDGES = [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];

        this._onMouseMove  = this._onMouseMove.bind(this);
        this._onMouseLeave = this._onMouseLeave.bind(this);
        this._onResize     = this._onResize.bind(this);
        this.canvas.addEventListener('mousemove',  this._onMouseMove);
        this.canvas.addEventListener('mouseleave', this._onMouseLeave);
        window.addEventListener('resize', this._onResize);

        window.addEventListener('load', () => {
          this.resize();
          if (this.foregroundType === 'globe') this._initGlobe();
          if (this.foregroundType === 'gyro')  this._initGyro();
          this._rafId = requestAnimationFrame((ts) => this._tick(ts));
          LineGrid._instances.add(this);
        });
      }

      // ── Events ──────────────────────────────────────────────────────────────

      _onMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        this.targetX = e.clientX - rect.left;
        this.targetY = e.clientY - rect.top;
        if (this.smoothX < 0) { this.smoothX = this.targetX; this.smoothY = this.targetY; }
      }
      _onMouseLeave() {
        this.targetX = -1; this.targetY = -1;
        this.smoothX = -1; this.smoothY = -1;
        this.prevSmoothX = -1; this.prevSmoothY = -1;
        this.velocity = 0; this.trail.length = 0;
      }
      _onResize() { this.resize(); }

      // ── Resize ──────────────────────────────────────────────────────────────

      resize() {
        const style = window.getComputedStyle(this.container);
        const W = this.container.clientWidth  - parseFloat(style.paddingLeft)  - parseFloat(style.paddingRight);
        const H = this.container.clientHeight - parseFloat(style.paddingTop)   - parseFloat(style.paddingBottom);
        this.W = W; this.H = H > 0 ? H : window.innerHeight;

        this.canvas.style.width  = this.W + 'px';
        this.canvas.style.height = this.H + 'px';
        this.canvas.width  = this.W * this.DPR;
        this.canvas.height = this.H * this.DPR;
        this.ctx.scale(this.DPR, this.DPR);

        this.faceCanvas.width  = this.W * this.DPR;
        this.faceCanvas.height = this.H * this.DPR;

        // ── Rem → px conversion ─────────────────────────────────────────────
        // Re-read rem on every resize so dynamic root font-size changes
        // are always reflected immediately across all canvas measurements
        const rem        = parseFloat(getComputedStyle(document.documentElement).fontSize);
        this.GAP         = rem * this.GAP_REM;
        this.COL_W       = rem * this.COL_REM;
        this.COLS        = Math.floor((this.W + this.GAP + 0.5) / (this.COL_W + this.GAP));
        this.LINE_GAP    = rem * this.LINE_GAP_REM;
        this.MIN_H       = rem * this.MIN_H_REM;
        this.MAX_H       = rem * this.MAX_H_REM;
        this.RADIUS      = rem * this.RADIUS_REM;
        // Store rem for use in _renderGlobe / _drawGlobeDecor
        this._rem        = rem;
        // ────────────────────────────────────────────────────────────────────

        this.sCX   = this.W / 2;
        this.sCY   = this.H / 2;
        this.LINES = Math.ceil(this.H / this.LINE_GAP);

        this.colXCache = [];
        this.energy    = [];
        for (let col = 0; col < this.COLS; col++) {
          this.colXCache.push(col * (this.COL_W + this.GAP));
          this.energy.push(new Float32Array(this.LINES).fill(0));
        }

        if (this.foregroundType === 'rhombus' && this.shapePath) {
          this._buildRhombusLines();
        }
        if (this.foregroundType === 'flip' && this.flipPaths.length === 2) {
          this._buildFlipShapes();
        }
      }

      // ── Shared helpers ───────────────────────────────────────────────────────

      _rotateY(v,a){const[x,y,z]=v;return[x*Math.cos(a)+z*Math.sin(a),y,-x*Math.sin(a)+z*Math.cos(a)];}
      _rotateX(v,a){const[x,y,z]=v;return[x,y*Math.cos(a)-z*Math.sin(a),y*Math.sin(a)+z*Math.cos(a)];}
      _project(v,focal){const[x,y,z]=v,s=focal/(focal+z+focal*0.5);return[this.sCX+x*s,this.sCY+y*s];}

      _getFracCol(x) {
        for (let c = 0; c < this.COLS; c++) {
          const cx = this.colXCache[c];
          if (x >= cx && x < cx + this.COL_W + this.GAP) return c + (x - cx) / (this.COL_W + this.GAP);
        }
        return x < 0 ? 0 : this.COLS - 1;
      }

      // ALL foreground renderers must use _snapY() for y positions
      _snapY(y) { return Math.round(y / this.LINE_GAP) * this.LINE_GAP; }

      _readVar(varName) {
        return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
      }

      refreshColors() {
        if (this._bgVar)   this.BG_COLOR   = this._readVar(this._bgVar);
        if (this._lineVar) this.LINE_COLOR  = this._hexToRgb(this._readVar(this._lineVar));
        this.canvas.style.background = this.BG_COLOR;
      }

      _hexToRgb(hex) {
        if (!hex) return '245,245,245';
        hex = hex.trim().replace('#', '');
        if (hex.length === 3) hex = hex.split('').map(c => c+c).join('');
        const r = parseInt(hex.slice(0,2), 16);
        const g = parseInt(hex.slice(2,4), 16);
        const b = parseInt(hex.slice(4,6), 16);
        return `${r},${g},${b}`;
      }

      _drawRoundedBottom(x, y, w, h, r) {
        if (w <= 0 || h <= 0) return;
        const safeR = Math.min(r, h/2, w/2);
        const c = this.ctx;
        c.beginPath(); c.moveTo(x,y); c.lineTo(x+w,y);
        c.lineTo(x+w,y+h-safeR); c.quadraticCurveTo(x+w,y+h,x+w-safeR,y+h);
        c.lineTo(x+safeR,y+h);   c.quadraticCurveTo(x,y+h,x,y+h-safeR);
        c.lineTo(x,y); c.closePath(); c.fill();
      }

      // =========================================================================
      // FOREGROUND: CUBE
      // =========================================================================

      _renderCube(SIZE, FOCAL) {
        const {W,H,DPR,STROKE} = this;
        const fCtx = this.fCtx;
        fCtx.clearRect(0,0,W*DPR,H*DPR);
        fCtx.save(); fCtx.scale(DPR,DPR);
        fCtx.strokeStyle='white'; fCtx.lineWidth=STROKE; fCtx.lineCap='round';
        const h=SIZE/2;
        const verts=[[-h,-h,-h],[h,-h,-h],[h,h,-h],[-h,h,-h],[-h,-h,h],[h,-h,h],[h,h,h],[-h,h,h]];
        const rotated=verts.map(v=>this._rotateX(this._rotateY(v,this.angle),Math.PI/6));
        this.shapeMinX=Infinity; this.shapeMaxX=-Infinity;
        const projected=rotated.map(v=>{
          const p=this._project(v,FOCAL);
          if(p[0]<this.shapeMinX)this.shapeMinX=p[0];
          if(p[0]>this.shapeMaxX)this.shapeMaxX=p[0];
          return p;
        });
        this.shapeMinX-=STROKE; this.shapeMaxX+=STROKE;
        this.CUBE_EDGES.forEach(([a,b])=>{
          const[ax,ay]=projected[a],[bx,by]=projected[b];
          fCtx.beginPath();fCtx.moveTo(ax,ay);fCtx.lineTo(bx,by);fCtx.stroke();
        });
        fCtx.restore();
      }

      _drawCubeLines(getAlpha, SIZE) {
        const {COLS,COL_W,LINE_GAP,RADIUS,THRESHOLD,H} = this;
        for (let col=0;col<COLS;col++) {
          const colX=this.colXCache[col], colEnd=colX+COL_W;
          if (colEnd<this.shapeMinX||colX>this.shapeMaxX) continue;
          for (let y=0;y<=H;y+=LINE_GAP) {
            let lx=-1,rx=-1;
            for(let px=colX;px<=colEnd;px++){if(getAlpha(px,y)>THRESHOLD){lx=px;break;}}
            for(let px=colEnd;px>=colX;px--){if(getAlpha(px,y)>THRESHOLD){rx=px;break;}}
            if(lx!==-1&&rx!==-1&&rx>=lx){
              const midX=(lx+rx)/2;
              const ndx=(midX-this.sCX)/(SIZE*0.8);
              const ndy=(y-this.sCY)/(SIZE*0.8);
              const d=Math.sqrt(ndx*ndx+ndy*ndy);
              const t=Math.max(0,1-d);
              const lh=this.MIN_H+t*(this.MAX_H-this.MIN_H);
              this.ctx.fillStyle=`rgba(${this.LINE_COLOR},1)`;
              this._drawRoundedBottom(lx,y,rx-lx,lh,RADIUS);
            }
          }
        }
      }

      // =========================================================================
      // FOREGROUND: RHOMBUS
      // =========================================================================

      _buildRhombusLines() {
        const {W,H,DPR,COLS,COL_W,LINE_GAP,THRESHOLD,MIN_H,MAX_H} = this;
        const vbW=this.shapeViewBox.w, vbH=this.shapeViewBox.h;
        const scale=W/vbW;
        const offsetX=(W-vbW*scale)/2;
        const offsetY=(H-vbH*scale)/2;

        const tmp=document.createElement('canvas');
        tmp.width=W*DPR; tmp.height=H*DPR;
        const tCtx=tmp.getContext('2d');
        tCtx.scale(DPR,DPR);
        tCtx.translate(offsetX,offsetY);
        tCtx.scale(scale,scale);
        tCtx.fillStyle='white';
        tCtx.fill(new Path2D(this.shapePath));

        const imgData=tCtx.getImageData(0,0,W*DPR,H*DPR);
        const d=imgData.data;
        const stride=Math.round(W*DPR);
        const px2css=(v)=>v/DPR;

        let x0=Infinity,x1=-Infinity,y0=Infinity,y1=-Infinity;
        for(let py=0;py<H*DPR;py++){
          for(let px=0;px<W*DPR;px++){
            if(d[(py*stride+px)*4+3]>10){
              if(px<x0)x0=px; if(px>x1)x1=px;
              if(py<y0)y0=py; if(py>y1)y1=py;
            }
          }
        }

        const cssx0=px2css(x0),cssx1=px2css(x1);
        const cssy0=px2css(y0),cssy1=px2css(y1);
        const shapeCX=(cssx0+cssx1)/2;
        const shapeHalfW=(cssx1-cssx0)/2;
        const shapeHalfH=(cssy1-cssy0)/2;
        this.shapeMinX=cssx0; this.shapeMaxX=cssx1;

        const getA=(cx,cy)=>{
          const px=Math.round(Math.max(0,Math.min(W*DPR-1,cx*DPR)));
          const py=Math.round(Math.max(0,Math.min(H*DPR-1,cy*DPR)));
          return d[(py*stride+px)*4+3]/255;
        };

        const lines=[];
        for(let col=0;col<COLS;col++) lines.push([]);

        for(let col=0;col<COLS;col++){
          const colX=this.colXCache[col];
          const colEnd=colX+COL_W;
          if(colEnd<cssx0||colX>cssx1) continue;
          const snapStart=this._snapY(cssy0);
          for(let y=snapStart;y<=cssy1;y+=LINE_GAP){
            let lx=-1,rx=-1;
            for(let px=colX;px<=colEnd;px++){if(getA(px,y)>THRESHOLD){lx=px;break;}}
            for(let px=colEnd;px>=colX;px--){if(getA(px,y)>THRESHOLD){rx=px;break;}}
            if(lx===-1||rx===-1||rx<lx) continue;
            const midX=(lx+rx)/2;
            const distH=Math.abs(midX-shapeCX)/Math.max(shapeHalfW,1);
            const ndx=(midX-this.sCX)/Math.max(shapeHalfW,1);
            const ndy=(y-this.sCY)/Math.max(shapeHalfH,1);
            const dist=Math.sqrt(ndx*ndx+ndy*ndy);
            const baseH=MIN_H+Math.max(0,1-dist)*(MAX_H-MIN_H);
            lines[col].push({y,lx,rx,distH,baseH,dist});
          }
        }
        this.rhombusLines=lines;
      }

      _drawRhombus() {
        if(!this.rhombusLines) return;
        const {MIN_H,RADIUS,WAVE_SPEED,COLS} = this;
        const t = this.waveTime;
        const reveal = this.revealProgress;

        for(let col=0;col<COLS;col++){
          for(const {y,lx,rx,distH,baseH,dist} of this.rhombusLines[col]){

            // Gate by reveal — lines grow outward from center (dist=0) to edge (dist=1)
            if (dist > reveal) continue;

            // How far into the reveal this line is (0=just appeared, 1=fully in)
            // Lines near center are "more revealed" than lines near edge
            const lineReveal = reveal === 0 ? 0 : Math.min(1, (reveal - dist) / Math.max(reveal, 0.001));

            // Breathing wave — only active once fully revealed
            const phase = t * WAVE_SPEED - distH * 0.5;
            const sine  = (Math.sin(phase * Math.PI * 2) + 1) / 2;
            const breathH = baseH * 0.4 + sine * baseH * 0.6;

            // During reveal: grow from MIN_H to baseH. After reveal: breathe.
            const revealH = MIN_H + lineReveal * (baseH - MIN_H);
            const lh = reveal < 1
              ? revealH
              : breathH;

            this.ctx.fillStyle=`rgba(${this.LINE_COLOR},1)`;
            this._drawRoundedBottom(lx,y,rx-lx,Math.max(MIN_H,lh),RADIUS);
          }
        }
      }

      // =========================================================================
      // FOREGROUND: FLIP (two SVG paths that Y-axis rotate and swap)
      // =========================================================================

      _buildFlipShapes() {
        const {W,H,DPR} = this;
        this.flipDatas = [];
        this.flipHalfW = [];
        this.flipHalfH = [];

        this.flipPaths.forEach((pathStr, i) => {
          const b = this.flipBounds[i];
          const shapeCX = (b.x1 + b.x2) / 2;
          const shapeCY = (b.y1 + b.y2) / 2;
          const offX = this.sCX - shapeCX;
          const offY = this.sCY - shapeCY;

          const oc = document.createElement('canvas');
          oc.width = W * DPR; oc.height = H * DPR;
          const oc2d = oc.getContext('2d');
          oc2d.scale(DPR, DPR);
          oc2d.save();
          oc2d.translate(this.sCX, this.sCY);
          oc2d.scale(0.8, 0.8);
          oc2d.translate(-this.sCX, -this.sCY);
          oc2d.translate(offX, offY);
          oc2d.fillStyle = 'white';
          oc2d.fill(new Path2D(pathStr));
          oc2d.restore();

          this.flipDatas.push(oc2d.getImageData(0, 0, W * DPR, H * DPR));
          this.flipHalfW.push((b.x2 - b.x1) / 2 * 0.8);
          this.flipHalfH.push((b.y2 - b.y1) / 2 * 0.8);
        });
      }

      _drawFlipLines() {
        if(this.flipDatas.length < 2) return;
        const {W,H,DPR,COLS,COL_W,LINE_GAP,RADIUS,THRESHOLD,MIN_H,MAX_H,FLIP_FOCAL} = this;

        this.flipAngle += this.FLIP_SPEED;
        const cosA = Math.cos(this.flipAngle);
        const sinA = Math.sin(this.flipAngle);

        const currentSign = cosA >= 0 ? 1 : -1;
        if (currentSign !== this.flipLastSign) {
          this.flipIdx = 1 - this.flipIdx;
          this.flipLastSign = currentSign;
        }

        const data    = this.flipDatas[this.flipIdx];
        const halfW   = this.flipHalfW[this.flipIdx];
        const halfH   = this.flipHalfH[this.flipIdx];
        const stride  = W * DPR;

        const getAlpha = (x, y) => {
          const px = Math.round(Math.max(0, Math.min(W*DPR-1, x*DPR)));
          const py = Math.round(Math.max(0, Math.min(H*DPR-1, y*DPR)));
          return data.data[(py*stride+px)*4+3] / 255;
        };

        const edgeZ = halfW * sinA;
        const perspScale = FLIP_FOCAL / (FLIP_FOCAL + edgeZ);
        const screenHalfW = halfW * Math.abs(cosA) * perspScale;
        if (screenHalfW < 0.5) return;

        const scanL = Math.floor(this.sCX - halfW);
        const scanR = Math.ceil(this.sCX + halfW);
        const scaleX = screenHalfW / halfW;

        for (let col = 0; col < COLS; col++) {
          const colX   = this.colXCache[col];
          const colEnd = colX + COL_W;
          const projLeft  = this.sCX - screenHalfW;
          const projRight = this.sCX + screenHalfW;
          if (colEnd < projLeft || colX > projRight) continue;

          for (let y = 0; y <= H; y += LINE_GAP) {
            let leftShapeX = -1, rightShapeX = -1;
            for (let sx = scanL; sx <= scanR; sx++) {
              if (getAlpha(sx, y) > THRESHOLD) { leftShapeX = sx; break; }
            }
            for (let sx = scanR; sx >= scanL; sx--) {
              if (getAlpha(sx, y) > THRESHOLD) { rightShapeX = sx; break; }
            }
            if (leftShapeX === -1 || rightShapeX === -1) continue;

            const screenLeft  = this.sCX + (leftShapeX  - this.sCX) * scaleX;
            const screenRight = this.sCX + (rightShapeX - this.sCX) * scaleX;
            const leftX  = Math.max(screenLeft,  colX);
            const rightX = Math.min(screenRight, colEnd);
            if (rightX <= leftX) continue;

            const midX = (leftX + rightX) / 2;
            const ndx  = (midX - this.sCX) / Math.max(screenHalfW, 1);
            const ndy  = (y    - this.sCY) / halfH;
            const d    = Math.sqrt(ndx*ndx + ndy*ndy);
            const t    = Math.max(0, 1 - d);
            const lh   = MIN_H + t * (MAX_H - MIN_H);

            this.ctx.fillStyle = `rgba(${this.LINE_COLOR},1)`;
            this._drawRoundedBottom(leftX, y, rightX - leftX, lh, RADIUS);
          }
        }
      }

      // =========================================================================
      // FOREGROUND: GYRO (4 rings rotating on different axes with axis drift)
      // =========================================================================

      _initGyro() {
        const s = this.GYRO_SLOW;
        this.gyroRings = [
          { speed:  0.007*s, driftX:  0.007*s, driftZ:  0.005*s },
          { speed: -0.011*s, driftX: -0.009*s, driftZ:  0.011*s },
          { speed:  0.009*s, driftX:  0.008*s, driftZ: -0.007*s },
          { speed: -0.006*s, driftX: -0.006*s, driftZ: -0.009*s },
        ];
        this.gyroRings.forEach((ring, i) => {
          ring.angle = Math.random() * Math.PI * 2;
          // Target axisX values — offset from π/2 so all rings visibly rotate away from flat
          // None close to 0 offset (which would stay near flat)
          const axisXOffsets = [0.4, 1.1, 1.7, 2.6];
          const axisZTargets = [0.2, 0.8, 0.4, 1.1];
          ring.axisX = Math.PI / 2 + axisXOffsets[i];
          ring.axisZ = axisZTargets[i];
        });
      }

      _renderGyro() {
        if (!this.gyroRings) return;
        const { W, H, DPR } = this;
        const RING_R = Math.min(W, H) * 0.45 * this.gyroScale;
        if (RING_R < 0.5) return null;

        const STEPS  = 180;
        const fCtx   = this.fCtx;
        const reveal = this.gyroReveal;

        fCtx.clearRect(0, 0, W*DPR, H*DPR);
        fCtx.save();
        fCtx.scale(DPR, DPR);
        fCtx.strokeStyle = 'white';
        fCtx.lineWidth   = this.GYRO_STROKE;
        fCtx.lineCap     = 'round';

        const FOCAL = 900;

        this.gyroRings.forEach(ring => {
          // Y spin accumulates always
          ring.angle += ring.speed;
          if (reveal >= 1) {
            ring.axisX += ring.driftX;
            ring.axisZ += ring.driftZ;
          }

          const startAxisX = Math.PI / 2;
          const displayAxisX = startAxisX + (ring.axisX - startAxisX) * reveal;
          const displayAxisZ = ring.axisZ * reveal;
          const displayAngle = ring.angle;

          fCtx.beginPath();
          for (let st = 0; st <= STEPS; st++) {
            const a = (st / STEPS) * Math.PI * 2;
            let v = [RING_R * Math.cos(a), RING_R * Math.sin(a), 0];
            let [x,y,z] = v;
            v = [x, y*Math.cos(displayAxisX)-z*Math.sin(displayAxisX), y*Math.sin(displayAxisX)+z*Math.cos(displayAxisX)];
            [x,y,z] = v;
            v = [x*Math.cos(displayAxisZ)-y*Math.sin(displayAxisZ), x*Math.sin(displayAxisZ)+y*Math.cos(displayAxisZ), z];
            [x,y,z] = v;
            v = [x*Math.cos(displayAngle)+z*Math.sin(displayAngle), y, -x*Math.sin(displayAngle)+z*Math.cos(displayAngle)];
            [x,y,z] = v;
            const s = FOCAL / (FOCAL + z + 300);
            const sx = this.sCX + x*s;
            const snappedCY = Math.round(this.sCY / this.LINE_GAP) * this.LINE_GAP;
            const sy = snappedCY + y*s;
            st === 0 ? fCtx.moveTo(sx, sy) : fCtx.lineTo(sx, sy);
          }
          fCtx.closePath();
          fCtx.stroke();
        });

        fCtx.restore();
        return RING_R;
      }

      _drawGyroLines(RING_R) {
        const { W, H, DPR, COLS, COL_W, LINE_GAP, RADIUS, THRESHOLD } = this;
        const data   = this.fCtx.getImageData(0, 0, W*DPR, H*DPR);
        const stride = Math.round(W * DPR);

        const getAlpha = (x, y) => {
          const px = Math.round(Math.max(0, Math.min(W*DPR-1, x*DPR)));
          const py = Math.round(Math.max(0, Math.min(H*DPR-1, y*DPR)));
          return data.data[(py*stride+px)*4+3] / 255;
        };

        const GYRO_THRESHOLD = THRESHOLD;

        const getSegments = (colX, colEnd, y) => {
          const segs = []; let inSeg = false, start = -1;
          for (let px = colX; px <= colEnd; px++) {
            const a = getAlpha(px, y);
            if (a > GYRO_THRESHOLD && !inSeg)      { inSeg = true;  start = px; }
            else if (a <= GYRO_THRESHOLD && inSeg) { inSeg = false; segs.push([start, px-1]); }
          }
          if (inSeg) segs.push([start, colEnd]);
          return segs;
        };

        for (let col = 0; col < COLS; col++) {
          const colX = this.colXCache[col], colEnd = colX + COL_W;
          for (let y = 0; y <= H; y += LINE_GAP) {
            const segs = getSegments(colX, colEnd, y);
            segs.forEach(([lx, rx]) => {
              const midX = (lx + rx) / 2;
              const ndx  = (midX - this.sCX) / RING_R;
              const ndy  = (y    - this.sCY) / RING_R;
              const t    = Math.max(0, 1 - Math.sqrt(ndx*ndx + ndy*ndy));
              const lh   = this.MIN_H + t * (this.MAX_H - this.MIN_H);
              this.ctx.fillStyle = `rgba(${this.LINE_COLOR},1)`;
              this._drawRoundedBottom(lx, y, rx-lx, lh, RADIUS);
            });
          }
        }
      }

      // =========================================================================
      // FOREGROUND: GLOBE
      // =========================================================================

      _initGlobe() {
        const self = this;
        fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
          .then(r => r.json())
          .then(topology => {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/topojson/3.0.2/topojson.min.js';
            document.head.appendChild(script);
            script.onload = () => {
              const geojson = topojson.feature(topology, topology.objects.countries);
              geojson.features.forEach(feature => {
                const geom = feature.geometry;
                const polys = geom.type === 'Polygon' ? [geom.coordinates]
                            : geom.type === 'MultiPolygon' ? geom.coordinates : [];
                polys.forEach(poly => poly.forEach(ring => {
                  if (ring.length < 6) return;
                  let minLon=180,maxLon=-180,minLat=90,maxLat=-90;
                  ring.forEach(([lon,lat]) => {
                    if(lon<minLon)minLon=lon; if(lon>maxLon)maxLon=lon;
                    if(lat<minLat)minLat=lat; if(lat>maxLat)maxLat=lat;
                  });
                  const area = (maxLon-minLon)*(maxLat-minLat);
                  if (area < 4) return;
                  if (ring.length > 1) self.globeCountries.push(ring);
                }));
              });
              self.globeReady = true;
            };
          });
      }

      _drawGlobeDecor(fCtx, GLOBE_R, GLOBE_CY, GLOBE_CX) {
        const sCX  = GLOBE_CX !== undefined ? GLOBE_CX : this.sCX;
        const sCY  = GLOBE_CY;
        const rem  = this._rem || 50;
        const color = `rgb(${this.LINE_COLOR})`;
        const ARC_R      = GLOBE_R + rem * 0.56;
        const ARC_STROKE = rem * 0.12;
        const TICK_SPAN  = rem * 0.2;

        // Laurel arcs — reveal bottom→top via clip mask
        if (this.arcReveal > 0) {
          const arcBottom = sCY + ARC_R + TICK_SPAN + 10;
          const arcTop    = sCY - ARC_R - TICK_SPAN - 10;
          const clipTop   = arcBottom - this.arcReveal * (arcBottom - arcTop);

          fCtx.save();
          fCtx.beginPath();
          fCtx.rect(0, clipTop, this.W, arcBottom - clipTop + 10);
          fCtx.clip();

          fCtx.strokeStyle = color;
          fCtx.lineWidth   = ARC_STROKE;
          fCtx.lineCap     = 'round';

          fCtx.beginPath();
          fCtx.arc(sCX, sCY, ARC_R, Math.PI * 0.62, Math.PI * 1.18, false);
          fCtx.stroke();
          this._drawArcTick(fCtx, sCX, sCY, ARC_R, Math.PI * 0.62,  0.07, TICK_SPAN, ARC_STROKE);
          this._drawArcTick(fCtx, sCX, sCY, ARC_R, Math.PI * 1.18, -0.07, TICK_SPAN, ARC_STROKE);

          fCtx.beginPath();
          fCtx.arc(sCX, sCY, ARC_R, Math.PI * 1.82, Math.PI * 2.38, false);
          fCtx.stroke();
          this._drawArcTick(fCtx, sCX, sCY, ARC_R, Math.PI * 1.82,  0.07, TICK_SPAN, ARC_STROKE);
          this._drawArcTick(fCtx, sCX, sCY, ARC_R, Math.PI * 2.38, -0.07, TICK_SPAN, ARC_STROKE);

          fCtx.restore();
        }

        // Plinth — width grows from center outward
        if (this.plinthReveal > 0) {
          const PLINTH_GAP    = rem * 0.44;
          const PLINTH_Y      = sCY + GLOBE_R + PLINTH_GAP;
          const PLINTH_W      = GLOBE_R * 1.2 * this.plinthReveal;
          const PLINTH_H      = rem * 0.36;
          const PLINTH_STEP_W = GLOBE_R * 0.85 * this.plinthReveal;
          const PLINTH_STEP_H = rem * 0.22;

          fCtx.fillStyle = color;
          fCtx.fillRect(sCX - PLINTH_STEP_W/2, PLINTH_Y,                  PLINTH_STEP_W, PLINTH_STEP_H);
          fCtx.fillRect(sCX - PLINTH_W/2,      PLINTH_Y + PLINTH_STEP_H,  PLINTH_W,      PLINTH_H);
        }
      }

      _drawArcTick(o, cx, cy, r, angle, dAngle, tickSpan, lineWidth) {
        const innerR = r - tickSpan, outerR = r + tickSpan;
        const x1 = cx + innerR * Math.cos(angle),        y1 = cy + innerR * Math.sin(angle);
        const x2 = cx + outerR * Math.cos(angle+dAngle), y2 = cy + outerR * Math.sin(angle+dAngle);
        o.lineWidth = lineWidth;
        o.beginPath(); o.moveTo(x1,y1); o.lineTo(x2,y2); o.stroke();
      }

      _renderGlobe() {
        if (!this.globeReady) return;
        const { W, H, DPR } = this;
        const rem        = this._rem || 50;
        const GLOBE_R_FULL = Math.min(W, H) * 0.36 * 0.8;
        const GLOBE_R    = GLOBE_R_FULL * this.globeRevealScale;  // scale from 0
        if (GLOBE_R < 0.5) return null;

        // X position lerps from center → right
        const GLOBE_CX   = this.sCX + (W * 0.712 - this.sCX) * this.globeRevealX;
        const GLOBE_CY   = this.sCY - rem * 0.6;
        const FOCAL      = H * 1.1;
        const fCtx       = this.fCtx;

        fCtx.clearRect(0, 0, W*DPR, H*DPR);
        fCtx.save();
        fCtx.scale(DPR, DPR);
        fCtx.fillStyle = 'white';

        const cosA = Math.cos(this.globeAngle), sinA = Math.sin(this.globeAngle);
        const cosT = Math.cos(this.GLOBE_TILT),  sinT = Math.sin(this.GLOBE_TILT);

        this.shapeMinX = GLOBE_CX - GLOBE_R_FULL - 10;
        this.shapeMaxX = GLOBE_CX + GLOBE_R_FULL + 10;
        this._globeCY  = GLOBE_CY;
        this._globeCX  = GLOBE_CX;

        this.globeCountries.forEach(ring => {
          const pts = [];
          let anyVisible = false;
          for (let i = 0; i < ring.length; i++) {
            const [lon, lat] = ring[i];
            const phi = (90 - lat) * Math.PI / 180;
            const theta = lon * Math.PI / 180;
            let x = Math.sin(phi)*Math.cos(theta);
            let y = Math.cos(phi);
            let z = Math.sin(phi)*Math.sin(theta);
            const x1 = x*cosA + z*sinA, z1 = -x*sinA + z*cosA;
            const y2 = y*cosT - z1*sinT, z2 = y*sinT + z1*cosT;
            const rx = x1*GLOBE_R, ry = y2*GLOBE_R, rz = z2*GLOBE_R;
            const s  = FOCAL / (FOCAL + rz + 300);
            const sx = GLOBE_CX + rx * s;
            const sy = GLOBE_CY + ry * s;
            const behind = rz < -GLOBE_R * 0.1;
            pts.push({ sx, sy, behind });
            if (!behind) anyVisible = true;
          }
          if (!anyVisible) return;

          fCtx.beginPath();
          let penDown = false;
          pts.forEach(({ sx, sy, behind }) => {
            if (behind) { penDown = false; return; }
            if (!penDown) { fCtx.moveTo(sx, sy); penDown = true; }
            else fCtx.lineTo(sx, sy);
          });
          if (penDown) fCtx.closePath();
          fCtx.fill();
        });

        fCtx.restore();

        fCtx.save();
        fCtx.scale(DPR, DPR);
        this._drawGlobeDecor(fCtx, GLOBE_R_FULL, GLOBE_CY, GLOBE_CX);
        fCtx.restore();

        return GLOBE_R_FULL;
      }

      _drawGlobeLines(GLOBE_R) {
        if (!this.globeReady) return;
        const { W, H, DPR, COLS, COL_W, LINE_GAP, RADIUS, THRESHOLD } = this;
        const data    = this.fCtx.getImageData(0, 0, W*DPR, H*DPR);
        const stride  = Math.round(W * DPR);
        const globeCY = this._globeCY || this.sCY;
        const globeCX = this._globeCX || this.sCX;

        const getAlpha = (x, y) => {
          const px = Math.round(Math.max(0, Math.min(W*DPR-1, x*DPR)));
          const py = Math.round(Math.max(0, Math.min(H*DPR-1, y*DPR)));
          return data.data[(py*stride+px)*4+3] / 255;
        };

        const getSegments = (colX, colEnd, y) => {
          const segs = []; let inSeg = false, start = -1;
          for (let px = colX; px <= colEnd; px++) {
            const a = getAlpha(px, y);
            if (a > THRESHOLD && !inSeg)      { inSeg = true;  start = px; }
            else if (a <= THRESHOLD && inSeg) { inSeg = false; segs.push([start, px-1]); }
          }
          if (inSeg) segs.push([start, colEnd]);
          return segs;
        };

        for (let col = 0; col < COLS; col++) {
          const colX = this.colXCache[col], colEnd = colX + COL_W;
          if (colEnd < this.shapeMinX || colX > this.shapeMaxX) continue;
          for (let y = 0; y <= H; y += LINE_GAP) {
            const segs = getSegments(colX, colEnd, y);
            segs.forEach(([lx, rx]) => {
              if (rx - lx < 4) return;
              const midX = (lx + rx) / 2;
              const ndx  = (midX - globeCX) / GLOBE_R;
              const ndy  = (y    - globeCY) / GLOBE_R;
              const dist = Math.sqrt(ndx*ndx + ndy*ndy);
              const t    = Math.max(0, 1 - dist * 0.9);
              const lh   = dist >= 1.0
                ? 3
                : this.MIN_H + t * (this.MAX_H - this.MIN_H);
              this.ctx.fillStyle = `rgba(${this.LINE_COLOR},1)`;
              this._drawRoundedBottom(lx, y, rx-lx, lh, RADIUS);
            });
          }
        }
      }

      // =========================================================================
      // MAIN LOOP
      // =========================================================================

      _tick(ts) {
        if(this.lastTs!==null) this.waveTime+=(ts-this.lastTs)/1000;
        this.lastTs=ts;
        this.angle+=0.009;

        const {W,H,DPR,COLS,COL_W,GAP,LINE_GAP,LINES,RADIUS,
               SIZE_RATIO,TRAIL_LEN,LERP,BG_OPACITY,VEL_DECAY,VEL_SCALE} = this;
        const BG_OPACITY_LINE = this.LINE_COLOR;
        const SIZE=H*SIZE_RATIO, FOCAL=H*1.1;
        const ctx=this.ctx;

        if(this.targetX>=0){
          this.smoothX+=(this.targetX-this.smoothX)*LERP;
          this.smoothY+=(this.targetY-this.smoothY)*LERP;
          if(this.prevSmoothX>=0){
            const dx=this.smoothX-this.prevSmoothX, dy=this.smoothY-this.prevSmoothY;
            this.velocity+=(Math.sqrt(dx*dx+dy*dy)-this.velocity)*0.2;
          }
          this.prevSmoothX=this.smoothX; this.prevSmoothY=this.smoothY;
        }
        this.velocity*=VEL_DECAY;
        const velStrength=Math.min(this.velocity*VEL_SCALE,1);

        if(velStrength>0.01&&this.smoothX>=0){
          this.trail.push({x:this.smoothX,y:this.smoothY,v:velStrength});
          if(this.trail.length>TRAIL_LEN) this.trail.shift();
        } else {
          if(this.trail.length>0) this.trail.shift();
        }

        this.trail.forEach((pt,ti)=>{
          const strength=Math.pow(ti/this.trail.length,2)*pt.v;
          for(let col=0;col<COLS;col++){
            const colMid=this.colXCache[col]+COL_W/2;
            const colDist=Math.abs(pt.x-colMid)/(COL_W+GAP);
            const cf=Math.exp(-colDist*colDist*1.5);
            if(cf<0.01) continue;
            const li0=Math.round(pt.y/LINE_GAP);
            for(let li=li0-2;li<=li0+2;li++){
              if(li<0||li>=LINES) continue;
              const lf=Math.exp(-Math.pow((li-li0)/2,2)*4);
              this.energy[col][li]=Math.max(this.energy[col][li],strength*cf*lf);
            }
          }
        });

        for(let col=0;col<COLS;col++)
          for(let li=0;li<LINES;li++)
            this.energy[col][li]*=0.65;

        let getAlpha=()=>0;
        if(this.foregroundType==='cube'){
          this._renderCube(SIZE,FOCAL);
          const data=this.fCtx.getImageData(0,0,W*DPR,H*DPR);
          const stride=W*DPR;
          getAlpha=(x,y)=>{
            const px=Math.round(Math.max(0,Math.min(W*DPR-1,x*DPR)));
            const py=Math.round(Math.max(0,Math.min(H*DPR-1,y*DPR)));
            return data.data[(py*stride+px)*4+3]/255;
          };
        }

        ctx.fillStyle=this.BG_COLOR; ctx.fillRect(0,0,W,H);

        const fracCol     =this.smoothX>=0?this._getFracCol(this.smoothX):-1;
        const hoverLineIdx=this.smoothY>=0?this.smoothY/LINE_GAP:-1;

        for(let col=0;col<COLS;col++){
          const colX=this.colXCache[col];
          const xMul=(fracCol>=0&&velStrength>0.01)
            ?Math.exp(-Math.pow(col-fracCol,2)*1.2)*velStrength:0;

          let y=0,li=0;
          while(y<=H){
            const e=this.energy[col][li]||0;

            ctx.fillStyle=`rgba(${BG_OPACITY_LINE},${BG_OPACITY})`;
            this._drawRoundedBottom(colX,y,COL_W,1,RADIUS);

            if(e>0.01){
              ctx.fillStyle=`rgba(${BG_OPACITY_LINE},1)`;
              this._drawRoundedBottom(colX,y,COL_W,1+e*4,RADIUS);
            } else if(xMul>0.02&&hoverLineIdx>=0){
              const yDist=li-hoverLineIdx;
              const yMul=Math.exp(-yDist*yDist*1.2);
              const influence=xMul*yMul;
              if(influence>0.02){
                const w=COL_W*(0.2+xMul*0.8);
                const colDiff=col-fracCol;
                let xOff;
                if(colDiff<-0.3)      xOff=COL_W-w;
                else if(colDiff>0.3)  xOff=0;
                else                  xOff=(COL_W-w)+((colDiff+0.3)/0.6)*(-(COL_W-w));
                ctx.fillStyle=`rgba(${BG_OPACITY_LINE},1)`;
                this._drawRoundedBottom(colX+xOff,y,w,1+influence*3,RADIUS);
              }
            }
            y+=LINE_GAP; li++;
          }
        }

        if(this.foregroundType==='cube')    this._drawCubeLines(getAlpha,SIZE);
        if(this.foregroundType==='rhombus') this._drawRhombus();
        if(this.foregroundType==='flip')    this._drawFlipLines();
        if(this.foregroundType==='gyro') {
          const gr = this._renderGyro();
          if (gr) this._drawGyroLines(gr);
        }
        if(this.foregroundType==='globe') {
          this._currentGlobeSpeed = this._currentGlobeSpeed || this.GLOBE_SPEED;
          this._currentGlobeSpeed += (this.GLOBE_SPEED - this._currentGlobeSpeed) * 0.05;
          this.globeAngle += this._currentGlobeSpeed;
          const gr = this._renderGlobe();
          if (gr) this._drawGlobeLines(gr);
        }

        this._rafId=requestAnimationFrame((ts)=>this._tick(ts));
      }

      destroy() {
        cancelAnimationFrame(this._rafId);
        this.canvas.removeEventListener('mousemove',  this._onMouseMove);
        this.canvas.removeEventListener('mouseleave', this._onMouseLeave);
        window.removeEventListener('resize', this._onResize);
        this.canvas.remove();
        LineGrid._instances.delete(this);
      }
    }

    // Static instance registry
    LineGrid._instances = new Set();

    // Refresh colors on all active instances at once.
    LineGrid.refreshAll = () => {
      LineGrid._instances.forEach(instance => instance.refreshColors());
    };


    // =========================================================================
    // SECTION 3: CANVAS INSTANCES
    // bgColor / lineColor accept a CSS var name ('--dark') or a hex value ('#222').
    // To update colors on scroll/interaction: LineGrid.refreshAll()
    // Globe scroll velocity: grid1.GLOBE_SPEED = BASE + velocity
    // =========================================================================

    // Canvas 1 — rotating globe (right-aligned), laurel arcs + plinth
    const grid1 = new LineGrid('#section-1', {
      foregroundType: 'globe',
      bgColor:        '--dark',
      lineColor:      '--white',
    });

    // Canvas 2 — gyroscope rings
    // Reveal sequence:
    //   const tl = gsap.timeline({ paused: true });
    //   tl.to(grid2, { gyroScale: 1, duration: 0.8, ease: 'power2.out' })
    //     .to(grid2, { gyroReveal: 1, duration: 1.2, ease: 'power2.inOut' });
    //   ScrollTrigger.create({ trigger: '.product-info', start: 'top 50%', once: true, onEnter: () => tl.play() });
    const grid2 = new LineGrid('#section-2', {
      foregroundType: 'gyro',
      bgColor:        '--dark',
      lineColor:      '--white',
    });

    // Canvas 3 — animated rhombus
    // Reveal: gsap.to(grid3, { revealProgress: 1, duration: 1.2, ease: 'power2.out' })
    const grid3 = new LineGrid('#section-3', {
      foregroundType: 'rhombus',
      waveSpeed:      0.3,
      shapePath:      'M725.428 303.293L1139.5 385.002L725.428 466.714L310.496 385.001L725.428 303.293Z',
      shapeViewBox:   { w: 1450, h: 770 },
      bgColor:        '--dark',   // ← manually set
      lineColor:      '--white',  // ← manually set
    });

    // Canvas 4 — background + hover only
    new LineGrid('#section-4', {
      foregroundType: null,
      bgColor:        '--white',
      lineColor:      '--dark',
    });
