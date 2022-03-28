import { html, css, LitElement } from "lit";

export class Dialog extends LitElement {
  static styles = css`
    dialog {
      padding: 50px;
      border-radius: 5px;
      opacity: 1;
      border: 0;
      box-shadow: 5px 5px 43px 5px rgba(0, 0, 0, 0.37);
      transition: opacity 0.4s;
    }

    dialog.opening {
      opacity: 0;
      transition: opacity 0.2s ease
    }

    dialog::backdrop {
      background: rgba(0, 0, 0, 0.4);
    }

    dialog a.close {
      position: absolute;
      display: inline-block;
      top: 3px;
      right: 3px;
      padding: 0.2rem 0.5rem;
      color: black;
      background-color: rgba(40, 40, 40, 0.3);
      border-radius: 1rem;
      cursor: pointer;
    }

    dialog a.close:hover {
      filter: brightness(200%);
    }
  `;

  static properties = {
    modal: { type: Boolean },
    display: { type: Boolean },
  };

  render() {
    console.log("render dialog");
    return html`<dialog>
      <a class="close" @click=${this.close}>⨉</a>
      <h1>Hello</h1>
      <p>Welcome to the HTML 5.2 <code>dialog</code> element.</p>
    </dialog>`;
  }

  close(e) {
    this.value = false;
  }

  fireChange() {
    this.dispatchEvent(
      new Event("change", { bubbles: true, cancelable: false })
    );
  }

  set value(value) {
    const me = this;
    if (!this.shadowRoot) return;

    const dlg = this.shadowRoot.querySelector("dialog");
    dlg.addEventListener("close", (e) => {
      me.fireChange();
    });

    dlg.classList.add("opening");
    setTimeout(() => {
      dlg.classList.remove("opening");
    }, 100);

    if (value) dlg[this.modal ? "showModal" : "show"]();
    else dlg.close();
  }

  checkValidity() {
    return true;
  }

  get value() {
    return this.shadowRoot.querySelector("dialog").open;
  }
}
customElements.define("xw-dialog", Dialog);
export default Dialog;
