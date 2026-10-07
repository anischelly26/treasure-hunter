// Static export for GitHub Pages (works the same on Windows, macOS and Linux).
//   node scripts/build-pages.mjs                  → base path /treasure-hunter
//   node scripts/build-pages.mjs another-repo     → another repository name
//   node scripts/build-pages.mjs root             → a user site or custom domain (no base path)
// The name may be given with or without a leading slash. (Git Bash on Windows
// rewrites arguments that start with "/", so prefer the bare name there.)
import { spawnSync } from "node:child_process";

const arg = (process.argv[2] ?? "treasure-hunter").replace(/^\/+|\/+$/g, "");
const base = arg === "" || arg === "root" ? "" : `/${arg}`;
if (base.includes(":") || base.includes("\\")) {
  console.error(`"${process.argv[2]}" is not a base path. Pass the repository name, for example: treasure-hunter`);
  process.exit(1);
}

const result = spawnSync("npx", ["next", "build"], {
  stdio: "inherit",
  shell: true,
  env: { ...process.env, GITHUB_PAGES: "1", BASE_PATH: base },
});
process.exit(result.status ?? 1);
