import { cp, mkdir, rm } from "node:fs/promises";
import { join } from "node:path";

const clientOutput = join(".", "dist", "client");
const docsOutput = join(clientOutput, "docs");

await rm(docsOutput, { force: true, recursive: true });
await mkdir(docsOutput, { recursive: true });

for (const directory of ["assets", "static"]) {
	await cp(join(clientOutput, directory), join(docsOutput, directory), {
		force: true,
		recursive: true,
	});
}

for (const file of ["apple-icon.png", "favicon.ico", "icon.png", "manifest.json"]) {
	await cp(join(clientOutput, file), join(docsOutput, file), {
		force: true,
	});
}
