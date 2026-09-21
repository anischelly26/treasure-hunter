# Alpine portfolio

The homepage is an original landscape-led redesign informed by the supplied Montfort recording. The previous homepage remains at playground.html. Its scripts, demos, assistant and case studies were not removed.

## Source

- index.html: semantic page, navigation and project entry points.
- alpine.css: responsive layout, light/dark chapters and dialogs.
- alpine.js: case-study content, scroll state, dialogs and motion controls.
- alpine-scene.js: Three.js relief mesh, perspective camera and shader cloud planes.
- assets/alpine-original.webp: original generated alpine backdrop, approximately 151 KB.
- resume.html: printable web résumé assembled from the public CV knowledge base and case studies, not the original uploaded PDF.

The existing vanilla HTML/CSS/JavaScript stack is retained. Three.js uses the prior portfolio's pinned CDN version. GitHub Pages remains the public host.

## Rendering limitations

The image is mapped onto a shallow relief mesh, with three cloud planes at separate depths. This is real WebGL, but not a complete volumetric mountain model or an unrestricted orbit scene. Camera movement is deliberately limited to avoid revealing unpainted surfaces.

If WebGL, the CDN or texture loading fails, the still-image fallback remains visible. Main content and navigation do not depend on Three.js. The ship and alternate nighttime environment in the reference were not reproduced.

Reduced-motion preference and the pause control stop decorative motion. Browser testing without WebGL can validate the fallback and interactions, not the 3D output or GPU performance.

## Content

Summaries use the public CV chunks and repository case studies. Orange is credited as team work. No new outcome statistics are claimed. Barcelona–Dubai is an in-progress MVP and its separate hosted demo may require sign-in. The web résumé does not expose phone or street-address information.

## Asset provenance

Built-in image generation created an original cinematic alpine landscape: snowy jagged peak right of center, silver-blue clouds, foreground crags, diffuse icy daylight, no text or UI. The generated image was compressed to WebP. No Montfort source asset is distributed.
