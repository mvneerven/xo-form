import xo from "../xo";
import { css, html } from "lit";
import Context from "../xo/Context";

class Theme extends xo.Control {
  static get properties() {
    return {
      dark: {
        type: Boolean,
      },
    };
  }
  static get styles() {
    return [
      Context.sharedStyles,
      css`
        button {
          outline: none;
          padding: 0.5rem;
          border-radius: 100%;
          background-color: var(--theme-bg);
          position: fixed;
          top: 5px;
          right: 5px;
        }
      `,
    ];
  }

  render() {
    return html`<button
      @click=${this.click}
      style="--theme-bg: ${this.dark
        ? "rgba(100,100,100,.8)"
        : "rgba(50,50,50,.8)"}"
    >
      ${this.dark ? "🔆" : "🌙"}
    </button>`;
  }

  click(e) {
    this.dark = !this.dark;
  }

  get dark() {
    return document.documentElement.classList.contains("theme-dark");
  }

  set dark(value) {
    document.documentElement.classList[value ? "add" : "remove"]("theme-dark");
    this.requestUpdate();
  }
}

customElements.define("pwa-theme", Theme);
export default Theme;
