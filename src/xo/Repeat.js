import Group from "./Group";
import { html } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import Control from "./Control";

class Repeat extends Group {

    static get properties() {
        return {
            items: {
                type: Array
            },
            layout: {
                type: String
            }
        }
    }

    loadXoSchema(schema) {
        this.schema = schema;
        this.refresh();
    };

    set items(value) {
        this._items = value;

        if (this.hasUpdated) {
            this.refresh();
            this.requestUpdate();
        }
    }

    get items() {
        return this._items;
    }

    refresh() {
        this.innerHTML = "";

        let index = 0;
        this.schema.layout = this.layout || "horizontal";
        this.items.forEach(item => {
            let group = this.createControl(this.context, "group", this.schema, {

                scope: item,
                index: index++
            });
            group.setAttribute("data-index", index)
            this.appendChild(group);
        });
    }

    getClasses() {
        let c = super.getClasses();
        return (c + " xo-rep");
    }


}

export default Repeat;
window.customElements.define('xo-repeat', Repeat);