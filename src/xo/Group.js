import Control from "./Control"
import { html } from 'lit';

class Group extends Control {

    static get properties() {
        return {
            layout: { type: String, attribute: true },
            fields: { type: Array }
        };
    }

    renderInput() {
        return html`${this.injectedStyles}<div class="xo-cn ${this.getClasses()}">
    <slot></slot>
    <div>`;
    }

    set fields(value) {
        this._fields = value;

        for (let field of this._fields) {
            let element = this.createControl(this.context, field.type, field)
            this.appendChild(element);
        }
    }

    get fields() {
        return this._fields;
    }
    
    getClasses() {
        let c = super.getClasses();
        return (c + " " + (this.layout === "horizontal" ? "horizontal" : "vertical")).trim();
    }
}
export default Group;
window.customElements.define('xo-group', Group);
