import { html } from 'lit';
import Group from '../Components/Group';
import Control from '../Components/Control';

class Navigation extends Group {


    static get properties() {
        return {
            page: {
                type: Number
            }
        }

    }

    set page(value) {
        if(typeof(value) !== "number")
            throw Error("Invalid value for page");

        this.context.form.page = value;
        this.context.form.dispatchEvent(new CustomEvent("xo-page"))
    }

    get page() {
        return this.context.form.page;
    }

    loadXoSchema(schema) {

        const defControls = [
            {
                type: "button",
                name: "prev",
                label: "Previous",
                bind: "#/_xo/nav/back",
                disabled: "#/_xo/disabled/back",
                click: this.prev.bind(this)
            },
            {
                type: "button",
                name: "nxt",
                label: "Next",
                bind: "#/_xo/nav/next",
                disabled: "#/_xo/disabled/next",
                click: this.next.bind(this)
            }
        ];


        if (schema.submit !== false) {
            defControls.push({
                type: "button",
                name: "send",
                label: "Submit",
                bind: "#/_xo/nav/send",
                disabled: "#/_xo/disabled/send",
                click: this.submit.bind(this)
            })
        }

        for (let page of schema.controls || defControls) {

            let navElement = this.createControl(this.context, "button", page);
            this.appendChild(navElement);
        }
    }

    prev(e) {
        // this.closest("xo-form").page--;
        // this.closest("xo-form").dispatchEvent(new CustomEvent("xo-page"))
        let p = this.context.data.get("#/_xo/page");
        
        p = Math.max(1, p-1)
        this.context.data.set("#/_xo/page", p)

        this.context.data.set("#/_xo/disabled/next", p);
        this.context.data.set("#/_xo/disabled/back", p<=1);
    }

    next(e) {
        let p = this.context.data.get("#/_xo/page");
        this.context.data.set("#/_xo/page", p+1)
        this.context.data.set("#/_xo/disabled/back", false)
        
        // this.closest("xo-form").page++;
        // this.closest("xo-form").dispatchEvent(new CustomEvent("xo-page"))

        // debugger;
        // const source = e.composedPath()[0]
        // this._clicked++;
        // const detail = {
        //   control: this,
        //   source: source,
        //   value: this._clicked
        // };
        // eventBus.fire("xo-interaction", detail)
    }

    submit(e) {
        let xo = this.closest("xo-form"), result = {};

        Object.entries(xo.elements).forEach(item => {
            let key = item[0];
            if (key) {
                let value = item[1].value;
                result[key] = value;
            }

        })

        console.log(JSON.stringify(result, null, 2))
    }

}

window.customElements.define('xo-nav', Navigation);
export default Navigation;