// brush-manager.js - Manages brush instances and drawing operations
class BrushManager {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.currentBrush = null;
        this.brushType = 'crayon';
        this.brushSize = 10;
        this.brushColor = '#ff4444';
        this.isDrawing = false;
        this.lastX = 0;
        this.lastY = 0;
        
        // Keep track of previous brush for cleanup
        this.previousBrush = null;
        
        // Initialize brush based on default values
        this.createBrush();
        
        // Add mouse/touch event listeners
        this.setupEventListeners();
    }
    
    createBrush() {
        // Stop animation of previous brush if it exists
        if (this.previousBrush && typeof this.previousBrush.stopAnimation === 'function') {
            this.previousBrush.stopAnimation();
        }
        
        // Store the current brush as previous before creating a new one
        this.previousBrush = this.currentBrush;
        
        // Create brush instance based on type
        switch(this.brushType) {
            case 'crayon':
                this.currentBrush = new CrayonBrush(this.ctx, this.brushSize, this.brushColor);
                break;
            case 'watercolor':
                this.currentBrush = new WatercolorBrush(this.ctx, this.brushSize, this.brushColor);
                break;
            case 'pencil':
                this.currentBrush = new PencilBrush(this.ctx, this.brushSize, this.brushColor);
                break;
            case 'living':
                this.currentBrush = new LivingBrush(this.ctx, this.brushSize, this.brushColor);
                break;
            default:
                this.currentBrush = new CrayonBrush(this.ctx, this.brushSize, this.brushColor);
        }
    }
    
    setBrushType(type) {
        this.brushType = type;
        this.createBrush();
    }
    
    setBrushSize(size) {
        this.brushSize = size;
        if (this.currentBrush) {
            this.currentBrush.setSize(size);
        }
    }
    
    setBrushColor(color) {
        this.brushColor = color;
        if (this.currentBrush) {
            this.currentBrush.setColor(color);
        }
    }
    
    setupEventListeners() {
        // Mouse events
        this.canvas.addEventListener('mousedown', this.startDrawing.bind(this));
        this.canvas.addEventListener('mousemove', this.draw.bind(this));
        this.canvas.addEventListener('mouseup', this.stopDrawing.bind(this));
        this.canvas.addEventListener('mouseout', this.stopDrawing.bind(this));
        
        // Touch events for mobile
        this.canvas.addEventListener('touchstart', this.handleTouchStart.bind(this));
        this.canvas.addEventListener('touchmove', this.handleTouchMove.bind(this));
        this.canvas.addEventListener('touchend', this.stopDrawing.bind(this));
    }
    
    startDrawing(e) {
        this.isDrawing = true;
        
        // Get initial position
        const rect = this.canvas.getBoundingClientRect();
        this.lastX = e.clientX - rect.left;
        this.lastY = e.clientY - rect.top;
        
        // Some brushes need to know where the stroke starts
        this.currentBrush.startStroke(this.lastX, this.lastY);
    }
    
    draw(e) {
        if (!this.isDrawing) return;
        
        // Get current mouse position
        const rect = this.canvas.getBoundingClientRect();
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;
        
        // Draw with current brush
        this.currentBrush.draw(this.lastX, this.lastY, currentX, currentY);
        
        // Update last position
        this.lastX = currentX;
        this.lastY = currentY;
    }
    
    stopDrawing() {
        if (this.isDrawing) {
            this.isDrawing = false;
            this.currentBrush.endStroke();
        }
    }
    
    handleTouchStart(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousedown', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        this.startDrawing(mouseEvent);
    }
    
    handleTouchMove(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousemove', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        this.draw(mouseEvent);
    }
    
    // Method to clean up animations when changing brush types or clearing canvas
    cleanupAnimations() {
        if (this.currentBrush && typeof this.currentBrush.stopAnimation === 'function') {
            this.currentBrush.stopAnimation();
        }
    }
}