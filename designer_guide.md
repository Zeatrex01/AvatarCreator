# 🎨 Avatar Creator - Custom Asset Design Guide

Welcome to the **Custom Asset Design Guide**! This guide explains how to use the exported Blueprint SVG to draw your own custom options (eyes, mouths, accessories, hair, etc.) and integrate them into the app.

## 1. Using the Blueprint (Base SVG)

In the app, you can click the **Blueprint (Base SVG)** button to download an empty character template with guide markers.
This file contains the base head shape of the currently selected collection (`avataaars`, `micah`, or `adventurer`), alongside a visual guide overlay.

### What are the guides?
When you open the SVG in Illustrator, Figma, or Inkscape, you will see cyan, green, and orange boxes:
- **EYE_L & EYE_R (Cyan)**: Your custom eyes should be drawn entirely within these boxes.
- **MOUTH (Green)**: Your custom mouths or facial expressions should be drawn within this box.
- **GLASSES/ACCESSORY (Orange)**: Glasses or masks should span across this wider box.

## 2. Drawing Your Custom Asset

1. Open the downloaded `[collection_name]_blueprint.svg` in your vector editor (Adobe Illustrator, Figma, Inkscape).
2. Create a new layer for your asset (e.g., "Custom Mouth 1").
3. Draw your asset **inside** the corresponding guide box.
4. Make sure your lines and shapes have the correct colors or are prepared to be dynamically colored (if your chosen collection supports dynamic coloring).
5. Once you are done drawing, **hide or delete** the base head layer and the guide layer.
6. Export *only* your newly drawn asset as an SVG. The artboard size **must remain exactly the same** as the original blueprint (e.g., 280x280 for Avataaars).

## 3. Adding Your Asset to the App

Because this app uses the `@dicebear/collection` engine to render avatars dynamically, custom assets must be registered into the DiceBear schema.

Currently, DiceBear collections are pre-compiled into the npm package. To load custom local SVGs:

1. **Option A (Sprite Override):**
   You can place your custom SVGs in the `public/custom-assets/` folder. We plan to build a "Custom Assets Loader" module that will read these local SVGs and merge them into the active collection schema before calling `createAvatar`.

2. **Option B (Forking the Collection):**
   If you are building an extensive custom pack, you can fork the `@dicebear/avataaars` repository, add your SVG nodes into their build pipeline, and install your custom npm package into this project.

*(Note: The Custom Asset Loader UI is planned for a future update. For now, use the Blueprint to prepare your assets!)*
