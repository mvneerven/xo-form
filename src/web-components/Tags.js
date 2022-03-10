import { LitElement, html, css } from "lit";
import { repeat } from "lit/directives/repeat.js";
import xo from "../xo";

class Tags extends xo.control {
    _value = [];

    static styles = css`
    .tags {
      display: flex;
    }
    .tag {
      white-space: nowrap;
      display: inline-block;
      margin: 0.4rem;
      border-radius: 1rem;
      background-color: rgb(50, 50, 50);
      padding: 0.6rem 1rem;
    }
    .r90 {
      display: inline-block;
      transform: rotate(90deg);
    }
  `;

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
          return this.renderTag(item);
        }
      )}
    <input @keydown=${this.input} type="text" />
</div>`;
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

                break
        }

    }

    renderTag(value) {
        return html`<div class="tag"><span class="r90">⌂</span><span>${value}</span><a>x</a></div>`;
    }
}

customElements.define("xo-tags", Tags);
export default Tags;
