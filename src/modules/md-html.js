import { LitElement, html, css } from "lit";
import MarkDown from "./MarkDown";

class MdHtml extends LitElement {
  static get properties() {
    return {
      src: {
        type: String,
        attribute: true,
      },
    };
  }

  render() {
    return html`<div id="md-html"></div>`;
  }

  updated() {
    MarkDown.read(this.src).then((result) => {
      this.shadowRoot.querySelector("#md-html").innerHTML = result;
    });
  }
}
export default MdHtml;
window.customElements.define("md-html", MdHtml);
