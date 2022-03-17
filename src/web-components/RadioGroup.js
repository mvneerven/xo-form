import xo from "../xo";
import { html, css } from "lit";
import { repeat } from "lit/directives/repeat.js";

class RadioGroup extends xo.control {
  _value = [];
  _layout = "default";

  static styles = css`
    .cards {
      width: 100%;
      flex-wrap: wrap;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
      grid-auto-rows: minmax(110px, auto);
    }

    .cards label {
      min-width: var(--card-width, 120px);
      min-height: var(--card-height, 120px);
      background-color: var(--xo-card-background);
      background-repeat: no-repeat;
      background-size: contain;
      border-radius: 10px;
      border: 2px solid var(--xo-input-border-color);
      background-image: var(--image);
    }

    .cards label:hover {
      transition: all 0.2s;
      border-color: var(--xo-input-border-color-hover);
    }

    .cards input,
    .cards .xo-sl {
      visibility: hidden;
    }

    label.selected {
      border-color: var(--accent)!important;
    }

    .cards label.selected {
      position: relative;
      transition: all 0.2s;
    }
    .cards label.selected:after {
      font-size: 1.2rem;
      font-weight: 800;
      content: "✓";
      position: absolute;
      top: 0px;
      right: 5px;
      color: white;
    }

    .list label {
      min-width: 160px;
      display: block;
      padding: 1rem 0.5em 1rem 0.5rem;
      border: 2px solid #ccc;
      border-radius: 1rem;
    }

    .list label.selected {
      
    }

    .default [type="radio"],
    .list [type="radio"] {
      position: absolute;
      left: -9999px;
    }

    .default label {
      position: relative;
      padding-left: 16px;
      cursor: pointer;
      margin-right: 1rem;
      display: inline-block;
    }

    .default label:before {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      width: 18px;
      height: 18px;
      border: 1px solid #ddd;
      border-radius: 100%;
      background: #fff;
    }

    .default label:after {
      content: "";
      width: 12px;
      height: 12px;
      background: var(--accent);
      position: absolute;
      top: 4px;
      left: 4px;
      border-radius: 100%;
      -webkit-transition: all 0.2s ease;
      transition: all 0.2s ease;
    }

    .default label:not(.selected):after {
      opacity: 0;
      -webkit-transform: scale(0);
      transform: scale(0);
    }

    .default label.selected:after {
      opacity: 1;
      -webkit-transform: scale(1);
      transform: scale(1);
    }
  `;

  static get properties() {
    return {
      items: { type: Array },
      value: { type: Object },
      layout: { type: String },
      cardWidth: { type: String },
      cardHeight: { type: String },
    };
  }

  constructor() {
    super();
    this.items = [];
  }

  set layout(value) {
    this._layout = value;
  }

  get layout() {
    return this._layout;
  }

  renderInput() {
    let name = this.name;

    return html`<div class="${this.layout}">
      ${repeat(
        this.items,
        (item) => item.id,
        (item, index) => {
          item = this.makeItem(item);
          const checked = this.isSelected(item);
          return html`<label
            class="${checked ? "selected" : ""}"
            style="--image: url(${item.image})"
            ><input
              @change=${this.change}
              @click=${this.toggleCheck}
              .checked=${checked}
              type="radio"
              name="${name}"
              value="${item.value}"
            /><span class="xo-sl"> ${item.label}</span></label
          >`;
        }
      )}
    </div>`;
  }

  change(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  onInput(e) {
    e.stopPropagation();
  }

  toggleCheck(e) {
    e.stopPropagation();

    if (e.target.checked) {
      this._value = e.target.value;
    }

    this.fireChange();
  }

  checkValidity() {
    //TODO
    return this.required && !this.value ? false : true;
  }

  isSelected(item) {
    return this._value === item.value;
  }

  makeItem(item) {
    return typeof item === "string" ? { value: item, label: item } : item;
  }

  get value() {
    return this._value;
  }

  set value(value) {
    this._value = value;
  }
}
export default RadioGroup;
window.customElements.define("xo-radiogroup", RadioGroup);
