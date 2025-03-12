// living-brush.js - A brush that animates after drawing
class LivingBrush extends BaseBrush {
    constructor(ctx, size, color) {
        super(ctx, size, color);
        this.points = [];
        this.activePoints = [];
        this.isAnimating = false;
        this.lifespan = 300; // How long points live in frames
        
        // Animation properties
        this.gravity = 0.05;
        this.wind = 0.02;
        this.evaporationRate = 0.993; // 0.7% reduction per frame
        
        // Bind animation method to maintain context
        this.animate = this.animate.bind(this);
        this.animationId = null;
    }
    
    startStroke(x, y) {
        // Clear previous points
        this.points = [];
        this.addPoint(x, y);
    }
    
    addPoint(x, y) {
        // Add a point to the stroke
        this.points.push({
            x: x,
            y: y,
            size: this.size * this.getRandom(0.8, 1.2),
            alpha: this.getRandom(0.7, 1.0),
            color: this.color,
            // Properties for animation
            vx: 0,
            vy: 0,
            life: this.lifespan,
            originalSize: this.size * this.getRandom(0.8, 1.2)
        });
    }
    
    draw(fromX, fromY, toX, toY) {
        const distance = this.getDistance(fromX, fromY, toX, toY);
        const angle = Math.atan2(toY - fromY, toX - fromX);
        
        // Add intermediate points based on distance
        const stepSize = Math.min(this.size / 4, 5);
        const steps = Math.max(Math.floor(distance / stepSize), 1);
        
        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            const x = fromX + (toX - fromX) * t;
            const y = fromY + (toY - fromY) * t;
            
            // Add slight randomness to point position
            const jitter = this.size / 10;
            const jitteredX = x + this.getRandom(-jitter, jitter);
            const jitteredY = y + this.getRandom(-jitter, jitter);
            
            this.addPoint(jitteredX, jitteredY);
        }
        
        // Draw the current stroke
        this.drawPoints();
    }
    
    drawPoints() {
        // Draw all stored points
        for (const point of this.points) {
            this.ctx.save();
            this.ctx.globalAlpha = point.alpha;
            this.ctx.fillStyle = point.color;
            this.ctx.beginPath();
            this.ctx.arc(point.x, point.y, point.size / 2, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        }
    }
    
    endStroke() {
        // When stroke ends, prepare for animation
        if (this.points.length === 0) return;
        
        // Initialize velocities and activate the points
        this.activePoints = this.points.map(point => {
            return {
                ...point,
                // Add random initial velocities
                vx: this.getRandom(-0.5, 0.5),
                vy: this.getRandom(-1, 0),
            };
        });
        
        // Clear the drawing points array as we've transferred them to activePoints
        this.points = [];
        
        // Start the animation if it's not already running
        if (!this.isAnimating) {
            this.isAnimating = true;
            this.animationId = requestAnimationFrame(this.animate);
        }
    }
    
    animate() {
        // If no active points or animation stopped, exit
        if (this.activePoints.length === 0 || !this.isAnimating) {
            this.isAnimating = false;
            return;
        }
        
        // Clear only the areas where our points are
        for (const point of this.activePoints) {
            this.ctx.clearRect(
                point.x - point.size/2 - 2, 
                point.y - point.size/2 - 2, 
                point.size + 4, 
                point.size + 4
            );
        }
        
        // Update and draw active points
        const remainingPoints = [];
        
        for (const point of this.activePoints) {
            // Update life
            point.life--;
            
            // Apply physics
            point.vy += this.gravity;  // Gravity
            point.vx += (Math.random() - 0.5) * this.wind; // Random wind
            
            // Update position
            point.x += point.vx;
            point.y += point.vy;
            
            // Evaporation: reduce size gradually
            point.size *= this.evaporationRate;
            
            // Calculate alpha based on remaining life
            point.alpha = (point.life / this.lifespan) * 0.8;
            
            // Keep if still alive and visible
            if (point.life > 0 && point.size > 0.5) {
                // Draw the point
                this.ctx.save();
                this.ctx.globalAlpha = point.alpha;
                this.ctx.fillStyle = point.color;
                this.ctx.beginPath();
                this.ctx.arc(point.x, point.y, point.size / 2, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.restore();
                
                // Keep this point for next frame
                remainingPoints.push(point);
            }
        }
        
        // Update the active points array
        this.activePoints = remainingPoints;
        
        // Continue animation if points remain
        if (this.activePoints.length > 0) {
            this.animationId = requestAnimationFrame(this.animate);
        } else {
            this.isAnimating = false;
        }
    }
    
    // Call this when switching brushes or clearing canvas
    stopAnimation() {
        this.isAnimating = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        this.activePoints = [];
    }
}