import { LitElement, html, css } from "lit";
import { repeat } from "lit/directives/repeat.js";

import AutoComplete from "../src/autocomplete/AutoComplete";

const DEF_MAX_WIDTH = "100%";

class Tags extends LitElement {
  _value = [];

  constructor() {
    super(...arguments);
    this.textInput = document.createElement("input");
    this.textInput.type = "text";
    this.textInput.addEventListener("keydown", this.input.bind(this));
    this.listenToAutoCompleteEvents();
  }

  listenToAutoCompleteEvents() {
    this.textInput.addEventListener("result-selected", (e) => {
      this.textInput.value = e.detail.text;
      this.tryAdd();
    });

    this.textInput.addEventListener("show-results", (e) => {
      const r = e.detail.results;
      this.value.forEach((tag) => {
        let index = r.findIndex((i) => {
          return i.text === tag;
        });
        if (index !== -1) {
          r.splice(index, 1);
        }
      });
    });
  }

  set placeholder(value) {
    this.textInput.placeholder = value;
  }

  get placeholder() {
    return this.textInput.placeholder;
  }

  firstUpdated() {
    super.firstUpdated();
    if (this.autocomplete && this.autocomplete.items) {
      this._autoCompleter = new AutoComplete(
        this,
        this.textInput,
        this.autocomplete
      );
      this._autoCompleter.attach();
    }
  }

  static get styles() {
    return [
      AutoComplete.sharedStyles,
      css`
        .xo-ac-rs {
          top: 2rem;
        }

        input {
          border: 0;
          outline: 0;
          background: transparent;
        }
        .tags {
          position: relative;
          display: flex;
          width: 100%;
          flex-wrap: wrap;
          gap: 0.3rem;
          max-width: var(--max-tags-width, 400px);
          min-height: 1.85rem;
        }
        .tag {
          white-space: nowrap;
          display: inline-block;
          border-radius: 0.3rem 1rem 1rem 0.3rem;
          background-color: var(--xo-card-background);
          color: var(--xo-card-color);
          padding: 0.3rem 0.6rem;
          margin-right: 0.3rem;
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
      maxWidth: {
        type: String,
      },
      autocomplete: {
        type: Object,
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
      return;
    }

    this._value = value;
  }

  render() {
    return html`<div
      class="tags"
      style="--max-tags-width: ${this.maxWidth ?? DEF_MAX_WIDTH}"
    >
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

  reportValidity() {
    return true;
  }

  checkValidity() {
    return true;
  }

  input(e) {
    switch (e.key) {
      case "Enter":
        if (e.target.value !== "") {
          this.tryAdd(e.target.value);
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

  tryAdd() {
    if (this.value.indexOf(this.textInput.value) === -1) {
      this.value.push(this.textInput.value);
      this.fireChange();
      this.requestUpdate();
      this.textInput.value = "";
    }
  }

  fireChange() {
    this.dispatchEvent(
      new Event("change", { bubbles: true, cancelable: false })
    );
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

customElements.define("xw-tags", Tags);
export default Tags;
