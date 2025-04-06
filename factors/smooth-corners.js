
          const drawSquircle = (ctx, geom, corners, radius, smooth, lineWidth, color) => {
            const defaultFill = color;
            const lineWidthOffset = lineWidth / 2;

            // OPEN LEFT-TOP CORNER
            ctx.beginPath();
            // ctx.lineTo(radius, lineWidthOffset);

            // TOP-RIGHT CORNER
            if (corners.has('top-right')) {
              ctx.lineTo(geom.width - radius, lineWidthOffset);
              ctx.bezierCurveTo(
                geom.width - radius / smooth,
                lineWidthOffset, // first bezier point
                geom.width - lineWidthOffset,
                radius / smooth, // second bezier point
                geom.width - lineWidthOffset,
                radius // last connect point
                );
            } else {
              ctx.lineTo(geom.width - lineWidthOffset, lineWidthOffset);
            }

            // BOTTOM-RIGHT CORNER
            if (corners.has('bottom-right')) {
              ctx.lineTo(geom.width - lineWidthOffset, geom.height - radius);
              ctx.bezierCurveTo(
                geom.width - lineWidthOffset,
                geom.height - radius / smooth, // first bezier point
                geom.width - radius / smooth,
                geom.height - lineWidthOffset, // second bezier point
                geom.width - radius,
                geom.height - lineWidthOffset // last connect point
              );
            } else {
              ctx.lineTo(geom.width - lineWidthOffset, geom.height - lineWidthOffset);
            }

            // BOTTOM-LEFT CORNER
            if (corners.has('bottom-left')) {
              ctx.lineTo(radius, geom.height - lineWidthOffset);
              ctx.bezierCurveTo(
                radius / smooth,
                geom.height - lineWidthOffset, // first bezier point
                lineWidthOffset,
                geom.height - radius / smooth, // second bezier point
                lineWidthOffset,
                geom.height - radius // last connect point
              );
            } else {
              ctx.lineTo(lineWidthOffset, geom.height - lineWidthOffset);
            }

            // CLOSE LEFT-TOP CORNER
            if (corners.has('top-left')) {
              ctx.lineTo(lineWidthOffset, radius);
              ctx.bezierCurveTo(
                lineWidthOffset,
                radius / smooth, // first bezier point
                radius / smooth,
                lineWidthOffset, // second bezier point
                radius,
                lineWidthOffset // last connect point
              );
            } else {
              ctx.lineTo(lineWidthOffset, lineWidthOffset);
            }

            ctx.closePath();
          
            if (lineWidth) {
              ctx.strokeStyle = defaultFill;
              ctx.lineWidth = lineWidth;
              ctx.stroke();
            } else {
              ctx.fillStyle = defaultFill;
              ctx.fill();
            }
          };
          
          if (typeof registerPaint !== "undefined") {
            class SquirclePainter {
              static get contextOptions() {
                return { alpha: true };
              }
              static get inputProperties() {
                return [
                  "--squircle-radius",
                  "--squircle-smooth",
                  "--squircle-outline",
                  "--squircle-fill",
                  "--squircle-ratio",
                  "--squircle-corners",
                ];
              }
          
              paint(ctx, geom, properties) {
                const customRatio = properties.get("--squircle-ratio");
                const smoothRatio = 10;
                const distanceRatio = parseFloat(customRatio)
                  ? parseFloat(customRatio)
                  : 1.8;
                const squircleSmooth = parseFloat(
                  properties.get("--squircle-smooth") * smoothRatio
                );
                const squircleRadius =
                  parseInt(properties.get("--squircle-radius"), 10) * distanceRatio;
                const squrcleOutline = parseFloat(
                  properties.get("--squircle-outline"),
                  10
                );
                const squircleColor = properties
                  .get("--squircle-fill")
                  .toString()
                  .replace(/s/g, "");
          
                const isSmooth = () => {
                  if (typeof properties.get("--squircle-smooth")[0] !== "undefined") {
                    if (squircleSmooth === 0) {
                      return 1;
                    }
                    return squircleSmooth;
                  } else {
                    return 10;
                  }
                };
          
                const isOutline = () => {
                  if (squrcleOutline) {
                    return squrcleOutline;
                  } else {
                    return 0;
                  }
                };
          
                const isColor = () => {
                  if (squircleColor) {
                    return squircleColor;
                  } else {
                    return "#2f2f2f";
                  }
                };

                const corners = new Set(properties.get('--squircle-corners')?.[0]?.split(' '));
          
                if (squircleRadius < geom.width / 2 && squircleRadius < geom.height / 2) {
                  drawSquircle(
                    ctx,
                    geom,
                    corners,
                    squircleRadius,
                    isSmooth(),
                    isOutline(),
                    isColor()
                  );
                } else {
                  drawSquircle(
                    ctx,
                    geom,
                    corners,
                    Math.min(geom.width / 2, geom.height / 2),
                    isSmooth(),
                    isOutline(),
                    isColor()
                  );
                }
              }
            }
  
            registerPaint("squircle", SquirclePainter);
          }
          
