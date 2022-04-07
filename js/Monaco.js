import { LitElement, html, css } from "lit";
import Util from "./Util";

const MONACO_VERSION = "0.33.0",
  getTheme = () => {
    return document.documentElement.classList.contains("theme-dark")
      ? "vs-dark"
      : "vs-light";
  };

/**
 * Monaco Code Editor Wrapper
 */
class Monaco extends LitElement {
  _version = MONACO_VERSION;

  language = "javascript";

  _theme = getTheme();

  _minimap = false;

  get version() {
    return this._version;
  }

  set version(version) {
    this._version = version;
  }

  /**
   * Sets the URL to read an XO Form Schema from
   */
  set src(url) {
    this._src = url;
  }

  /**
   * Returns the URL to read an XO Form Schema from
   */
  get src() {
    return this._src;
  }

  static get properties() {
    return {
      readonly: {
        type: Boolean,
        attribute: true,
      },
      version: {
        type: String,
      },
      language: {
        type: String,
      },
      theme: {
        type: String,
      },
      minimap: {
        type: Boolean,
      },
      value: {
        type: String,
      },
      src: {
        type: String,
        attribute: true,
      },
      options: {
        type: Object,
        attribute: true,
        converter: (value, type) => {
          return JSON.parse(value);
        },
      },
    };
  }

  async readSource() {
    if (this.src) {
      try {
        let s = await fetch(this.src).then((x) => x.text());
        return s;
      } catch (x) {
        throw Error(
          "Could not load schema from " + this.src + ". " + x.message
        );
      }
    }
  }

  render() {
    return html`<div>
      <link
        rel="stylesheet"
        href="https://unpkg.com/monaco-editor@${this
          .version}/min/vs/editor/editor.main.css"
      />
      <div id="monaco" style="height: 300px; width: 100%"></div>
    </div>`;
  }

  get minimap() {
    return this._minimap;
  }

  set minimap(on) {
    this._minimap = on;
  }

  get theme() {
    return this._theme;
  }

  set theme(name) {
    this._theme = name;
    if (monaco && monaco.editor) monaco.editor.setTheme(name);
  }

  get options() {
    return this._options || {};
  }

  set options(value) {
    this._options = value;
  }

  async firstUpdated() {
    const me = this;
    await super.firstUpdated();

    let monaco = await this.requireMonaco();

    if (this.src) this.value = await this.readSource(this.src);

    const detail = {
      editorOptions: {
        readOnly: this.readonly,
        value: this.value || "",
        minimap: {
          enabled: me.minimap,
        },
        language: this.language,
        theme: this.theme,
        ...me.options,
      },
    };

    this.dispatchEvent(
      new CustomEvent("create", {
        detail: detail,
      })
    );

    let div = this.shadowRoot.getElementById("monaco");

    this.editor = monaco.editor.create(div, detail.editorOptions);

    this.dispatchEvent(new CustomEvent("ready"));

    this.editor.getModel().onDidChangeContent((e) => {
      this.dispatchEvent(new CustomEvent("editor-change"));
    });

    Util.throttleEvent(
      this,
      "editor-change",
      () => {
        me.value = this.editor.getModel().getValue();
        me.fireChange();
      },
      100
    );

    Util.throttleEvent(window, "resize", () => {
      me.editor.layout();
    });

    this.listenThemeChange();
  }

  listenThemeChange() {
    const me = this;
    var observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (mutation.type === "attributes") {
          me.theme = getTheme();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true, //configure it to listen to attribute changes
    });
  }

  async requireMonaco() {
    const me = this;

    return new Promise(async (resolve, reject) => {
      await Util.requireJS(
        `https://unpkg.com/monaco-editor@${me.version}/min/vs/loader.js`
      );

      await Util.waitFor(() => {
        return typeof require?.config === "function";
      });

      const proxy = URL.createObjectURL(
        new Blob(
          [
            `self.MonacoEnvironment = {
             baseUrl: 'https://unpkg.com/monaco-editor@${me.version}/min/'
          };
          importScripts('https://unpkg.com/monaco-editor@${me.version}/min/vs/base/worker/workerMain.js');`,
          ],
          { type: "text/javascript" }
        )
      );

      require.config({
        paths: {
          vs: `https://unpkg.com/monaco-editor@${me.version}/min/vs`,
        },
      });
      window.MonacoEnvironment = { getWorkerUrl: () => proxy };

      require(["vs/editor/editor.main"], () => {
        resolve(monaco);
      });
    });
  }

  fireChange() {
    this.dispatchEvent(
      new Event("change", { bubbles: true, cancelable: false })
    );
  }

  set value(data) {
    if (this._value === data) return;

    this._value = data;

    if (this.editor) {
      if (this.editor.getModel().getValue() !== data)
        this.editor.getModel().setValue(data);
    }
  }

  get value() {
    return this.editor?.getModel().getValue() || this._value;
  }
}
customElements.define("xw-monaco", Monaco);
export default Monaco;
