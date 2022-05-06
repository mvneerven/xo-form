import { LitElement, html, css } from "lit";
import AutoComplete from "../autocomplete/AutoComplete";
import Util from "./Util";
import xo from "./index";
import xoStyles from "../../css/controls.css";
import PropertyMapper from "./PropertyMapper";

const ERR_INVALID_BINDING = "Invalid binding value";

/**
 * Base Control for internal controls, and wrapping Control for other HTML elements
 */
class Control extends LitElement {
  static _sheet;
  _disabled = false;
  _clicked = 0;
  _context = null;
  _valid = true;
  _container = true;
  _mapper = new PropertyMapper(this);

  onInteraction(e) {
    const me = this;

    console.debug("interaction: ", e.detail.control?.bind);

    if (e.detail.control?.bind) {
      const path = e.detail.control?.bind;
      me.setData(path, e.detail.value, e.detail);
    }
  }

  get data() {
    return this._data;
  }

  static get properties() {
    return {
      name: { type: String, attribute: true },
      bind: { type: String },
      children: { type: Object, raw: true },
      type: { type: String, attribute: true },
      hidden: { type: Boolean, attribute: true },
      container: { type: Boolean },
      disabled: { type: Boolean },
      required: { type: Boolean, attribute: true },
      autofocus: { type: Boolean },
      hasFocus: { type: Boolean },
      label: { type: String },
      title: { type: String },
      placeholder: { type: String, attribute: true },
      value: { type: Object },
      classes: { type: Array },
      autocomplete: { type: Object },
      prepend: { type: Object },
      append: { type: Object },
      mixin: { type: Object },
      valid: { type: Boolean }
    };
  }

  static get styles() {
    return [this.sharedStyles, AutoComplete.sharedStyles];
  }

  /**
   * @returns {CSSStyleSheet}
   */
  static get sharedStyles() {
    if (!this._sheet) {
      this._sheet = Util.createStyleSheet(new Document(), xoStyles);
    }
    return this._sheet;
  }

  /**
   * Sets the children to append.
   * @param value {Array}
   */
  set children(value) {
    this.innerHTML = "";

    this._children = value;

    for (let child of this._children) {
      let element = this.createControl(this, child.type, child);
      this.appendChild(element);
    }
  }

  /**
   * @returns {Array} - Array of children to be appended.
   */
  get children() {
    return this._children;
  }

  /**
   * Allows for proper disposing
   */
  dispose() {
    this.nested?.removeEventListener("focus", this.onfocus);
    this.nested?.removeEventListener("blur", this.onblur);
    this.shadowRoot.removeEventListener("input", this.onInput);
    this.shadowRoot.removeEventListener("change", this.onInput);
    this.off("interaction", this.onInteraction.bind(this));
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
    this.form?.registerElement(this);
    this.acceptMappedState();
    this.nested?.addEventListener("focus", this.onfocus.bind(this));
    this.nested?.addEventListener("blur", this.onblur.bind(this));
    this.shadowRoot.addEventListener("input", this.onInput.bind(this));
    this.shadowRoot.addEventListener("change", this.onInput.bind(this));
    this.on("interaction", this.onInteraction.bind(this));
  }

  disconnectedCallback() {
    this.dispose();
  }

  firstUpdated() {
    if (this.autocomplete && this.autocomplete.items) {
      if (this.nested instanceof HTMLInputElement) {
        this.tryApplyAutoComplete();
      }
    }
  }

  set autocomplete(options) {
    this._autocomplete = options;
  }

  get autocomplete() {
    return this._autocomplete;
  }

  tryApplyAutoComplete() {
    this._autoCompleter = new AutoComplete(
      this,
      this.nested,
      this.autocomplete
    );
    this._autoCompleter.attach();
  }

  acceptMappedState() {}

  onfocus(e) {
    e.stopPropagation();
    this.hasFocus = true;
  }

  onInput(e) {
    const me = this;
    if (e.type === "input" && this.nested) {
      //console.log(e.target)
      if (this.nested.nodeName.indexOf("-") !== -1) return;
    }

    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    const source = e.composedPath()[0];

    if (e.type === "change") {
      if (
        typeof this.__lastInputValue !== "undefined" &&
        this.__lastInputValue === this.value
      ) {
        return; // not really changed
      }
    }

    const emit = () => {
      me.emit(
        "interaction",
        {
          type: "input",
          control: this,
          source: source,
          value: me.value,
          guid: Util.guid()
        },
        {
          bubbles: true
        }
      );
    };

    if (xo.options.throttleInput) {
      if (this.inputTmr) clearTimeout(this.inputTmr);
      if (this.value !== me.oldValue) {
        me.inputTmr = setTimeout(() => {
          me.oldValue = this.value;

          emit();
        }, xo.options.throttleInput);
      }
    } else {
      emit();
    }

    if (e.type === "input") this.__lastInputValue = this.value;
  }

