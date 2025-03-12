// crayon-brush.js - Crayon-like brush effect based on the original repo
class CrayonBrush extends BaseBrush {
    constructor(ctx, size, color) {
        super(ctx, size, color);
        this.texture = this.createCrayonTexture();
        this.stepDistance = 2; // How far to move before drawing next segment
    }
    
    createCrayonTexture() {
        // Create an off-screen canvas for the crayon texture
        const textureCanvas = document.createElement('canvas');
        const textureSize = 100;
        textureCanvas.width = textureSize;
        textureCanvas.height = textureSize;
        
        const textureCtx = textureCanvas.getContext('2d');
        
        // Fill with transparent base
        textureCtx.clearRect(0, 0, textureSize, textureSize);
        
        // Draw random crayon-like texture dots
        textureCtx.fillStyle = '#000000';
        
        for (let i = 0; i < 1000; i++) {
            const x = Math.random() * textureSize;
            const y = Math.random() * textureSize;
            const radius = Math.random() * 1.5;
            
            textureCtx.globalAlpha = Math.random() * 0.2;
            textureCtx.beginPath();
            textureCtx.arc(x, y, radius, 0, Math.PI * 2);
            textureCtx.fill();
        }
        
        return textureCanvas;
    }
    
    draw(fromX, fromY, toX, toY) {
        const distance = this.getDistance(fromX, fromY, toX, toY);
        const angle = Math.atan2(toY - fromY, toX - fromX);
        
        const steps = Math.max(Math.floor(distance / this.stepDistance), 1);
        
        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            const x = fromX + (toX - fromX) * t;
            const y = fromY + (toY - fromY) * t;
            
            // Draw crayon stroke with some randomness
            const jitter = this.size / 10;
            const offsetX = this.getRandom(-jitter, jitter);
            const offsetY = this.getRandom(-jitter, jitter);
            
            this.ctx.save();
            
            // Set composite operation for a more crayon-like effect
            this.ctx.globalCompositeOperation = 'source-over';
            
            // Apply base color
            this.ctx.globalAlpha = 0.8;
            this.ctx.fillStyle = this.color;
            this.ctx.beginPath();
            this.ctx.arc(x + offsetX, y + offsetY, this.size / 2, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Apply texture using the crayon texture
            this.ctx.globalAlpha = 0.2;
            this.ctx.globalCompositeOperation = 'overlay';
            
            // Use the texture as a clipping mask for the crayon effect
            this.ctx.beginPath();
            this.ctx.arc(x + offsetX, y + offsetY, this.size / 2, 0, Math.PI * 2);
            this.ctx.clip();
            
            // Draw texture
            this.ctx.drawImage(
                this.texture,
                x - this.size / 2 + offsetX,
                y - this.size / 2 + offsetY,
                this.size,
                this.size
            );
            
            this.ctx.restore();
        }
    }
    
    startStroke(x, y) {
        // Draw a single dot if the user just clicks without dragging
        this.ctx.globalAlpha = 0.8;
        this.ctx.fillStyle = this.color;
        this.ctx.beginPath();
        this.ctx.arc(x, y, this.size / 2, 0, Math.PI * 2);
        this.ctx.fill();
    }
}