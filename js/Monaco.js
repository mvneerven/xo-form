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

  get version() {
    return this._version;
  }

  set version(version) {
    this._version = version;
  }

  static get properties() {
    return {
      version: {
        type: String,
      },
      language: {
        type: String,
      },
      theme: {
        type: String,
      },
      value: {
        type: String,
      },
    };
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

  get theme() {
    return this._theme;
  }

  set theme(name) {
    this._theme = name;
    if (monaco && monaco.editor) monaco.editor.setTheme(name);
  }

  async firstUpdated() {
    const me = this;
    await super.firstUpdated();

    let monaco = await this.requireMonaco();

    const detail = {
      editorOptions: {
        readOnly: this.readonly,
        value: this.value || "",
        language: this.language,
        theme: this.theme,
        ...(this.options || {}),
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

    return new Promise(async (resolve) => {
      await Util.requireJS(
        `https://unpkg.com/monaco-editor@${me.version}/min/vs/loader.js`
      );

      require.config({
        paths: {
          vs: `https://unpkg.com/monaco-editor@${me.version}/min/vs`,
        },
      });
      window.MonacoEnvironment = { getWorkerUrl: () => proxy };

      let proxy = URL.createObjectURL(
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
