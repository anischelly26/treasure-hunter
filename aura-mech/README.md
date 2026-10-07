# AURA MECH browser demo

**Live demo:** https://anischelly26.github.io/treasure-hunter/aura-mech/

This is the main window of the AURA MECH 0.13 desktop app, served as static files. It is the same build the Windows app loads, not an adaptation: the Garage, Problems, the 3D Lab, the Library, Puzzles and the Listening Room all run in the browser, and it makes no request to any other site.

The source of the app's local layer is at https://github.com/anischelly26/Aura-mech.

## What is different from the desktop app

The desktop app has a main process behind this window. In a browser it is absent, so:

- **Voice** uses the browser's own speech recognition. In Chrome that is an online service; the desktop app recognises speech on the computer.
- **Connected AI, Spotify, and the local speech and language models** are off. Their controls say that they need the desktop app.
- **Hand control** works with a camera, and the frames are processed in the page. It has not been tuned on a real hand yet.

## What is in this folder

- `index.html`, `aura-plus.js`, `aura-plus.css`, `assets/`: the window and the layer added on top of it.
- `garage/`: the vehicle catalogue, part taxonomy, cause maps and 112 photographs. Every photograph is from Wikimedia Commons under a free licence; author, licence and source are on each card and in `garage/IMAGE_CREDITS.md`.
- `hand-runtime/`: the MediaPipe hand tracker and its model, loaded only when hand control is switched on.
- `THIRD_PARTY_LICENSES.md`: licences of the bundled libraries.

Left out of the app's build on purpose: the separate console window, and three converted CAD models whose source files came without a licence.

## Updating it

Extract `desktop-dist/` from the installed app's `resources/app.asar`, then run `node tools/build-web-demo.mjs <desktop-dist> <this folder>` from the Aura-mech repository. Serve the repository root with any static server and open `/aura-mech/`. There is no build step here.
