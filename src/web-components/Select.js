//import Control from "./Control";
import { html } from 'lit';
import { repeat } from 'lit/directives/repeat.js';

class Select extends xo.control {
    _value = [];

    static get properties() {
        return {
            items: { type: Array },
            value: { type: Object }
        };
    }

    constructor() {
        super();
        this.items = []
    }

    renderInput() {
        return html`<select @change=${this.fireChange.bind(this)} size="1">
             ${repeat(this.items, (item) => item.id, (item, index) => {
                item = this.makeItem(item)                 
                return html`<option .selected=${this.isSelected(item)} value="${item.value}">${item.label}</option>`;
                })}
        </select>`
    }

    change(e){
        e.preventDefault();
        e.stopPropagation();
    }
   
    checkValidity(){
        //TODO
    }

    
    isSelected(item){
        return this._value == item.value;
    }

    makeItem(item){
        return typeof(item)==="string" ? {value: item, label: item} : item;
    }

    get value(){
        return this._value;
    }

    set value(value){
        this._value = value;
    }
}
export default Select;
window.customElements.define('xo-select', Select);
