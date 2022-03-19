// https://esbuild.github.io/api/
const esbuild = require("esbuild");
const { markdownPlugin } = require("esbuild-plugin-markdown");
const { sassPlugin } = require('@es-pack/esbuild-sass-plugin');

esbuild.build({
  plugins: [
      markdownPlugin()
  ],
  entryPoints: ['src/xo/index.js'],
  bundle: true,
  format: "esm",
  minify: true,
  outfile: 'dist/xo-form.js',
}).catch(ex => {
  console.error(ex);
  process.exit(1)
})


esbuild.build({
    plugins: [
        markdownPlugin()
    ],
    entryPoints: ['js/index.js'],
    bundle: true,
    format: "esm",
    minify: true,
    outfile: 'dist/index.js',
  }).catch(() => process.exit(1))


  esbuild.build({
    plugins: [
        sassPlugin()
    ],
    entryPoints: ['scss/main.scss'],
    minify: true,
    outfile: 'css/main.css'
  }) 

  esbuild.build({
    plugins: [
        sassPlugin()
    ],
    entryPoints: ['scss/controls.scss'],
    minify: true,
    outfile: 'css/controls.css'
  }) 

  