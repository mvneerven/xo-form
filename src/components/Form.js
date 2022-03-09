import { html } from 'lit';
import Control from './Control';
import Validation from '../modules/Validation';
import { EventBus } from '../modules/EventBus';
import Context from '../modules/Context';

class Form extends Control {
    elements = {};

    constructor() {
        super();
        this._context = new Context(this)
        this._page = 1

        
    }

    static get properties() {
        return {
            ...Control.properties,
            page: {
                type: Number,
                attribute: true
            }
        }
    }

    get context() {
        return this._context;
    }

    set page(value) {
        if (value < 1)
            return;
        else if (value > this.querySelectorAll("xo-page").length)
            return;

        if (value > this._page) {
            this.validation.isPageValid(this._page)
        }

        this._page = value

        this.requestUpdate()
    }

    get page() {
        return this._page
    }

    registerElement(elm) {
        if (elm.name) {
            this.elements[elm.name] = elm;
        }
    }

    render() {
        console.log("Render form", this);

        return html`${this.injectedStyles}<div class="xo-c" data-page="${this.page}">
    <form>
        <div class="xo-w">
            <slot name="w"></slot>
        </div>
        <div class="xo-n">
            <slot name="n"></slot>
            <div>
    </form>
    <div>`
    }

    load(schema) {
        if(typeof(schema) !== "object")
            throw Error("Invalid schema");

        
        schema.page = "#/_xo/page";

        this.context.data.initialize(schema.model)       

        let index = 1;
        for (let page of schema.pages) {
            page.index = index++;
            let pageElement = this.createControl(this.context, "xo-page", page);
            pageElement.setAttribute("slot", "w")
            this.appendChild(pageElement);
        }

        this.nav = this.createControl(this.context, "xo-nav", schema);
        this.nav.setAttribute("slot", "n")
        this.appendChild(this.nav);
    }

    firstUpdated() {
        this.validation = new Validation(this);

    }

    getSlotted(node) {
        const slot = node.shadowRoot?.querySelector('slot');
        return [...slot?.assignedElements({ flatten: true }) || []];
    }
}

export default Form;
window.customElements.define('xo-form', Form);
