import { copyFile, mkdir } from "node:fs/promises";
import { build } from "esbuild";

async function start() {
  const asm = build({
    bundle: true,
    sourcemap: false,
    format: "esm",
    target: "esnext",
    loader: {
      ".js": "ts",
    },
    entryPoints: ["./asm.js"],
    outfile: "./dist/asm.js",
    minify: true,
  });

  await build({
    bundle: true,
    sourcemap: false,
    format: "esm",
    target: "esnext",
    loader: {
      ".js": "ts",
    },
    entryPoints: ["./index.js"],
    outfile: "./dist/index.js",
    minify: true,
  });

  // copy wasm file
  await copyFile("./tmp/yoga.wasm", "./dist/yoga.wasm");

  // copy d.ts files
  await copyFile(
    "./yoga/javascript/src_js/wrapAsm.d.ts",
    "./dist/wrapAsm.d.ts"
  );
  await mkdir("./dist/generated/", { recursive: true });
  await copyFile(
    "./yoga/javascript/src_js/generated/YGEnums.d.ts",
    "./dist/generated/YGEnums.d.ts"
  );
  await copyFile("./asm.d.ts", "./dist/asm.d.ts");
  await asm;
}

start();
