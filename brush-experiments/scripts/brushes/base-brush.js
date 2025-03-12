// base-brush.js - Base class for all brushes
class BaseBrush {
    constructor(ctx, size, color) {
        this.ctx = ctx;
        this.size = size;
        this.color = color;
    }
    
    setSize(size) {
        this.size = size;
    }
    
    setColor(color) {
        this.color = color;
    }
    
    // Called when a stroke starts (mousedown)
    startStroke(x, y) {
        // Base implementation does nothing, can be overridden
    }
    
    // Main drawing method - to be implemented by subclasses
    draw(fromX, fromY, toX, toY) {
        throw new Error('Draw method must be implemented by subclasses');
    }
    
    // Called when a stroke ends (mouseup)
    endStroke() {
        // Base implementation does nothing, can be overridden
    }
    
    // Utility function to get random number within range
    getRandom(min, max) {
        return Math.random() * (max - min) + min;
    }
    
    // Utility function to get distance between two points
    getDistance(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }



        // Add to BaseBrush class
    updateAnimation() {
        // Base implementation for animation updates
    }

// Override in specific brushes
// For example, in a "living" brush:
    updateAnimation() {
        for (let point of this.animatedPoints) {
            // Apply physics, growth, or other animated behavior
            point.x += point.velocityX;
            point.y += point.velocityY;
            // Perhaps add decay, growth, or other time-based changes
            point.size *= 0.99; // Slow shrinking
            // Re-draw this point with its updated properties
            this.drawAnimatedPoint(point);
        }
    }
}