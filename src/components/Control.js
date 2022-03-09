import { LitElement, html, css } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import AutoComplete from '../modules/AutoComplete';

class Control extends LitElement {

  _disabled = false;
  _clicked = 0;

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
      value: { type: Object }
    };
  }

  get valid() {
    return this.checkValidity()
  }

  connectedCallback() {
    super.connectedCallback();

    this.form = this.closest("xo-form");
    this.form?.registerElement(this);
    
    this.acceptMappedState();

    this.shadowRoot.addEventListener("focus", this.onfocus.bind(this));
    this.shadowRoot.addEventListener("blur", this.onblur.bind(this));
    this.shadowRoot.addEventListener("input", this.onInput.bind(this));
    this.shadowRoot.addEventListener("change", this.onInput.bind(this));
  }

  firstUpdated(){
    if (this.nestedElement instanceof HTMLInputElement) {
      this.context.mapper.tryAutoComplete(this, this.autocomplete );
    }
  }

  acceptMappedState(){
    
  }

  get injectedStyles() {
    return html`<link rel="stylesheet" href="/css/controls.css" />`;
  }

  onfocus(e) {
    this.focus = true
  }

  onInvalid(e) {
    debugger
    e.preventDefault();

  }

  onInput(e) {
    e.preventDefault()
    e.stopPropagation();
    e.stopImmediatePropagation();

    const source = e.composedPath()[0]
    this.value = source.value;

    const detail = {
      control: this,
      source: source,
      value: source.value
    };
    eventBus.fire("xo-interaction", detail)
  }

  // special case: button hosted
  click(e) {
    const source = e.composedPath()[0]
    this._clicked++;
    console.log(this._clicked)
    const detail = {
      control: this,
      source: source,
      value: this._clicked
    };
    eventBus.fire("xo-interaction", detail)
  }

  checkValidity() {
    return this.nestedElement && this.nestedElement.checkValidity ? this.nestedElement.checkValidity() : true
  }

  reportValidity() {
    return this.nestedElement ? this.nestedElement.reportValidity() : undefined
  }

  onblur(e) {
    this.focus = false
  }

  fireChange() {
    this.dispatchEvent(new Event("change", { bubbles: true, cancelable: false }));
  }

  get value() {
    return this.nestedElement?.value;
  }

  set value(value) {
    
    if (this.nestedElement) {
       if(this.nestedElement instanceof HTMLSelectElement){
        let index = this.items.findIndex(v=>{
          return value === v.value || v
        });
        this.nestedElement.selectedIndex = index
      }
      else{
        this.nestedElement.value = value ?? "";// setAttribute("value", value ?? "")
      }
    }
  }

  createControl(context, type, properties, options = {}) {
    if (!context || !context.data)
      throw Error("Invalid or missing context");
    let elm;

    if (customElements.get("xo-" + type))
      type = "xo-" + type;

    if (type.startsWith("xo-")) {
      elm = document.createElement(type)
    }
    else {
      try {
        elm = document.createElement(type)
        if (elm.__proto__?.constructor.name === "HTMLUnknownElement") {
          throw new Error("Invalid Element type")
        }

      }
      catch {
        if (type.indexOf("-") === -1) {
          elm = document.createElement("input");
          try {
            elm.type = type;
          }
          catch { }
        }
      }
      let wrapper = document.createElement("xo-control");
      wrapper.nestedElement = elm;
      elm = wrapper;

    }
    if (elm) {
      elm.parent = this;
      elm.options = options;
      context.parent = this;
      // context = {
      //     ...context,
      //     parent: parent,
      //     ...options
      //   }
      elm.context = context;
      
      context.mapper.map(elm, properties);
      if (elm.loadXoSchema) {
        elm.loadXoSchema(properties)
      }
    }
    
    return elm;
  }

  getClasses() {
    let cls = [];
    if (this.hidden) {
      cls.push("xo-hd")
    }
    if (this.focus) {
      cls.push("xo-fc")
    }
    if (this.disabled) {
      cls.push("xo-ds")
    }
    return cls.join(" ");
  }

  render() {
    let nav = this.closest("xo-nav");
    if (nav) {
      return html`${this.injectedStyles}${this.renderInput()}`;
    }

    if (this.nestedElement?.nodeName === "BUTTON") {
      this.nestedElement.removeEventListener("click", this.click);
      this.nestedElement.addEventListener("click", this.click.bind(this));
      return html`${this.injectedStyles}${this.renderInput()}`;
    }

    return html`${this.injectedStyles}<div ${this.hidden ? " hidden" : ""} class="xo-cn ${this.getClasses()}">
  <div class="xo-ct">
    <label for="${this.id}" aria-hidden="true" class="xo-lb"
      title="${this.label}">${this.label}${this.renderRequired()}</label>
    <div class="xo-in">
      ${this.renderInput()}
    </div>
  </div>
  <div class="xo-io">
    <div class="xo-hl">
      ${this.getValidation()}
    </div>
  </div>
</div>`;
  }

  renderRequired() {
    return this.required ? html`<sup>*</sup>` : ''
  }

  renderInput() {
    return this.renderNestedElement()
  }

  renderNestedElement() {
    return this.nestedElement
  }



  set bind(value) {
    if (typeof (value) !== "string")
      throw Error("Invalid binding value");
    if (!value.startsWith("#/"))
      throw Error("Invalid binding value");

    this._bind = value;
  }

  get bind() {
    return this._bind;
  }

  getValidation() {
    if (!this.valid) {
      return html`<small class="xo-vl">${this.validationText || this.invalidMessage}</small>`
    }
  }

  get disabled() {
    return this._disabled;
  }

  toString() {
    if (this.nestedElement) {
      if (this.nestedElement.nodeName === "INPUT")
        return `${this.nestedElement.nodeName}[type="${this.nestedElement.type}"]`;

      return this.nestedElement.nodeName
    }
    return this.nodeName;
  }

  set disabled(value) {
    this._disabled = value;
  }

  set invalidMessage(value) {
    this._invalidMessage = value;
  }

  get invalidMessage() {
    return this._invalidMessage;
  }

  //declared as method on a Custom Element:
  closestElement(
    selector,      // selector like in .closest()
    base = this,   // extra functionality to skip a parent
    __Closest = (el, found = el && el.closest(selector)) =>
      !el || el === document || el === window
        ? null // standard .closest() returns null for non-found selectors also
        : found
          ? found // found a selector INside this element
          : __Closest(el.getRootNode().host) // recursion!! break out to parent DOM
  ) {
    return __Closest(base);
  }

  query(e) {
    let nodes = [];
    const recursion = (c, e) => {
      let result = [...c.querySelectorAll(e), ...c.shadowRoot?.querySelectorAll(e) || []];
      nodes.push(...result);
      for (let item of [...c.childNodes]) {
        if (item.nodeType === 1) {
          recursion(item, e)
        }
      }
    }
    recursion(this, e);
    return nodes;
  }
}

window.customElements.define('xo-control', Control);
export default Control;