import { spawnSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const next = fileURLToPath(new URL("../node_modules/next/dist/bin/next", import.meta.url));
const result = spawnSync(process.execPath, [next, "build", "--turbopack"], {
  stdio: "inherit",
  env: { ...process.env, NEXT_STATIC_EXPORT: "1" },
});

if (result.error) throw result.error;
if (result.status === 0) {
  writeFileSync(new URL("../out/.nojekyll", import.meta.url), "");
}
process.exitCode = result.status ?? 1;