  emit(
    name,
    detail = {},
    options = {
      bubbles: true
    }
  ) {
    this.dispatchEvent(
      new CustomEvent(name, {
        detail: detail,
        ...options
      })
    );
  }

  // special case: button hosted
  click(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    e.stopPropagation();

    const source = e.composedPath()[0];
    this._clicked++;

    const value = source.defaultValue || this._clicked;

    this.emit(
      "interaction",
      {
        type: "click",
        control: this,
        source: source,
        value: value,
        guid: Util.guid()
      },
      {
        bubbles: true
      }
    );
  }

  /**
   * @returns {Boolean} true if the control is currently valid
   */
  get valid() {
    return this._valid;
  }

  set valid(value) {
    this._valid = value;
  }

  checkValidity() {
    this._valid =
      this.nested && this.nested.checkValidity
        ? this.nested.checkValidity()
        : true;

    return this._valid;
  }

  reportValidity() {
    return this.nested && this.nested.reportValidity
      ? this.nested.reportValidity()
      : true;
  }

  onblur(e) {
    e.stopPropagation();
    this.hasFocus = false;
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
    return this.nested?.value;
  }

  /**
   * Sets the value of the control - especially when a nested value-managing control is present
   */
  set value(value) {
    if (this.nested) {
      if (this.nested instanceof HTMLSelectElement) {
        let index = this.items.findIndex((v) => {
          return value === v.value || v;
        });
        this.nested.selectedIndex = index;
      } else {
        this.nested.value = value ?? "";
      }
    }
  }

  get container() {
    return this._container;
  }

  set container(value) {
    this._container = value;
  }

  set required(value) {
    this._required = value;
    if (this.nested) this.nested.required = value;
  }

  get required() {
    return this.nested?.required ?? this._required;
  }

  set placeholder(value) {
    this._placeholder = value;
    if (this.nested) this.nested.placeholder = value;
  }

  get placeholder() {
    return this.nested?.placeholder ?? this._placeholder;
  }

  set name(value) {
    this._name = value;
    if (this.nested) this.nested.name = value;
  }

  get name() {
    return this.nested?.name ?? this._name;
  }

  set autofocus(value) {
    this._autofocus = value;
    if (this.nested) this.nested.autofocus = value;
  }

  get autofocus() {
    return this.nested?.autofocus ?? this._autofocus;
  }

  set hidden(value) {
    this._hidden = value;
    if (this.nested) this.nested.hidden = value;
    this.requestUpdate();
  }

  get hidden() {
    return this.nested?.hidden ?? this._hidden;
  }

  /**
   * Sets the disabled state of the control
   * @param {Boolean} value
   */
  set disabled(value) {
    this._disabled = value;
    if (this.nested) this.nested.disabled = value;
    this.requestUpdate();
  }

  /**
   * Returns true if the control is currently disabled
   * @param {Boolean} value
   */
  get disabled() {
    return this.nested?.disabled ?? this._disabled;
  }

  /**
   * Instantiates a Control
   * @param {Control} parent
   * @param {String} type
   * @param {Object} properties
   * @param {Object} options
   * @returns {Control}
   */
  createControl(parent, type, properties, options = {}) {
    type = this.transform(type, properties) || "text";

    parent.emit("create-control", {
      type: type,
      properties: properties
    });

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
      wrapper.setNested(elm);
      elm = wrapper;
    }
    if (elm) {
      elm._parent = this;
      elm._scope = this.scope;
      elm.options = options;
      //elm.properties = properties
      elm.map(properties);

      this.form.emit(
        "created-control",
        {
          control: elm
        },
        {
          bubbles: true
        }
      );
    }

