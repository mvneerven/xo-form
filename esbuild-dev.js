// https://esbuild.github.io/api/
const esbuild = require("esbuild");
const { litCssPlugin } = require('esbuild-plugin-lit-css');

console.log("Building dist/xo-form.js");
esbuild
  .build({
    plugins: [
      litCssPlugin(),
    ],
    entryPoints: ["src/xo/index.js"],
    bundle: true,
    keepNames: true,
    watch: {
      onRebuild(error, result) {
        if (error) console.error("watch build failed:", error);
        else console.log("src/xo/index.js rebuilt");
      },
    },
    outfile: "dist/xo-form.js",
  })
  .catch((ex) => {
    console.error(ex);
    process.exit(1);
  });

console.log("Building dist/index.js");
esbuild
  .build({
    plugins: [
      litCssPlugin(),
    ],
    entryPoints: ["js/index.js"],
    bundle: true,
    keepNames: true,
    watch: {
      onRebuild(error, result) {
        if (error) console.error("watch build failed:", error);
        else console.log("dist/index.js rebuilt");
      },
    },
    outfile: "dist/index.js",
  })
  .catch((ex) => {
    console.error(ex);
    process.exit(1);
  });

  