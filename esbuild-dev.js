// https://esbuild.github.io/api/
const esbuild = require("esbuild");
const { litCssPlugin } = require("esbuild-plugin-lit-css");
const { sassPlugin } = require('@es-pack/esbuild-sass-plugin');
const { markdownPlugin } = require("esbuild-plugin-markdown");

const fs = require("fs");
const htc = (s) => {
  return s.replace(/-([a-z])/g, function (g) {
    return " " + g[1].toUpperCase();
  });
};

fs.readdir("./data/forms/examples/", (err, files) => {
  let arr = files
    .filter((f) => {
      return f.endsWith(".js");
    })
    .map((i) => {
      return "data/forms/examples/" + i.toString();
    });

  arr = arr.map((f) => {
    return {
      name: htc(f.split("/").pop()).replace(".js", ""),
      value: f
    };
  });

  fs.readdir("./data/json-schemas/", (err, files) => {
    let arr2 = files.map((i) => {
      return "data/json-schemas/" + i.toString();
    });
    arr2 = arr2.map((f) => {
      return {
        name: htc(f.split("/").pop()).replace(".json", ""),
        value: f
      };
    });
    arr = arr.concat(arr2);
    let s = JSON.stringify(arr);
    fs.writeFile("./data/forms/examples.json", s, (err) => {});
  });
});

console.log("Building dist/xo-form.js");
esbuild
  .build({
    plugins: [litCssPlugin()],
    entryPoints: ["src/xo/index.js"],
    bundle: true,
    format: "esm",
    keepNames: true,
    watch: {
      onRebuild(error, result) {
        if (error) console.error("watch build failed:", error);
        else console.log("dist/xo-form.js rebuilt");
      }
    },
    outfile: "dist/xo-form.js"
  })
  .catch((ex) => {
    console.error(ex);
    process.exit(1);
  });

console.log("Building dist/xo-autocomplete.js");
esbuild
  .build({
    plugins: [litCssPlugin()],
    entryPoints: ["src/autocomplete/index.js"],
    bundle: true,
    keepNames: true,
    watch: {
      onRebuild(error, result) {
        if (error) console.error("watch build failed:", error);
        else console.log("dist/xo-autocomplete.js rebuilt");
      }
    },
    outfile: "dist/xo-autocomplete.js"
  })
  .catch((ex) => {
    console.error(ex);
    process.exit(1);
  });

console.log("Building dist/xo-schema-generator.js");
esbuild
  .build({
    plugins: [litCssPlugin()],
    entryPoints: ["src/generator/index.js"],
    bundle: true,
    keepNames: true,
    watch: {
      onRebuild(error, result) {
        if (error) console.error("watch build failed:", error);
        else console.log("dist/xo-schema-generator.js rebuilt");
      }
    },
    outfile: "dist/xo-schema-generator.js"
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
    keepNames: true,
    watch: {
      onRebuild(error, result) {
        if (error) console.error("watch build failed:", error);
        else console.log("dist/index.js rebuilt");
      }
    },
    outfile: "dist/index.js"
  })
  .catch((ex) => {
    console.error(ex);
    process.exit(1);
  });
