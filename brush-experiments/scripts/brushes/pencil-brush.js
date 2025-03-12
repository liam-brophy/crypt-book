// pencil-brush.js - Simulates a pencil drawing effect
class PencilBrush extends BaseBrush {
    constructor(ctx, size, color) {
        super(ctx, size, color);
        this.pressure = 1.0; // Simulated pressure
        this.thinning = 0.5; // How much the line thins based on speed
        this.points = []; // Track recent points for smoother lines
        this.maxPoints = 10; // Max number of points to track
        this.velocity = 0; // Current drawing velocity
    }
    
    startStroke(x, y) {
        // Clear previous points
        this.points = [];
        this.addPoint(x, y, 1);
        
        // Draw initial dot
        this.ctx.save();
        this.ctx.globalAlpha = 0.7;
        this.ctx.fillStyle = this.color;
        this.ctx.beginPath();
        this.ctx.arc(x, y, this.size / 4, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
    }
    
    addPoint(x, y, pressure) {
        // Add point to the array
        this.points.push({ x, y, pressure });
        
        // Keep only the most recent points
        if (this.points.length > this.maxPoints) {
            this.points.shift();
        }
    }
    
    updateVelocity(fromX, fromY, toX, toY) {
        // Calculate drawing speed
        const distance = this.getDistance(fromX, fromY, toX, toY);
        this.velocity = Math.min(distance / 5, 10); // Cap velocity
        
        // Update pressure based on velocity
        this.pressure = Math.max(0.2, 1 - (this.thinning * this.velocity / 10));
    }
    
    draw(fromX, fromY, toX, toY) {
        // Update velocity and pressure
        this.updateVelocity(fromX, fromY, toX, toY);
        
        // Add the new point
        this.addPoint(toX, toY, this.pressure);
        
        // Need at least 2 points to draw
        if (this.points.length < 2) return;
        
        // Begin a new path
        this.ctx.save();
        
        // Set up the drawing style
        this.ctx.strokeStyle = this.color;
        this.ctx.lineWidth = this.size * this.pressure;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        
        // Apply a slight transparency
        this.ctx.globalAlpha = 0.8;
        
        // Draw the main line
        this.ctx.beginPath();
        
        // Start from the second-to-last point to avoid a gap
        const lastPoint = this.points[this.points.length - 2];
        this.ctx.moveTo(lastPoint.x, lastPoint.y);
        this.ctx.lineTo(toX, toY);
        this.ctx.stroke();
        
        // Create pencil texture effect
        this.drawPencilTexture(lastPoint.x, lastPoint.y, toX, toY);
        
        this.ctx.restore();
    }
    
    drawPencilTexture(fromX, fromY, toX, toY) {
        // Draw some "graphite" specks along the line
        const distance = this.getDistance(fromX, fromY, toX, toY);
        const angle = Math.atan2(toY - fromY, toX - fromX);
        
        // Skip if distance is too small
        if (distance < 1) return;
        
        // Number of texture points based on distance
        const numPoints = Math.ceil(distance / 2);
        
        // Size of the texture points based on brush size and pressure
        const maxSize = this.size * this.pressure * 0.3;
        
        // Draw texture points along the line
        for (let i = 0; i < numPoints; i++) {
            const t = i / numPoints;
            const x = fromX + (toX - fromX) * t;
            const y = fromY + (toY - fromY) * t;
            
            // Add some randomness to position
            const spreadFactor = this.size * 0.3 * this.pressure;
            const offsetX = this.getRandom(-spreadFactor, spreadFactor);
            const offsetY = this.getRandom(-spreadFactor, spreadFactor);
            
            // Random size for texture point
            const pointSize = this.getRandom(0.1, maxSize);
            
            // Random opacity for more realistic look
            this.ctx.globalAlpha = this.getRandom(0.1, 0.3);
            
            // Draw the texture point
            this.ctx.beginPath();
            this.ctx.arc(x + offsetX, y + offsetY, pointSize, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }
    
    endStroke() {
        // Reset points array
        this.points = [];
    }
}