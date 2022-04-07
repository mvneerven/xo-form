import { LitElement, html, css } from "lit";
import Monaco from "./Monaco";

class ModelView extends LitElement {
  static get properties() {
    return {
      showModel: {
        type: Boolean,
      },
    };
  }

  static get styles() {
    return [
      css`
        div {
          text-align: right;
        }
        div xw-monaco {
          display: block;
          margin-top: 1rem;
          text-align: left;
        }
      `,
    ];
  }

  render() {
    return html`<div>
      <xw-switch
        @change=${this.toggle.bind(this)}
        text="Show Live Model"
        rtl
        title="Show xo-form model state"
      ></xw-switch>
      ${this.renderViewer()}
    </div>`;
  }

  toggle(e) {
    if (this.showModel && this.form) {
      this.form.off("modelchange", this.updateModel.bind(this));
    }
    this.showModel = e.target.value;
  }

  renderViewer() {
    if (this.showModel) {
      return html`<xw-monaco
        id="model"
        .value=${this.getModelJSON()}
        readonly
        language="json"
        @ready=${this.syncModel.bind(this)}
      ></xw-monaco>`;
    }
  }

  getModelJSON() {
    return JSON.stringify(
      this.form?.context.data.schemaModel?.instance ?? {},
      null,
      2
    );
  }

  syncModel() {
    const me = this;
    if (this.form) {
      this.form.on("modelchange", me.updateModel.bind(me));
    }
  }

  get form() {
    return document.querySelector("xo-form");
  }

  updateModel(e) {
    const me = this,
      monaco = me.shadowRoot.getElementById("model");
    if (monaco) {
      monaco.value = JSON.stringify(
        e.detail.model,
        (key, value) => {
          if (key === "dataUrl") return value.split(",")[0];

          return value;
        },
        2
      );

      // let render = document.getElementById("run");
      // if (e.detail.model.instance.data?.schema) {
      //   render.schema = scopeEval(
      //     this,
      //     e.detail.model.instance.data.schema + "; return schema"
      //   );
      // }
    }
  }
}

export default ModelView;
window.customElements.define("xw-modelview", ModelView);
