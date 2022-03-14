import Group from './Group';

class Navigation extends Group {

    beforeMap() {
        this._controls = [
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


        if (this.parent.submit !== false) {
            this._controls.push({
                type: "button",
                name: "send",
                label: "Submit",
                bind: "#/_xo/nav/send",
                disabled: "#/_xo/disabled/send",
                click: this.submit.bind(this)
            })
        }
    }

    static get properties() {
        return {
            page: {
                type: Number
            },
            controls: {
                type: Array
            }
        }
    }

    set page(value) {
        if (typeof (value) !== "number")
            throw Error("Invalid value for page");

        this.context.form.page = value;
        this.context.form.dispatchEvent(new CustomEvent("xo-page"))
    }

    get page() {
        return this.context.form.page;
    }

    set controls(value) {
        if (!Array.isArray(value))
            throw Error("Invalid controls property value");
        this._controls = value;

        for (let control of this._controls) {
            let navElement = this.createControl(this.context, "button", control);
            this.appendChild(navElement);
        }
    }

    get controls() {
        return this._controls;
    }

    prev() {
        this.updateState(-1);
    }

    next() {
        this.updateState(+1);
    }

    updateState(dir) {
        let p = this.context.data.get("#/_xo/nav/page");
        let total = this.context.data.get("#/_xo/nav/total");
        if (dir > 0)
            p = Math.min(total, p + 1)
        else
            p = Math.max(1, p - 1)

        this.context.data.set("#/_xo/nav/page", p)
        this.context.data.set("#/_xo/disabled/next", p >= total);
        this.context.data.set("#/_xo/disabled/back", p <= 1);
    }

    submit() {
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