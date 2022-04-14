import { html, css, LitElement } from "lit";
import { repeat } from "lit/directives/repeat.js";
import formFiles from "../data/forms/examples.json";

class ExampleList extends LitElement {
  showDrop = false;

  static get styles() {
    return [
      css`
        :host {
          position: relative;
        }
        a:link,
        a:visited {
          text-decoration: none;
          color: inherit;
        }

        a:hover {
          color: var(--accent);
        }

        .icon {
          width: 24px;
          height: 24px;
        }

        .files {
          width: 150px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          background-color: var(--bg-color, rgba(127, 127, 127));
          padding: 0.3rem;
          right: 0;
          position: absolute;
          display: none;
          z-index: 99;
          box-shadow: 2px 2px 2px var(--shadow-color, rgba(127, 127, 127, 0.5));
        }

        .files a {
          display: block;
          padding: 0.3rem;
          text-transform: capitalize;
        }
      `
    ];
  }

  render() {
    return html`<a
        title="Select Example"
        href="#"
        @click=${this.openList.bind(this)}
      >
        <svg class="icon" xmlns="http://www.w3.org/2000/svg">
          <use id="use" href="/data/svg/icons.svg#open" /></svg></a
      >${this.renderDropdown()}`;
  }

  update() {
    super.update();
    this.drop = this.shadowRoot.querySelector(".files");
  }

  renderDropdown() {
    return html`<div @click=${this.selectFile} class="files" style="">
      ${repeat(
        formFiles,
        (item) => item.id,
        (item, index) => {
          return this.renderFile(item, index);
        }
      )}
    </div>`;
  }

  async selectFile(e) {
    e.preventDefault();
    let sf = document.querySelector("xw-schemaeditor");
    sf.src = e.target.href;
  }

  renderFile(file) {
    return html`<a href=${file.value}>${file.name}</a>`;
  }

  openList(e) {
    const me = this;
    if (e && e.preventDefault) e.preventDefault();
    this.showDrop = typeof e === "boolean" ? e : !this.showDrop;
    this.drop.style.display = this.showDrop ? "block" : "none";
    if (this.showDrop) {
      setTimeout(() => {
        document.addEventListener(
          "keydown",
          (e) => {
            if (e.key === "Escape") {
              this.openList(false);
            }
          },
          {
            once: true
          }
        );
        document.addEventListener(
          "click",
          (e) => {
            this.openList(false);
          },
          { once: true }
        );
      }, 10);
    }
  }
}
customElements.define("xw-example-list", ExampleList);
export default ExampleList;
