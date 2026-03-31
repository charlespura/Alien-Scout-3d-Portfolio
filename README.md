# Alien Scout 3D Portfolio

A cinematic, game-inspired 3D portfolio built with React + Three.js tooling.  
The page uses section-driven camera movement so the 3D character changes focus while you scroll (`Intro`, `About`, `Tech Stack`, `Projects`, `Contact`).

## Live Demo

- GitHub Pages: `https://charlespura.github.io/Alien-Scout-3d-Portfolio/`

## Tech Stack

### Core
- React 19
- Vite
- JavaScript (ESM)

### 3D / Animation
- Three.js
- @react-three/fiber
- @react-three/drei
- Framer Motion
- GSAP

### Styling / UI
- Tailwind CSS (v4 via `@tailwindcss/vite`)
- `clsx` + `tailwind-merge` (for className merging)
- Lucide React (icons)

## 3D Model

- Model file:
  - `public/models/Meshy_AI_A_Scout_from_an_alien_0331090602_texture.glb`
- Loaded with `useGLTF` and preloaded for smoother experience.

## Key Features

- Full-screen fixed 3D stage (no boxed 3D frame)
- Alternating content cards (left/right) around the 3D scene
- Section-based cinematic camera presets
- Navbar section jump with smooth scroll + active state tracking
- Adaptive DPR and performance tuning for smoother rendering
- GitHub Pages compatible asset/model path handling

## Project Structure

- `src/App.jsx` — main layout, 3D stage, camera logic, section logic
- `src/main.jsx` — app bootstrap and targeted warning filtering
- `src/index.css` — global styles + Tailwind import
- `src/lib/utils.js` — `cn()` utility
- `public/models/` — GLB assets
- `.github/workflows/deploy.yml` — GitHub Pages deployment workflow

## Local Development

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
npm run preview
```

## Deploy to GitHub Pages

This project uses GitHub Actions for deployment.

1. Push to `main`.
2. In repository settings, go to **Pages**.
3. Set **Build and deployment → Source** to **GitHub Actions**.
4. Workflow file used: `.github/workflows/deploy.yml`.

## Notes

- If you see a blank page on GitHub Pages, check that Pages source is set to **GitHub Actions** (not branch deploy).
- Some heavy devices may still show occasional frame-time warnings due to realtime 3D load.

## Author

- Charles Pura