    return elm;
  }

  get parent() {
    return this._parent;
  }

  getForm() {
    let form = null;
    let elm = this;

    while (!form) {
      if (elm.nodeName === "XO-FORM") {
        form = elm;
        break;
      }
      elm = elm.parent;

      if (!elm) break;
    }

    return form;
  }

  get form() {
    if (!this._form) this._form = this.getForm();

    return this._form;
  }

  set children(value) {
    this._children = value;
  }

  get children() {
    return this._children;
  }

  map(properties, singleValue) {
    if (typeof singleValue === "undefined")
      this.form.model.processBindings(this, properties);

    this._mapper.mapProperties(this, properties, singleValue);
  }

  set scope(data) {
    this._scope = data;
  }

  get scope() {
    return this._scope;
  }

  getData(path) {
    const dataAction = this.getDataAction(path);
    return Util.getValue(dataAction.scope, dataAction.path);
  }

  setData(path, value) {
    const dataAction = this.getDataAction(path);
    Util.setValue(dataAction.scope, dataAction.path, value);
  }

  /**
   * Returns structure with scope and path to execute databinding expression.
   * @param {String} path
   * @returns {Object}
   */
  getDataAction(path) {
    if (this.scope && path.startsWith("#/./")) {
      return {
        scope: this.scope,
        path: "#/" + path.substring(4)
      };
    }
    return {
      scope: this.form.model.instance,
      path: path
    };
  }

  setNested(element) {
    this._nested = element;
    var observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (mutation.type === "attributes") {
          // console.warn("MUTATION ATTRIBUTE", mutation.attributeName);

          switch (mutation.attributeName) {
            case "disabled":
              break;
          }
        }
      });
    });

    observer.observe(this._nested, {
      attributes: true //configure it to listen to attribute changes
    });
  }

  get nested() {
    return this._nested;
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
   * - hasFocus: xo-fc
   * - textual control: xo-tx
   * - nested element: xo-ne
   * - nested element textual: xo-tx
   * - has prepend: xo-prp
   * @returns {String}
   */
  getContainerClasses() {
    let cls = [];
    if (this.hidden) {
      cls.push("xo-hd");
    }
    if (this.hasFocus) {
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
    if (this.prepend) {
      cls.push("xo-prp");
    }
    if (this.nested) {
      if (this.nested.value) {
        cls.push("xo-ne");
      }
      if (this.isTextual) {
        cls.push("xo-tx");
      }
    }

    cls.push(this.form?.theme ?? xo.options.defaultTheme ?? "default");

    return [...new Set(cls)].join(" ");
  }

  /**
   * Returns true if the control contains a nested textual input
   */
  get isTextual() {
    return (
      this.nested instanceof HTMLTextAreaElement ||
      (this.nested instanceof HTMLInputElement &&
        ["text", "url", "tel", "password", "email"].includes(
          this.nested.getAttribute("type")
        ))
    );
  }

  render() {
    if (!this.container) {
      return html`${this.renderInput()}`;
    }

    if (this.type) this.setAttribute("data-type", this.type);
    const $h = 1;
    let nav = this.closest("xo-nav");
    if (nav) {
      return html`${this.renderInput()}`;
    }

    if (this.nested instanceof HTMLButtonElement) {
      if (typeof this.nested.defaultValue == "undefined")
        this.nested.defaultValue = this.nested.value;
      this.nested.removeEventListener("click", this.click);
      this.nested.addEventListener("click", this.click.bind(this));
      return html`${this.renderInput(true)}`;
    }

    return html`<div
      part="xo-cn"
      ?hidden=${this.hidden}
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
          ${this.renderPrepend()} ${this.renderInput()} ${this.renderAppend()}
        </div>
      </div>
      <div class="xo-io" part="xo-io">
        <div class="xo-hl" part="xo-hl">${this.getValidation()}</div>
      </div>
    </div>`;
  }

  renderPrepend() {
    if (this.prepend) {
      if (this.prepend.icon) {
        return this.renderIcon(this.prepend.icon);
      } else if (this.prepend.text) {
        return html`<span class="xo-pp">${this.prepend.text}</span>`;
      }
    }
  }

  renderIcon(name) {
    const icon = `${this.form.schema.icons ?? ""}#${name}`;
    return html`<svg
      style="width: 24px; height: 24px"
      xmlns="http://www.w3.org/2000/svg"
    >
      <use id="use" href="${icon}" />
    </svg>`;
  }

  renderAppend() {}

  renderRequiredState() {
    return this.label ? (this.required ? html`<sup>*</sup>` : "") : "";
  }

  renderInput(noContainer) {
    //return html`<slot></slot>`

    return html`${this.renderNestedElement(noContainer)} `;
  }

  renderNestedElement(noContainer) {
    if (noContainer) {
      this.nested.class = this.getContainerClasses();
    }
    return this.nested;
  }

  /**
   * Binds control to model state. Example: '#/data/email'
   */
  set bind(value) {
    if (!PropertyMapper.isExpression(value)) throw Error(ERR_INVALID_BINDING);

    this._bind = value;

    this.value = this.getData(value);
  }

  /**
   * Returns the binding path.
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
   * Attaches listeners to the given events.
   * @param {String|Array} eventName Event name(s) (string) or array containing event names
   * @param {Function} func
   */
  on(eventName, func) {
    const events = Array.isArray(eventName)
      ? eventName
      : [...eventName.split(" ")];
    events.forEach((e) => {
      this.addEventListener(e, func);
    });
    return this;
  }

  off(eventName, func) {
    const events = Array.isArray(eventName)
      ? eventName
      : [...eventName.split(" ")];
    events.forEach((e) => {
      this.removeEventListener(e, func);
    });
    return this;
  }

  toString() {
    if (this.nested) {
      if (this.nested.nodeName === "INPUT")
        return `${this.nested.nodeName}[type="${this.nested.type}"]`;

      return this.nested.nodeName;
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
