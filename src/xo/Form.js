import { html, css } from "lit";
import Control from "./Control";
import Validation from "./Validation";
import Navigation from "./Navigation";
import { EventBus } from "./EventBus";
import Context from "./Context";

class Form extends Control {
  elements = {};

  constructor() {
    super();
    this._url = new URL(document.location.href);
    this._context = new Context(this);
    this._page = 1;
  }

  static styles = css`
    .xo-c {
      opacity: 0;
    }

    .xo-c.ready {
      opacity: 1;
      transition: all .3s;
      transition-delay: 350ms;
    }
  `

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
    };
  }

  get context() {
    return this._context;
  }

  set page(value) {
    if (value < 1) return;
    else if (value > this.querySelectorAll("xo-page").length) return;

    if (value > this._page) {
      this.validation.isPageValid(this._page);
    }

    this._page = value;

    this.requestUpdate();
  }

  set schema(schema) {
    this._schema = schema;

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

  get schema() {
    return this._schema;
  }

  get page() {
    return this._page;
  }

  registerElement(elm) {
    if (elm.name) {
      this.elements[elm.name] = elm;
    }
  }

  render() {
    return html`${this.injectedStyles}<div class="xo-c" data-page="${this.page}">
    <form>
        <div class="xo-w">
            <slot name="w"></slot>
        </div>
        <div class="xo-n">
            <slot name="n"></slot>
        <div>
    </form>
    <div>`;
  }

  firstUpdated() {
    this.validation = new Validation(this);

    this.checkUrlState();

    this.shadowRoot.querySelector(".xo-c").classList.add("ready")
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
