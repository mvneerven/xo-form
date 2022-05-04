import { html, css } from "lit";
import Control from "./Control";
import Validator from "./Validator";
import { until } from "lit/directives/until.js";
import { version } from "../../package.json";
import Util from "./Util";
import Model from "./Model";

/**
 * Main xo-form element
 */
class Form extends Control {
  elements = {};

  /**
   * Built-in mixins
   */
  static get mixins() {
    return {
      submit: {
        // shortcut for submit buttons
        disabled: "#/_xo/disabled/send",
        bind: "#/state/commit"
      }
    };
  }

  /**
   * Returns package version
   */
  static get version() {
    return version;
  }

  constructor() {
    super();
    this._page = 1;
  }

  static get properties() {
    return {
      ...Control.properties,
      page: {
        type: Number,
        attribute: true
      },
      schema: {
        type: Object
      },
      src: {
        type: String,
        attribute: true
      },
      theme: {
        type: String,
        attribute: true
      },
      validation: {
        type: String
      },

      icons: {
        type: String
      }
    };
  }

  get form() {
    return this;
  }

  set form(value) {}

  /**
   * @param value {Number}
   */
  set page(value) {
    if (value === null || typeof value === "undefined") return;

    if (value === this._page) return;

    if (value < 1) return;
    else if (value > this.querySelectorAll("xo-page").length) return;

    if (value > this._page) {
      this.validator.isPageValid(this._page);
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
   * Sets the Form Schema to read.
   */
  set schema(schema) {
    if (!this._schema) {
      this._schema = schema;
      this.innerHTML = ""; // important, keep here for inline validation to work
      this.requestUpdate();
    } else {
      let form = this;

      // trick to get a clean sheet
      setTimeout(() => {
        const newForm = document.createElement(this.nodeName);
        newForm.id = form.id;
        newForm.theme = form.theme;
        newForm.schema = schema;
        form = Util.replaceDOMElement(form, newForm);
      }, 0);
    }
  }

  /**
   * Gets the Form Schema
   */
  get schema() {
    return this._schema;
  }

  dispose() {
    super.dispose();
    this.model.dispose(); // = null;
    this.elements = {};
    this.innerHTML = "";
  }

  /**
   *
   * @param {HTMLElement} element
   */
  registerElement(element) {
    if (element.id) {
      this.elements[element.id] = element;
    }
  }

  /**
   * Sets the URL to read a Form Schema from
   */
  set src(url) {
    this._src = url;
  }

  /**
   * Returns the URL to read a Form Schema from
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
          throw Error(
            "Could not load schema from " + this.src + ". " + x.message
          );
        }
      }
    }
    if (!this.schema) return false;

    this.interpretSchema();
    //await new Promise((resolve) => setTimeout(resolve, 3000));
    return true;
  }

  interpretSchema() {
    if (typeof this.schema !== "object") throw Error("Invalid schema");

    this.schema.page = "#/_xo/nav/page";

    this.schema.pages = this.schema.pages ?? [];

    this.emit("initialized");

    this._model = new Model(this, this.schema.model);
    console.log("model", this.model);

    let index = 1;
    for (let page of this.schema.pages) {
      page.index = index++;
      let pageElement = this.createControl(this, page.type ?? "xo-page", page);
      pageElement.setAttribute("slot", "w");
      this.appendChild(pageElement);
    }

    this.nav = this.createControl(this, "xo-nav", this.schema);

    this.nav.controls = this.nav.controls;
    this.nav.setAttribute("slot", "n");
    this.appendChild(this.nav);

    this.emit("ready");

    console.debug("Model Bindings: ", this.model.bound);

  }

  render() {
    return html`
      ${until(
        this.readSchema().then((ready) => {
          if (!ready) {
            return html``;
          }

          return html`<div class="xo-c" data-page="${this.page}">
            <form>
              <div class="xo-w">
                <slot name="w"></slot>
              </div>
              <div class="xo-n">
                <slot name="n"></slot>
              </div>
            </form>
          </div>`;
        }),
        html`Loading form...`
      )}
    `;
  }

  firstUpdated() {
    console.debug("Set up validator");
    this.validator = new Validator(this);
    this.emit("first-updated");
  }

  get model() {
    return this._model;
  }
}

export default Form;
window.customElements.define("xo-form", Form);
