import { LitElement, html, css } from "lit";

//import ac from "xo-form/dist/xo-autocomplete.js";
import ac from "../src/autocomplete";

const AutoComplete = ac.AutoComplete;

class OmniBox extends LitElement {
  _value = [];

  _categories = {};

  static get properties() {
    return {
      categories: { type: Object },
      value: { type: Object },
      placeholder: { type: String },
    };
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
        }
      `,
    ];
  }

  get categories() {
    return this._categories;
  }

  set categories(categories) {
    this._categories = categories;
  }

  render() {
    return html`<div>
      <input placeholder=${this.placeholder} type="search" />
    </div>`;
  }

  firstUpdated() {
    super.firstUpdated();

    let input = this.shadowRoot.querySelector("input");

    input.addEventListener("result-selected", (e) => {
      input.value = e.detail.text;
    });

    this._autoCompleter = new AutoComplete(this, input, {
      categories: this.categories,
      items: this.items,
    });
    this._autoCompleter.attach();
  }

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
