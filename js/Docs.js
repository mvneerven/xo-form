import { html, css, LitElement } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { docs } from "../md";
import xo from "../src/xo";

const getTheme = () => {
  return document.documentElement.classList.contains("theme-dark")
    ? "vs-dark"
    : "vs-light";
};

export default class Docs extends LitElement {
  _document = window.location.hash?.substring(1) || "index";

  static get properties() {
    return {
      document: {
        type: String,
        attribute: true
      },
      theme: {
        type: String
      }
    };
  }

  constructor() {
    super(...arguments);
    const me = this;
    this.listenThemeChange();

    window.addEventListener("hashchange", (e) => {
      const u = new URL(e.newURL);
      me.document = (u.hash || "#index").substring(1);
      console.log(me.document);
      this.requestUpdate();
    });
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
      attributes: true //configure it to listen to attribute changes
    });
  }

  set document(value) {
    this._document = value;
    document.location.hash = "#" + value;
  }

  get document() {
    return this._document;
  }

  static get styles() {
    return css`
      a:link,
      a:visited {
        color: currentColor;
      }

      div[data-document] {
        max-height: var(--docs-max-height, 100vh);
        padding: 1rem;
      }
      code {
        font-family: "SF Mono", Monaco, Menlo, Consolas, "Ubuntu Mono",
          "Liberation Mono", "DejaVu Sans Mono", "Courier New", monospace;
      }
      h1 {
        border-bottom: 2px solid rgba(127, 127, 127, 0.5);
        font-size: 1.4rem;
        color: var(--accent);
        text-transform: uppercase;
      }
      h2 {
        font-size: 1.3rem;
      }

      h3 {
        font-size: 1.2rem;
      }

      h4 {
        font-size: 1.1rem;
      }

      h5 {
        font-size: 1.05rem;
      }

      hr {
        border: 0;
        border-bottom: 5px dotted rgba(127, 127, 127, 0.3);
      }

      hr[id]:first-of-type {
        display: none;
      }

      .d-top {
        float: right;
        font-size: small;
        text-decoration: none;
      }

      .d-top:hover {
        color: var(--accent);
      }

      #ds-top {
        margin-top: 2rem;
      }

      pre code {
        display: inline-block;
        max-height: 300px;
        width: 100%;
        overflow-y: hidden;
      }

      pre code:hover {
        overflow-y: auto;
      }

      #xo-ver {
        font-style: italic;
        color: var(--accent);
      }
    `;
  }
  render() {
    return html` ${this.highlightStyle}

      <div
        id="ds-top"
        data-document="${this.document}"
        @click=${this.click.bind(this)}
      >
        <button title="Toggle documentation" id="toggle-docs">
          Documentation
        </button>
        <small id="xo-ver">xo-form ${xo.version}</small>
        ${unsafeHTML(this.renderAll())}
      </div>`;
  }

  get highlightStyle() {
    if (!document.documentElement.classList.contains("theme-dark"))
      return html`<style>
        @import url("//cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.5.1/build/styles/default.min.css");
      </style>`;
    else
      return html`<style>
        @import url("//cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.5.1/build/styles/dark.min.css");
      </style>`;
  }

  toggleDocs(e) {
    e.preventDefault();
    e.target.classList.toggle("on");
    e.target.innerHTML = e.target.classList.contains("on")
      ? "⨉"
      : "Documentation";
    const host = this.shadowRoot.getRootNode()?.host;
    host.classList.toggle("show");
  }

  firstUpdated() {
    const btn = this.shadowRoot.querySelector("#toggle-docs");
    setTimeout(() => {
      btn.addEventListener("click", this.toggleDocs.bind(this));
      document.querySelector("header").appendChild(btn);
    }, 100);
  }

  renderAll() {
    const html = [];

    Object.entries(docs).forEach((entry) => {
      html.push(`<hr id="ds-${entry[0]}" />`);
      html.push(`<a class="d-top" href="./top">△</a>`);
      html.push(entry[1].html);
    });

    return html.join("");
  }

  click(e) {
    const me = this;

    if (e.target.href) {
      e.preventDefault();
      const id = this.getFileName(e.target.getAttribute("href") ?? "").replace(
        "-",
        ""
      );
      document.location.hash = "#ds-" + id;

      let el = me.shadowRoot.getElementById("ds-" + id);
      if (el) {
        el.scrollIntoView({
          behavior: "smooth"
        });
      } else {
        console.warn("Document section not found: ", id);
      }
    }
  }

  getFileName(href) {
    return href.substring(2).split(".md")[0];
  }
}

customElements.define("xo-docs", Docs);
