import Control from "./Control"
import { html } from 'lit';

class Group extends Control {

    static get properties() {
        return {
            layout: { type: String, attribute: true }
        };
    }

    renderInput() {
        return html`${this.injectedStyles}<div class="xo-cn ${this.getClasses()}">
    <slot></slot>
    <div>`;
    }

    loadXoSchema(schema) {
        for (let field of schema.fields) {
            let element = this.createControl(this.context, field.type, field)

            this.appendChild(element);
        }
    }

    getClasses() {
        let c = super.getClasses();
        return (c + " " + (this.layout === "horizontal" ? "horizontal" : "vertical")).trim();
    }
}
export default Group;
window.customElements.define('xo-group', Group);
