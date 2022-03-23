import { html, css } from "lit";
import Control from "./Control";
import Validation from "./Validation";
import Context from "./Context";
import { until } from "lit/directives/until.js";
import { version } from "../../package.json";

/**
 * XO Form Control (```<xo-form/>```)
 */
class Form extends Control {
  elements = {};

  /**
   * Returns package version
   */
  static get version() {
    return version;
  }

  constructor() {
    super();
    this._url = new URL(document.location.href);
    this._context = new Context(this);
    this._page = 1;
  }

  static get properties() {
    return {
      ...Control.properties,
      page: {
        type: Number,
        attribute: true,
      },
      schema: {
        type: Object,
      },
      src: {
        type: String,
        attribute: true,
      },
      theme: {
        type: String,
        attribute: true,
      },
    };
  }

  /**
   * @returns {Context}
   */
  get context() {
    return this._context;
  }

  /**
   * @param value {Number}
   */
  set page(value) {
    if (value === this._page) return;

    if (value < 1) return;
    else if (value > this.querySelectorAll("xo-page").length) return;

    if (value > this._page) {
      this.validation.isPageValid(this._page);
    }

    this._page = value;
  }

  /**
   * @returns {Number}
   */
  get page() {
    return this._page;
  }

  /**
   * Sets the XO Form Schema to read.
   */
  set schema(schema) {
    this._schema = schema;
    this.requestUpdate();
  }

  /**
   * Gets the XO Form Schema
   */
  get schema() {
    return this._schema;
  }

  /**
   *
   * @param {HTMLElement} element
   */
  registerElement(element) {
    if (element.name) {
      this.elements[element.name] = element;
    }
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

  async readSchema() {
    if (!this.schema) {
      if (this.src) {
        try {
          let r = await import(this.src);
          const key = Object.keys(r)[0];
          this._schema = r[key];
        } catch (x) {
          throw Error("Could not load schema from " + this.src);
        }
      }
    }
    if (!this.schema) return false;

    this.interpretSchema(this.schema);

    return true;
  }

  interpretSchema(schema) {
    if (typeof schema !== "object") throw Error("Invalid schema");

    schema.page = "#/_xo/nav/page";

    this.context.data.initialize(schema.model, {
      pageCount: schema.pages.length,
    });

    let index = 1;
    for (let page of schema.pages) {
      page.index = index++;
      let pageElement = this.createControl(this.context, "xo-page", page);
      pageElement.setAttribute("slot", "w");
      this.appendChild(pageElement);
    }

    this.nav = this.createControl(this.context, "xo-nav", schema);

    this.nav.controls = this.nav.controls;
    this.nav.setAttribute("slot", "n");
    this.appendChild(this.nav);
  }

  render() {
    return html`
      ${until(
        this.readSchema().then((ready) => {
          if (!ready) {
            return html``;
          }

          return html`<div class="xo-c" data-page="${this.page}" >
            <form>
                <div class="xo-w">
                    <slot name="w"></slot>
                </div>
                <div class="xo-n">
                    <slot name="n"></slot>
                <div>
            </form>
            <div>`;
        }),
        html`Loading...`
      )}
    `;
  }

  firstUpdated() {
    this.validation = new Validation(this);
    this.checkUrlState();
    this.emit("first-updated");
  }

  emit(name, detail = {}) {
    this.dispatchEvent(
      new CustomEvent(name, {
        detail: detail,
      })
    );
  }

  get url() {
    return this._url;
  }

  checkUrlState() {
    // if (this.url.pathname.startsWith("/page/")) {
    //   let pg = parseInt(this.url.pathname.substring(6));
    //   if (pg) {
    //     this.context.data.set("#/_xo/nav/page", pg);
    //   }
    // }
  }

  getSlotted(node) {
    const slot = node.shadowRoot?.querySelector("slot");
    return [...(slot?.assignedElements({ flatten: true }) || [])];
  }
}

export default Form;
window.customElements.define("xo-form", Form);
