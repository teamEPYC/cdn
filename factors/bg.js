// Check if device supports hover and has sufficient screen width
function shouldInitializeAnimation() {
  const hasHover = window.matchMedia('(hover: hover)').matches;
  const isLargeScreen = window.matchMedia('(min-width: 992px)').matches;
  return hasHover && isLargeScreen;
}

if (shouldInitializeAnimation()) {
  let sketch_bg = (p_bg) => {
    let force = 0.9, persistence = 0.01, power = 0.15;
    let gridSpacing = 25;
    let trailLength = 20;
    let points = [], rows = [], cols = [];
    let isMouseMoving = false, mouseMoveTimeout;
    let canvas, container, resizeObserver;
    
    p_bg.setup = () => {
      container = document.getElementById('p5-bg-container');
      canvas = p_bg.createCanvas(container.offsetWidth, container.offsetHeight);
      canvas.parent('p5-bg-container');
      
      canvas.style('width', '100%');
      canvas.style('height', '100%');
      canvas.style('display', 'block');
      canvas.style('position', 'relative');
      
      setupResizeObserver();
      createGrid(); 
      p_bg.stroke(155); 
      p_bg.strokeWeight(1); 
      p_bg.background(26, 26, 26); 
      drawGrid(rows);
      drawGrid(cols); 
    };
    
    const setupResizeObserver = () => {
      resizeObserver = new ResizeObserver(entries => {
        clearTimeout(p_bg.resizeTimeout);
        p_bg.resizeTimeout = setTimeout(() => {
          const containerWidth = entries[0].contentRect.width;
          const containerHeight = entries[0].contentRect.height;
          
          if (p_bg.width !== containerWidth || p_bg.height !== containerHeight) {
            p_bg.resizeCanvas(containerWidth, containerHeight);
            createGrid();
            p_bg.background(26, 26, 26);
            drawGrid(rows);
            drawGrid(cols);
            p_bg.loop();
          }
        }, 100);
      });
      
      resizeObserver.observe(container);
    };
    
    p_bg.draw = () => {
      if (!isMouseMoving && allPointsAtRest()) {
        p_bg.noLoop();
        return;
      }
      
      p_bg.background(26, 26, 26, 100 - trailLength);
      
      if (isMouseMoving) {
        distort();
      }
      
      updatePoints();
      drawGrid(rows);
      drawGrid(cols);
    };
    
    const updatePoints = () => {
      for (let i = 0; i < points.length; i++) {
        points[i].update();
      }
    };
    
    p_bg.mouseMoved = () => {
      if (p_bg.mouseX < 0 || p_bg.mouseX > p_bg.width || 
          p_bg.mouseY < 0 || p_bg.mouseY > p_bg.height) {
        return;
      }
      
      if (!isMouseMoving) {
        isMouseMoving = true;
        p_bg.loop();
      }
      
      clearTimeout(mouseMoveTimeout);
      mouseMoveTimeout = setTimeout(() => {
        isMouseMoving = false; 
      }, 200);
    };
    
    p_bg.windowResized = () => {
      if (container && !resizeObserver) {
        clearTimeout(p_bg.resizeTimeout);
        p_bg.resizeTimeout = setTimeout(() => {
          p_bg.resizeCanvas(container.offsetWidth, container.offsetHeight);
          createGrid();
          p_bg.background(26, 26, 26);
          drawGrid(rows);
          drawGrid(cols);
          p_bg.loop();
        }, 100);
      }
    };
    
    const allPointsAtRest = () => {
      for (let i = 0; i < points.length; i++) {
        if (points[i].vel.magSq() > 0.001) return false;
      }
      return true;
    };
    
    const distort = () => {
      const mouse = p_bg.createVector(p_bg.mouseX, p_bg.mouseY);
      const threshold = 25;
      const thresholdSq = threshold * threshold;
      
      for (let i = 0; i < points.length; i++) {
        const point = points[i];
        const diff = p5.Vector.sub(point.pos, mouse);
        const distanceSq = diff.magSq();
        
        if (distanceSq > thresholdSq) {
          const distance = Math.sqrt(distanceSq);
          const multi = Math.pow(2, -(distance * power));
          diff.mult(multi);
          point.acc.add(diff);
        }
      }
    };
    
    const createGrid = () => {
      points = [];
      cols = [];
      rows = [];
      
      // Adaptive grid spacing for performance
      let adaptiveSpacing = gridSpacing;
      if (p_bg.width > 1920) {
        adaptiveSpacing = gridSpacing * 1.5;
      } else if (p_bg.width > 1280) {
        adaptiveSpacing = gridSpacing * 1.2;
      }
      
      const gridWidth = Math.ceil(p_bg.width / adaptiveSpacing);
      const gridHeight = Math.ceil(p_bg.height / adaptiveSpacing);
      
      // Performance limit
      const maxGridPoints = 3000;
      const totalPoints = gridWidth * gridHeight;
      
      let finalSpacing = adaptiveSpacing;
      if (totalPoints > maxGridPoints) {
        const scaleFactor = Math.sqrt(totalPoints / maxGridPoints);
        finalSpacing = Math.ceil(adaptiveSpacing * scaleFactor);
      }
      
      const finalGridWidth = Math.ceil(p_bg.width / finalSpacing);
      const finalGridHeight = Math.ceil(p_bg.height / finalSpacing);
      
      // Pre-allocate arrays
      for (let j = 0; j < finalGridHeight; j++) {
        rows[j] = [];
      }
      
      for (let i = 0; i < finalGridWidth; i++) {
        const col = [];
        cols.push(col);
        
        for (let j = 0; j < finalGridHeight; j++) {
          const x = i * finalSpacing;
          const y = j * finalSpacing;
          
          if (x > p_bg.width || y > p_bg.height) {
            continue;
          }
          
          const point = new GridPoint(x, y);
          points.push(point);
          col.push(point);
          rows[j].push(point);
        }
      }
    };
    
    const drawGrid = (grid) => {
      p_bg.stroke(155);
      p_bg.strokeWeight(1);
      
      for (let i = 0; i < grid.length; i++) {
        const row = grid[i];
        for (let j = 0; j < row.length; j++) {
          const point = row[j];
          p_bg.point(point.pos.x, point.pos.y);
        }
      }
    };
    
    class GridPoint {
      constructor(x, y) {
        this.supposed = p_bg.createVector(x, y); 
        this.pos = p_bg.createVector(x, y);
        this.vel = p_bg.createVector(0, 0);
        this.acc = p_bg.createVector(0, 0);
      }
      
      update() {
        const diff = p5.Vector.sub(this.pos, this.supposed);
        const distanceSq = diff.magSq();
        
        if (distanceSq > 0.1) {
          const distance = Math.sqrt(distanceSq);
          diff.mult(distance * (-persistence));
          this.acc.add(diff);
        }
        
        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.vel.mult(force);
        this.acc.set(0, 0);
      }
    }
  };

  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    if (sketch_bg.resizeObserver) {
      sketch_bg.resizeObserver.disconnect();
    }
  });

  new p5(sketch_bg);
}
