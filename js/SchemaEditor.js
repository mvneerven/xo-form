import Monaco from "./Monaco";
import Util from "./Util";

class SchemaEditor extends Monaco {
    
    static get properties() {
        return {
            form: {
                type: String,
                attribute: true
            }
        }
    }
    
    constructor(){
        super(...arguments);
        const me = this;
        me.language = "javascript"

        me.addEventListener("change", e=>{
            let form = document.getElementById(me.form);
            let schemaString = me.value;
            
            let p = schemaString.indexOf("=");
            if(p!==-1) 
                schemaString = schemaString.substring(p+1);
            form.schema = Util.scopeEval(me, 'return ' + schemaString)
        })
    }
}

customElements.define("xw-schemaeditor", SchemaEditor);
export default SchemaEditor;