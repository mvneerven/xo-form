import { LitElement, html, css } from "lit";
import { repeat } from "lit/directives/repeat.js";

class OmniBox extends LitElement {
  _value = [];

  static get properties() {
    return {
      categories: { type: Array },
      value: { type: Object },
    };
  }

  static get styles(){
      return css`
        input {
            border: 0px;
            outline: none;
            background-color: transparent;
            line-height: 1.1rem;
        }
      `
  }

  constructor() {
    super();
    this.categories = [];

  }

  render() {
    return html`<input type="search" @input=${this.onInput.bind(this)} />`;
  }

  onInput(e){
    debugger;
  }

  change(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  fireChange() {
    this.dispatchEvent(
      new Event("change", { bubbles: true, cancelable: false })
    );
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
