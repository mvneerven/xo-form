import { LitElement, html, css } from "lit";
import xo from "../xo";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import AutoComplete from "../xo/AutoComplete";
import Context from "./Context";

const ERR_INVALID_BINDING = "Invalid binding value";

/**
 * XO Control (```<xo-control/>```) - both Base Control for XO, and wrapping Control for other HTML elements
 */
class Control extends LitElement {
  _disabled = false;
  _clicked = 0;
  _context = null;

  /**
   * @returns {Context} a reference to the Context instance
   */
  get context() {
    return this._context;
  }

  static get properties() {
    return {
      name: { type: String, attribute: true },
      bind: { type: String },
      type: { type: String, attribute: true },
      hidden: { type: Boolean },
      disabled: { type: Boolean },
      required: { type: Boolean },
      focus: { type: Boolean },
      label: { type: String },
      tooltip: { type: String },
      placeholder: { type: String },
      valid: { type: Boolean },
      value: { type: Object },
      prefix: { type: Object },
      classes: { type: Array },
    };
  }

  /**
   * @returns {Boolean} true if the control is currently valid
   */
  get valid() {
    return this.checkValidity();
  }

  static get styles() {
    return [Context.sharedStyles];
  }

  /**
   * @returns {HTMLElement} closest element up in hierarchy that matches the given selector.
   * @param selector {String} Selector string
   */
  closestElement(
    selector, // selector like in .closest()
    base = this, // extra functionality to skip a parent
    __Closest = (el, found = el && el.closest(selector)) =>
      !el || el === document || el === window
        ? null // standard .closest() returns null for non-found selectors also
        : found
        ? found // found a selector INside this element
        : __Closest(el.getRootNode().host) // recursion!! break out to parent DOM
  ) {
    return __Closest(base);
  }

  connectedCallback() {
    super.connectedCallback();
    this.form = this.closest("xo-form");
    this.form?.registerElement(this);
    this.acceptMappedState();
    this.nestedElement?.addEventListener("focus", this.onfocus.bind(this));
    this.nestedElement?.addEventListener("blur", this.onblur.bind(this));
    this.shadowRoot.addEventListener("input", this.onInput.bind(this));
    this.shadowRoot.addEventListener("change", this.onInput.bind(this));
  }

  disconnectedCallback() {
    this.nestedElement?.removeEventListener("focus", this.onfocus);
    this.nestedElement?.removeEventListener("blur", this.onblur);
    this.shadowRoot.removeEventListener("input", this.onInput);
    this.shadowRoot.removeEventListener("change", this.onInput);
  }

  firstUpdated() {
    if (this.nestedElement instanceof HTMLInputElement) {
      this.context.mapper.tryAutoComplete(
        this,
        this.nestedElement,
        this.autocomplete
      );
    }
  }

  acceptMappedState() {}

  onfocus(e) {
    e.stopPropagation();
    this.focus = true;
  }

  onInput(e) {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    const source = e.composedPath()[0];
    this.form.emit("interaction", {
      type: "input",
      control: this,
      source: source,
      value: this.value,
    });
  }

  // special case: button hosted
  click(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    e.stopPropagation();

    const source = e.composedPath()[0];
    this._clicked++;

    if (this.form) {
      this.form.emit("interaction", {
        type: "click",
        control: this,
        source: source,
        value: source.defaultValue || this._clicked,
      });
    }
  }

  checkValidity() {
    return this.nestedElement && this.nestedElement.checkValidity
      ? this.nestedElement.checkValidity()
      : true;
  }

  reportValidity() {
    return this.nestedElement ? this.nestedElement.reportValidity() : true;
  }

  onblur(e) {
    e.stopPropagation();
    this.focus = false;
  }

  fireChange() {
    this.dispatchEvent(
      new Event("change", { bubbles: true, cancelable: false })
    );
  }

  /**
   * @returns {Object} value of the control - if any
   */
  get value() {
    return this.nestedElement?.value;
  }

  /**
   * Sets the value of the control - especially when a nested value-managing control is present
   */
  set value(value) {
    if (this.nestedElement) {
      if (this.nestedElement instanceof HTMLSelectElement) {
        let index = this.items.findIndex((v) => {
          return value === v.value || v;
        });
        this.nestedElement.selectedIndex = index;
      } else {
        this.nestedElement.value = value ?? "";
      }
    }
  }

  /**
   * Instantiates a Control in the Form Context
   * @param {Context} context
   * @param {String} type
   * @param {Object} properties
   * @param {Object} options
   * @returns {Control}
   */
  createControl(context, type, properties, options = {}) {
    if (!context || !context.data) throw Error("Invalid or missing context");

    type = this.transform(type, properties) || "text";

    let elm;

    if (customElements.get("xo-" + type)) type = "xo-" + type;

    if (type.startsWith("xo-")) {
      elm = document.createElement(type);
    } else {
      try {
        elm = document.createElement(type);
        let className = elm.__proto__?.constructor.name;
        if (["HTMLUnknownElement", "HTMLTimeElement"].includes(className)) {
          throw new Error("Invalid Element type");
        }
      } catch {
        if (type.indexOf("-") === -1) {
          elm = document.createElement("input");
          try {
            elm.type = type;
          } catch {}
        }
      }
      let wrapper = document.createElement("xo-control");
      wrapper.type = type;
      wrapper.nestedElement = elm;
      elm = wrapper;
    }
    if (elm) {
      elm.parent = this;
      elm.options = options;
      context.parent = this;
      elm._context = context;
      context.mapper.mapProperties(elm, properties);
    }

    return elm;
  }

