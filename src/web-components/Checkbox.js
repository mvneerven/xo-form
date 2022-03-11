import xo from '../xo'
import { html } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import CheckboxList from './CheckboxList';

class Checkbox extends CheckboxList {

    static get properties() {
        return {
            value: { type: Boolean }
        };
    }

    get value() {
        return this._value[0] === this.items[0].value;
    }

    set value(value) {
        if (typeof (value) !== "boolean")
            return;

        this._value = [value];
    }

    toggleCheck(e) {
        this._value = [];
        super.toggleCheck(e);
    }

    connectedCallback() {
        super.connectedCallback();

        this.items = [{
            value: "1",
            label: this.label ?? "On"
        }];
        this.label = "";
        this._value = this._value[0] === true ? ["1"] : []

    }
}
export default Checkbox;
window.customElements.define('xo-checkbox', Checkbox);
