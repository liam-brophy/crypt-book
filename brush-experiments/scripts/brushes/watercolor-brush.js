// watercolor-brush.js - Creates a watercolor-like brush effect
class WatercolorBrush extends BaseBrush {
    constructor(ctx, size, color) {
        super(ctx, size, color);
        this.stepDistance = 1;
        this.splatter = [];
        // Create color variations by adjusting opacity/lightness
        this.baseColor = this.color;
        this.colorVariations = this.createColorVariations();
    }
    
    createColorVariations() {
        // Convert hex to RGB for easier manipulation
        const r = parseInt(this.baseColor.substring(1, 3), 16);
        const g = parseInt(this.baseColor.substring(3, 5), 16);
        const b = parseInt(this.baseColor.substring(5, 7), 16);
        
        const variations = [];
        
        // Create several variations with different alpha values
        for (let i = 0; i < 5; i++) {
            // Slightly adjust the color
            const variationR = Math.min(255, Math.max(0, r + this.getRandom(-20, 20)));
            const variationG = Math.min(255, Math.max(0, g + this.getRandom(-20, 20)));
            const variationB = Math.min(255, Math.max(0, b + this.getRandom(-20, 20)));
            
            // Convert back to hex
            const hexColor = '#' + 
                Math.floor(variationR).toString(16).padStart(2, '0') +
                Math.floor(variationG).toString(16).padStart(2, '0') +
                Math.floor(variationB).toString(16).padStart(2, '0');
            
            variations.push({
                color: hexColor,
                alpha: this.getRandom(0.1, 0.4)
            });
        }
        
        return variations;
    }
    
    startStroke(x, y) {
        // Reset splatter array
        this.splatter = [];
        this.colorVariations = this.createColorVariations();
        this.createInitialSplatter(x, y);
    }
    
    createInitialSplatter(x, y) {
        // Create initial water drops/splatters around the starting point
        const dropCount = Math.floor(this.size / 2);
        
        for (let i = 0; i < dropCount; i++) {
            const distance = this.getRandom(0, this.size * 1.5);
            const angle = this.getRandom(0, Math.PI * 2);
            
            const dropX = x + Math.cos(angle) * distance;
            const dropY = y + Math.sin(angle) * distance;
            const dropSize = this.getRandom(this.size * 0.2, this.size * 0.8);
            
            // Select random color variation
            const colorIndex = Math.floor(Math.random() * this.colorVariations.length);
            
            this.splatter.push({
                x: dropX,
                y: dropY,
                size: dropSize,
                colorVariation: colorIndex,
                spread: this.getRandom(0, 0.5)
            });
        }
    }
    
    draw(fromX, fromY, toX, toY) {
        const distance = this.getDistance(fromX, fromY, toX, toY);
        const angle = Math.atan2(toY - fromY, toX - fromX);
        
        const steps = Math.max(Math.floor(distance / this.stepDistance), 1);
        
        // Main stroke
        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            const x = fromX + (toX - fromX) * t;
            const y = fromY + (toY - fromY) * t;
            
            // Draw main watercolor blob
            this.ctx.save();
            
            // Use multiple overlapping circles with different colors and opacities
            for (let j = 0; j < this.colorVariations.length; j++) {
                const variation = this.colorVariations[j];
                const sizeVariation = this.size * this.getRandom(0.8, 1.2);
                
                this.ctx.globalAlpha = variation.alpha;
                this.ctx.fillStyle = variation.color;
                
                this.ctx.beginPath();
                this.ctx.arc(
                    x + this.getRandom(-3, 3), 
                    y + this.getRandom(-3, 3), 
                    sizeVariation / 2, 
                    0, 
                    Math.PI * 2
                );
                this.ctx.fill();
            }
            
            this.ctx.restore();
            
            // Occasionally add a new splatter
            if (Math.random() < 0.05 && distance > 10) {
                const dropDistance = this.getRandom(0, this.size * 2);
                const dropAngle = angle + this.getRandom(-Math.PI/4, Math.PI/4);
                
                const dropX = x + Math.cos(dropAngle) * dropDistance;
                const dropY = y + Math.sin(dropAngle) * dropDistance;
                const dropSize = this.getRandom(this.size * 0.1, this.size * 0.4);
                
                // Select random color variation
                const colorIndex = Math.floor(Math.random() * this.colorVariations.length);
                
                this.splatter.push({
                    x: dropX,
                    y: dropY,
                    size: dropSize,
                    colorVariation: colorIndex,
                    spread: this.getRandom(0, 0.3)
                });
            }
        }
        
        // Draw all splatters
        this.drawSplatter();
    }
    
    drawSplatter() {
        // Draw all individual splatter drops
        for (let i = 0; i < this.splatter.length; i++) {
            const drop = this.splatter[i];
            const variation = this.colorVariations[drop.colorVariation];
            
            // Make drops spread/grow over time
            drop.size += drop.spread;
            
            this.ctx.save();
            this.ctx.globalAlpha = variation.alpha * this.getRandom(0.5, 1.0);
            this.ctx.fillStyle = variation.color;
            
            this.ctx.beginPath();
            this.ctx.arc(drop.x, drop.y, drop.size / 2, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.restore();
        }
    }
    
    endStroke() {
        // Final render of all splatters
        this.drawSplatter();
    }
    
    setColor(color) {
        super.setColor(color);
        this.baseColor = color;
        this.colorVariations = this.createColorVariations();
    }
}