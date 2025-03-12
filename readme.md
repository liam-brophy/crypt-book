## Running Your Brush Experiments Project

To run this project, you'll need to serve the files through a local web server. Here are a few easy ways to do this:

### Option 1: Using Python

If you have Python installed, you can start a simple HTTP server:

For Python 3:
```
cd brush-experiments
python -m http.server
```

For Python 2:
```
cd brush-experiments
python -m SimpleHTTPServer
```

Then open your browser and go to: `http://localhost:8000`

### Option 2: Using Node.js

If you have Node.js installed, you can use the `http-server` package:

```
npm install -g http-server
cd brush-experiments
http-server
```

Then open your browser and go to: `http://localhost:8080`

### Option 3: Using VS Code Live Server

If you use Visual Studio Code, you can install the "Live Server" extension and right-click on `index.html` to select "Open with Live Server".

## Experimenting with Brushes

Once the project is running, you can:

1. Select different brush types from the dropdown
2. Adjust the brush size with the slider
3. Change the brush color with the color picker
4. Clear the canvas with the Clear button
5. Draw on the canvas with your mouse or touch input

## Adding New Brush Types

To create a new brush type:

1. Create a new file in the `scripts/brushes/` directory (e.g., `marker-brush.js`)
2. Extend the `BaseBrush` class and implement the required methods
3. Ad