  transform(type, properties) {
    switch (type) {
    }
    return type;
  }

  /**
   * Returns a space-separated string of all classes for the control, based on state and .classes property
   * - hidden: xo-hd
   * - invalid: xo-iv
   * - disabled: xo-ds
   * - focus: xo-fc
   * - textual control: xo-tx
   * - nested element: xo-ne
   * @returns {String}
   */
  getContainerClasses() {
    let cls = [];
    if (this.hidden) {
      cls.push("xo-hd");
    }
    if (this.focus) {
      cls.push("xo-fc");
    }
    if (this.disabled) {
      cls.push("xo-ds");
    }
    if (!this.valid) {
      cls.push("xo-iv");
    }
    if (this.classes) {
      cls.push(...this.classes);
    }
    if (this.nestedElement) {
      if (this.nestedElement.value) {
        cls.push("xo-ne");
      }
      if (this.isTextual) {
        cls.push("xo-tx");
      }
    }

    const theme = this.form?.theme ?? "standard";
    cls.push(theme);

    return cls.join(" ");
  }

  /**
   * Returns true if the control contains a nested textual input
   */
  get isTextual() {
    return (
      this.nestedElement instanceof HTMLTextAreaElement ||
      (this.nestedElement instanceof HTMLInputElement &&
        ["text", "url", "tel", "password", "email"].includes(
          this.nestedElement.getAttribute("type")
        ))
    );
  }

  render() {
    if (this.type) this.setAttribute("data-type", this.type);

    let nav = this.closest("xo-nav");
    if (nav) {
      return html`${this.renderInput()}`;
    }

    if (this.nestedElement instanceof HTMLButtonElement) {
      if (typeof this.nestedElement.defaultValue == "undefined")
        this.nestedElement.defaultValue = this.nestedElement.value;
      this.nestedElement.removeEventListener("click", this.click);
      this.nestedElement.addEventListener("click", this.click.bind(this));
      return html`${this.renderInput(true)}`;
    }

    return html`<div
      part="xo-cn"
      ${this.hidden ? " hidden" : ""}
      class="xo-cn ${this.getContainerClasses()}"
    >
      <div class="xo-ct" part="xo-ct">
        <label
          exportparts="xo-lb: label"
          part="xo-lb"
          for="${this.id}"
          aria-hidden="true"
          class="xo-lb"
          title="${this.label}"
          >${this.label}${this.renderRequiredState()}</label
        >
        <div class="xo-in" part="xo-in" exportparts="xo-in">
          ${this.renderInput()}
        </div>
      </div>
      <div class="xo-io" part="xo-io">
        <div class="xo-hl" part="xo-hl">${this.getValidation()}</div>
      </div>
    </div>`;
  }

  renderRequiredState() {
    return this.label ? (this.required ? html`<sup>*</sup>` : "") : "";
  }

  renderInput(noContainer) {
    return this.renderNestedElement(noContainer);
  }

  renderNestedElement(noContainer) {
    if (noContainer) {
      this.nestedElement.setAttribute(
        "class",
        this.nestedElement.getAttribute("class") +
          " " +
          this.getContainerClasses()
      );
    }
    return this.nestedElement;
  }

  /**
   * Sets the dual binding for this control, using the syntax #/<instancename>/<property-path>
   * Example: `
   *  {
   *    model: {
   *      instance: {
   *        data: {
   *          userName: "john"
   *        }
   *      }
   *  }
   *  -> #/data/userName
   * `
   */
  set bind(value) {
    if (typeof value !== "string" || !value.startsWith("#/"))
      throw Error(ERR_INVALID_BINDING);

    this._bind = value;
  }

  /**
   * Gets the current dual binding path.
   */
  get bind() {
    return this._bind;
  }

  getValidation() {
    if (!this.valid) {
      return html`<small class="xo-vl"
        >${this.validationText || this.invalidMessage}</small
      >`;
    }
  }

  /**
   * Sets the disabled state of the control
   * @param {Boolean} value
   */
  set disabled(value) {
    this._disabled = value;
  }

  /**
   * @returns {Boolean} true if the control is currently disabled
   */
  get disabled() {
    return this._disabled;
  }

  toString() {
    if (this.nestedElement) {
      if (this.nestedElement.nodeName === "INPUT")
        return `${this.nestedElement.nodeName}[type="${this.nestedElement.type}"]`;

      return this.nestedElement.nodeName;
    }
    return this.nodeName;
  }

  /**
   * Sets the invalid state message to show
   */
  set invalidMessage(value) {
    this._invalidMessage = value;
  }

  get invalidMessage() {
    return this._invalidMessage;
  }
}

window.customElements.define("xo-control", Control);
export default Control;
