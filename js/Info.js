import { LitElement, html, css } from "lit";

class Info extends LitElement {
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
customElements.define("xw-info", Info);
export default Info