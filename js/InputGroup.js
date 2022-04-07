import { LitElement, html, css } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { repeat } from "lit/directives/repeat.js";

class InputGroup extends LitElement {
  _value = [];
  _layout = "default";

  static get styles() {
    return [
      css`
        .cards {
          width: 100%;
          flex-wrap: wrap;
          display: grid;
          grid-template-columns: repeat(
            auto-fill,
            minmax(var(--card-width), 1fr)
          );
          grid-auto-rows: minmax(var(--card-height), auto);
          gap: 0.3rem;
        }

        .cards label {
          position: relative;
          min-width: var(--card-width, 120px);
          min-height: var(--card-height, 120px);
          background-color: var(--xo-card-background);
          background-repeat: no-repeat;
          background-size: contain;
          border-radius: 10px;
          border: 2px solid var(--xo-input-border-color);
          background-image: var(--image);
          transition: all 0.2s;
        }

        .cards label:hover {
          transition: all 0.2s;
          border-color: var(--xo-input-border-color-hover);
        }

        .cards input {
          visibility: hidden;
        }
        .cards .xo-sl {
          color: white;
          vertical-align: middle;
          text-align: center;
        }

        .cards label.has-image .xo-sl {
          position: absolute;
          display: block;
          width: 100%;
          bottom: 0;
          left: 0;
          background-color: rgba(0, 0, 0, 0.4);
        }

        .cards label.has-image .xo-sl {
          opacity: 0;
        }

        .cards label.has-image:hover .xo-sl {
          opacity: 1;
          transition: all 0.2s ease;
        }

        label.selected {
          border-color: var(--accent) !important;
        }

        .cards label.selected,
        .list label.selected {
          position: relative;
          transition: all 0.2s;
        }
        .cards label.selected:after {
          font-size: 1.2rem;
          font-weight: 800;
          content: "✓";
          position: absolute;
          top: 5px;
          right: 5px;
          color: white;
        }

        .list label {
          min-width: 160px;
          display: block;
          padding: 1rem 0.5em 1rem 0.5rem;
          border: 2px solid #ccc;
          border-radius: 1rem;
          margin-bottom: 0.3rem;
          transition: all 0.2s;
        }

        .list label.selected {
        }

        .default [type],
        .list [type] {
          position: absolute;
          left: -9999px;
        }

        
      `,
    ];
  }

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

  render() {
    return html`<div class="${this.layout ?? 'default'}" style=${this.getStyle()}>
      ${repeat(
        this.items,
        (item) => item.id,
        (item, index) => {
          item = this.makeItem(item);
          item.checked = this.isSelected(item);
          item.style = this.getItemStyle(item);
          item.class = this.getItemClass(item);
          return this.renderItem(item);
        }
      )}
    </div>`;
  }

  renderItem(item) {
    return html`<label
      title=${item.label}
      class=${ifDefined(item.class ? item.class : undefined)}
      style=${ifDefined(item.style ? item.style : undefined)}
      ><input
        @change=${this.change}
        @click=${this.toggleCheck}
        .checked=${item.checked}
        type=${this.inputType}
        name="${this.name}"
        value="${item.value}"
      /><span class="xo-sl"> ${item.label}</span></label
    >`;
  }

  getItemClass(item) {
    return `${item.checked ? "selected" : ""} ${
      item.image ? "has-image" : ""
    }`.trim();
  }

  getItemStyle(item) {
    let s = item.image ? `--image: url(${item.image})` : undefined;
    return s;
  }

  getStyle() {
    switch (this.layout) {
      case "cards":
        return `--card-width: ${this.cardWidth}; --card-height: ${this.cardHeight}`;
    }
  }

  get inputType() {
    throw Error("Not implemented");
  }

  change(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  onInput(e) {
    e.stopPropagation();
  }

  reportValidity() {}

  toggleCheck(e) {
    throw Error("Not implemented");
  }

  checkValidity() {
    //TODO
    return this.required && !this.value ? false : true;
  }

  isSelected(item) {
    throw Error("Not implemented");
  }

  makeItem(item) {
    return typeof item === "string" ? { value: item, label: item } : item;
  }
}
export default InputGroup;
