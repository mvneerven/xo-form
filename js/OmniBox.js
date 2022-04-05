import { LitElement, html, css } from "lit";
import { until } from "lit/directives/until.js";
//import ac from "xo-form/dist/xo-autocomplete.js";
import ac from "../src/autocomplete";

const AutoComplete = ac.AutoComplete;

class OmniBox extends LitElement {
  _value = [];

  _categories = null;

  static get properties() {
    return {
      categories: { type: Object },
      value: { type: Object },
      placeholder: { type: String, attribute: true },
      src: {
        type: String,
      },
    };
  }

  constructor() {
    super();

    this.input = document.createElement("input");
    this.input.type = "search";
    this.input.addEventListener("input", this.onInput.bind(this));
  }

  static get styles() {
    return [
      AutoComplete.sharedStyles,
      css`
        input {
          border: 0px;
          width: 100%;
          outline: none;
          background-color: transparent;
          line-height: 1.1rem;
          color: var(--text-color);
        }
      `,
    ];
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

  set placeholder(placeholder) {
    this._placeholder = placeholder;
    if (this.input) {
      this.input.setAttribute("placeholder", this._placeholder);
    }
  }

  get placeholder() {
    return this._placeholder;
  }

  async readSchema() {
    if (!this._categories) {
      if (this.src) {
        try {
          let r = await import(this.src);
          const key = Object.keys(r)[0];
          this._categories = r[key];
        } catch (x) {
          throw Error(
            "Could not load omnibox settings from " +
              this.src +
              ". " +
              x.message
          );
        }
      }
    }
    if (!this.categories) return false;

    if (!this._autoCompleter && this.input != null) {
      this._ready = true;
      this.requestUpdate();
    }

    return true;
  }

  get categories() {
    return this._categories;
  }

  set categories(categories) {
    this._categories = categories;
  }

  render() {
    return html`
      ${until(
        this.readSchema().then((ready) => {
          if (!ready) {
            return html``;
          }

          return html`<div>${this.input}</div>`;
        }),
        html`Loading...`
      )}
    `;
  }

  update() {
    super.update();

    if (this._ready) {
      setTimeout(() => {
        this.input.addEventListener("result-selected", (e) => {
          this.input.value = e.detail.text;
        });
        this._autoCompleter = new AutoComplete(this, this.input, {
          categories: this.categories,
          items: this.items,
        });
        this._autoCompleter.attach();
      }, 10);
    }
  }

  onInput(e) {
    this.value = this.input.value;
    this.fireChange();
  }

  fireChange() {
    this.dispatchEvent(
      new Event("change", { bubbles: true, cancelable: false })
    );
  }

  get value() {
    let input = this.input;
    if (input) {
      this._value = input.value;
    }
    return this._value;
  }

  set value(value) {
    this._value = value;
    let input = this.input;
    if (input) {
      input.value = value;
    }
  }

  // get input() {
  //   return this.shadowRoot?.querySelector("input");
  // }

  // firstUpdated() {
  //   super.firstUpdated();

  // }

  async items(options) {
    let arr = [];
    options.results = [];

    for (var c in options.categories) {
      let catHandler = options.categories[c];
      catHandler.trigger =
        catHandler.trigger ??
        ((e) => {
          return true;
        });
      options.results = arr;
      if (catHandler.trigger(options)) {
        let catResults = [];
        try {
          catResults = await catHandler.getItems(options);
        } catch (ex) {
          console.warn(`Error loading items for omniBox category '${c}'.`, ex);
        }

        arr = arr.concat(
          catResults.map((i) => {
            i.category = c;
            return i;
          })
        );
      }
    }
    return arr;
  }

  get value() {
    return this._value;
  }

  set value(value) {
    this._value = value;
  }
}
export default OmniBox;
window.customElements.define("xw-omnibox", OmniBox);
