import xo from "../xo";
import { html, css } from "lit";

class Info extends xo.Control {
    static get properties (){
        return {
            title: {
                type: String
            },
            body: {
                type: String
            }
        }
    }
    render(){
        return html`
            <div class="info">
                <h3>${this.title}</h3>
                <div class="info-body">
                    ${this.body}
                </div>
            </div>
        `
    }
}
customElements.define("xo-info", Info);
export default Info