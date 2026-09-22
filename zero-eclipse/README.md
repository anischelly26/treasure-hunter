# ZERO ECLIPSE browser demo

A one-level browser adaptation for the portfolio, using six original PNG assets extracted from the user-supplied V9 JAR. This is a small JavaScript adaptation, not a Java runtime or a full port of V9. It includes movement, jumping, three fragments, three enemies, a following NOVA sprite, a goal, and touch controls.

The full desktop game is maintained at https://github.com/anischelly26/ZERO-ECLIPSE.

Serve the repository root using a static server and open `/zero-eclipse/`. No dependencies or build step.

`download.js` downloads the original JAR payload in two parts, joins it in the browser, and verifies its SHA-256 before offering the file. The pinned source commit makes the download reproducible.
