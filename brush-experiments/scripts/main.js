// main.js - Main application logic
document.addEventListener('DOMContentLoaded', () => {
    // Get canvas and create brush manager
    const canvas = document.getElementById('drawing-canvas');
    const brushManager = new BrushManager(canvas);
    
    // Set canvas size to match window
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight - document.querySelector('.controls').offsetHeight;
    }
    
    // Initial resize and add event listener for window resize
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // UI Controls
    const brushTypeSelect = document.getElementById('brush-type');
    const brushSizeSlider = document.getElementById('brush-size-slider');
    const sizeValueDisplay = document.getElementById('size-value');
    const colorPicker = document.getElementById('brush-color-picker');
    const clearButton = document.getElementById('clear-canvas');
    
    // Event listeners for brush controls
    brushTypeSelect.addEventListener('change', (e) => {
        brushManager.setBrushType(e.target.value);
    });
    
    brushSizeSlider.addEventListener('input', (e) => {
        const size = parseInt(e.target.value);
        sizeValueDisplay.textContent = size;
        brushManager.setBrushSize(size);
    });
    
    colorPicker.addEventListener('input', (e) => {
        brushManager.setBrushColor(e.target.value);
    });
    
    clearButton.addEventListener('click', () => {
        // Clean up any running animations before clearing
        brushManager.cleanupAnimations();
        
        // Clear the canvas
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
    
    // Set initial brush properties
    brushManager.setBrushType(brushTypeSelect.value);
    brushManager.setBrushSize(parseInt(brushSizeSlider.value));
    brushManager.setBrushColor(colorPicker.value);
});