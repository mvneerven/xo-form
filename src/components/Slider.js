import Control from "./Control";
import { LitElement, html, css } from 'lit';

class Slider extends Control {

  static styles = css`
    .switch {
        display: inline-block;
        height: 24px;
        position: relative;
        width: 40px;
      }
      
      .switch input {
        display:none;
      }
      
      .slider {
        background-color: #ccc;
        bottom: 0;
        cursor: pointer;
        left: 0;
        position: absolute;
        right: 0;
        top: 0;
        transition: .4s;
      }
      
      .slider:before {
        background-color: #fff;
        bottom: 4px;
        content: "";
        height: 16px;
        left: 4px;
        position: absolute;
        transition: .4s;
        width: 16px;
      }
      
      input:checked + .slider {
        background-color: #66bb6a;
      }
      
      input:checked + .slider:before {
        transform: translateX(16px);
      }
      
      .slider.round {
        border-radius: 24px;
      }
      
      .slider.round:before {
        border-radius: 50%;
      }
    `
  _value = false;

  renderInput() {
    return html`<label class="switch">
  <input @change=${this.toggle} .checked=${this.value} type="checkbox" />
  <div class="slider round"></div>
</label>`
  }

  checkValidity(){ }

  onInput(e){
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

export default Slider;
window.customElements.define('xo-slider', Slider);