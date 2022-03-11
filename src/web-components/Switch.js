//import Control from "./Control";
import { LitElement, html, css } from 'lit';

class Switch extends xo.control {

  static styles = css`
    label.switch {
        display: inline-block;
        height: 24px;
        position: relative;
      }

      .switch input {
        display:none;
      }
      
      .knob {
        width: 40px;
        
        background-color: #ccc;
        bottom: 0;
        cursor: pointer;
        left: 0;
        position: absolute;
        right: 0;
        top: 0;
        transition: .4s;
      }
      
      .knob:before {
        background-color: #fff;
        bottom: 4px;
        content: "";
        height: 16px;
        left: 4px;
        position: absolute;
        transition: .4s;
        width: 16px;
      }
      
      input:checked + .knob {
        background-color: #66bb6a;
      }
      
      input:checked + .knob:before {
        transform: translateX(16px);
      }
      
      .knob.round {
        border-radius: 24px;
      }
      
      .knob.round:before {
        border-radius: 50%;
      }

      .knob-lbl {
        margin-left: 50px;
        width: auto;
      }
    `
  _value = false;

  renderInput() {
    return html`<label class="switch">
  <input @change=${this.toggle} .checked=${this.value} type="checkbox" />
  <div class="knob round"></div>
  <div class="knob-lbl">${this.text}</div>
</label>`
  }

  connectedCallback() {
    super.connectedCallback();
    this.text = this.label;
    this.label = "";
  }


  checkValidity() { }

  onInput(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  toggle(e) {
    e.preventDefault();
    e.stopPropagation();
    this.value = e.target.checked === true;

    this.fireChange();
  }

  get value() {
    return this._value ?? false;
  }

  set value(value) {
    this._value = value;
  }
}

export default Switch;
window.customElements.define('xo-switch', Switch);