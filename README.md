# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Image variants

Production vehicle photos are checked-in WebP files in `public/optimized/v1/vehicles/`. Raw owner photos stay locally in the Git-ignored `2013 ford edge/` and `Dodge charger 2022/` folders. Vite builds do not need the raw files or an image-processing package.

To regenerate a live vehicle's variants, install Pillow and run its `scripts/prepare_*_images.py` script with the matching raw folder present. `scripts/generate_image_variants.py` remains available for the global hero image and any future JPG-based inventory. When replacing an image at an existing optimized URL, bump the URL version in the image scripts and site references before deployment so Vercel's immutable cache serves the new image.
