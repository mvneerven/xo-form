import xo from '../xo'
import { html } from 'lit';
import { repeat } from 'lit/directives/repeat.js';

class RadioGroup extends xo.control {

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
        let name = this.name;
        
        return html`<div>
             ${repeat(this.items, (item) => item.id, (item, index) => {
                item = this.makeItem(item)                 
                return html`<label><input @change=${this.change} @click=${this.toggleCheck} .checked=${this.isSelected(item)} type="radio"  name="${name}" value="${item.value}"/><span class="xo-sl"> ${item.label}</span></label>`;
                })}
        </div>`
    }

    change(e){
        e.preventDefault();
        e.stopPropagation();
    }

    onInput(e){
        e.stopPropagation();
    }

    toggleCheck(e){
        e.stopPropagation();

        if(e.target.checked){
            this._value = e.target.value
        }
        
        this.fireChange();
    }

    checkValidity(){
        //TODO
    }

    
    isSelected(item){
        return this._value === item.value;
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
export default RadioGroup;
window.customElements.define('xo-radiogroup', RadioGroup);
