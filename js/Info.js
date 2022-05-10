import { LitElement, html, css } from "lit";

class Info extends LitElement {
    static get styles() {
        return css`
        
        h3 {
            margin-top: 0;
            margin-bottom: .2rem;
        }
        `
    }
    static get properties (){
        return {
            header: {
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
                <h3>${this.header}</h3>
                <div class="info-body">
                    ${this.body}
                </div>
            </div>
        `
    }
}
customElements.define("xw-info", Info);
export default Info