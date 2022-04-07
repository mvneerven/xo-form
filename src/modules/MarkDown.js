import Util from "../xo/Util";

class MarkDown {
  static async read(src) {
    return new Promise(async (resolve) => {
      Util.addStyleSheet(
        "//cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.0.1/build/styles/default.min.css"
      );

      await Util.requireJS(
        "https://cdnjs.cloudflare.com/ajax/libs/markdown-it/12.0.6/markdown-it.min.js"
      );
      await Util.requireJS(
        "//cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.0.1/build/highlight.min.js"
      );

      let md = await MarkDown.readData(src);
      let html =
        '<div class="md-converted-html">' +
        window
          .markdownit({
            highlight: function (str, lang) {
              if (lang && hljs.getLanguage(lang)) {
                try {
                  return hljs.highlight(str, { language: lang }).value;
                } catch (__) {}
              }

              return ""; // use external default escaping
            },
          })
          .render(md) +
        "</div>";
      resolve(html);
    }, 2000);
  }

  static async readData(src) {
    return new Promise((resolve, reject) => {
      fetch(src)
        .then((x) => x.text())
        .then((md) => {
          resolve(md);
        });
    });
  }
}

export default MarkDown;
