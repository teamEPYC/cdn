class SmoothCorners {
    static get inputProperties() {
        return ['--smooth-radius'];
    }

    paint(ctx, geom, properties) {
        const radius = parseFloat(properties.get('--smooth-radius')) || 20;
        const width = geom.width;
        const height = geom.height;

        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.moveTo(radius, 0);
        ctx.arcTo(width, 0, width, height, radius);
        ctx.arcTo(width, height, 0, height, radius);
        ctx.arcTo(0, height, 0, 0, radius);
        ctx.arcTo(0, 0, width, 0, radius);
        ctx.closePath();
        ctx.fill();
    }
}

registerPaint('smooth-corners', SmoothCorners);
