import { LitElement, html, css } from "lit";
import { repeat } from "lit/directives/repeat.js";
import xo from "../xo";
import Context from "../xo/Context";

class Tags extends xo.Control {
  _value = [];

  constructor() {
    super(...arguments);
    this.textInput = document.createElement("input");
    this.textInput.type = "text";
    this.textInput.addEventListener("keydown", this.input.bind(this));
  }

  static get styles() {
    return [
      Context.sharedStyles,
      css`
        .tags {
          display: flex;
        }
        .tag {
          white-space: nowrap;
          display: inline-block;
          margin: 0.4rem;
          border-radius: 0.3rem 1rem 1rem 0.3rem;
          background-color: var(--xo-card-background);
          color: var(--xo-card-color);
          padding: .3rem .6rem;
        }
        .eye {
          display: inline-block;
          margin-right: 0.4rem;
          margin-left: -0.4rem;
          opacity: 0.5;
        }

        a {
          display: "inline-block";
          margin-left: 0.3rem;
          cursor: pointer;
          opacity: 0.5;
        }

        a:hover {
          opacity: 1;
        }
      `,
    ];
  }

  static get properties() {
    return {
      value: {
        type: Array,
      },
    };
  }

  onInput(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  get value() {
    return this._value;
  }

  set value(value) {
    if (!Array.isArray(value)) {
      console.warn("Tags value must be array");
      return;
    }

    this._value = value;
  }

  renderInput() {
    return html`<div class="tags">
      ${repeat(
        this.value,
        (item) => item.id,
        (item, index) => {
          return this.renderTag(item, index);
        }
      )}
      ${this.textInput}
    </div>`;
  }

  firstUpdated() {
    super.firstUpdated();
    this.context.mapper.tryAutoComplete(
      this,
      this.textInput,
      this.autocomplete
    );
  }

  input(e) {
    switch (e.key) {
      case "Enter":
        if (e.target.value !== "") {
          if (this.value.indexOf(e.target.value) === -1) {
            this.value.push(e.target.value);
            this.fireChange();
            this.requestUpdate();
            e.target.value = "";
          }
        }

        break;
      case "Backspace":
        if (e.target.value === "") {
          this.value.pop();
          this.fireChange();
          this.requestUpdate();
        }

        break;
    }
  }

  renderTag(value, index) {
    return html`<div data-index="${index}" class="tag">
      <span class="eye">○</span><span>${value}</span>
      <a @click=${this.deleteTag}>x</a>
    </div>`;
  }

  deleteTag(e) {
    e.stopPropagation();
    e.stopImmediatePropagation();
    e.preventDefault();
    let index = parseInt(
      e.target.closest("[data-index]").getAttribute("data-index")
    );
    this.value.splice(index, 1);
    this.requestUpdate();
  }
}

customElements.define("xo-tags", Tags);
export default Tags;
