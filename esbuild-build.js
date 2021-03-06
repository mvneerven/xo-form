// https://esbuild.github.io/api/
const esbuild = require("esbuild");
const { sassPlugin } = require("@es-pack/esbuild-sass-plugin");
const { litCssPlugin } = require("esbuild-plugin-lit-css");
const { markdownPlugin } = require("esbuild-plugin-markdown");

esbuild.build({
  plugins: [sassPlugin(), litCssPlugin()],
  entryPoints: ["scss/main.scss"],
  minify: true,
  outfile: "css/main.css",
});

esbuild.build({
  plugins: [sassPlugin(), litCssPlugin()],
  entryPoints: ["scss/controls.scss"],
  minify: true,
  outfile: "css/controls.css",
});

esbuild
  .build({
    plugins: [sassPlugin(), litCssPlugin()],
    entryPoints: ["src/xo/index.js"],
    bundle: true,
    format: "esm",
    minify: true,
    sourcemap: true,
    keepNames: true,
    outfile: "dist/xo-form.js",
  })
  .catch((ex) => {
    console.error(ex);
    process.exit(1);
  });

  esbuild
  .build({
    plugins: [sassPlugin(), litCssPlugin()],
    entryPoints: ["src/autocomplete/index.js"],
    bundle: true,
    format: "esm",
    minify: true,
    sourcemap: true,
    keepNames: true,
    outfile: "dist/xo-autocomplete.js",
  })
  .catch((ex) => {
    console.error(ex);
    process.exit(1);
  });


esbuild
  .build({
    plugins: [sassPlugin(), litCssPlugin(),
      markdownPlugin({
        markedOptions: {
          
          highlight: function(code, lang) {
            const hljs = require('highlight.js');
            const language = hljs.getLanguage(lang) ? lang : 'plaintext';
            return hljs.highlight(code, { language }).value;
          }
          
        }
      })
    ],
    entryPoints: ["js/index.js"],
    bundle: true,
    format: "esm",
    sourcemap: true,
    minify: true,
    keepNames: true,
    outfile: "dist/index.js",
  })
  .catch(() => process.exit(1));
