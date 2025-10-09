# OHZI GLB Viewer Web

This is the web app for the OHZI GLB Viewer.

Explore, look, and inspect your GLB models with detailed material, texture, geometry, and animation analysis.

![OHZI GLB Viewer Web](https://github.com/ohzinteractive/glb-viewer-web/blob/main/public/images/previews/preview-13.0.0.jpg?raw=true)

## Features

### 🎨 Material Inspection
- View and inspect all materials in your GLB model
- Detailed material properties and parameters

### 🖼️ Texture Viewer
- Preview all textures embedded in your model
- Support for compressed textures (Basis Universal, Draco)
- Texture details and metadata

### 📐 Geometry Analysis
- Inspect mesh geometries and their attributes
- View vertex counts, indices, and buffer information
- Geometry hierarchy visualization

### 🎬 Animation Controls
- Play, pause, and scrub through animations
- Support for multiple animation tracks

### 🌳 Scene Hierarchy
- Interactive scene tree view
- Search scene nodes
- Node selection and inspection

### ⚙️ Advanced Settings
- Skeleton visualization for rigged models

## Prerequisites

Before you begin, ensure you have met the following requirements:
* You have installed the following version of
    1. Node.js: `18.x.x`
    2. Git: `2.x.x`
    3. Yarn: `1.22.x`

## Building GLB Viewer Web

To build GLB Viewer Web, follow these steps:

1. Build the application: `yarn build`
2. You'll find the built project on `dist` folder.
3. You can test the build going to the dist folder with `http-server -c-1`

## Committing and Pushing changes

When making changes in the GLB Core Submodule, you can use the VS Code extension to choose to commit changes to the web app or the core submodule.
The order is:
 1st Commit and push changes to the core submodule (make sure to sync before)
 2nd Commit and push changes to the web app with the core submodule hash changed


## Contact

If you want to contact us you can reach us at `support@ohzi.io`.

## License

This project uses the following license: MIT.
