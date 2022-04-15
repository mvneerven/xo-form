import Monaco from "./Monaco";
import Util from "../src/xo/Util";

import gen from "../src/generator";
import JSONSchemaReader from "../src/generator/json-schema-reader";

class SchemaEditor extends Monaco {
  static get properties() {
    return {
      form: {
        type: String,
        attribute: true
      },
      language: {
        type: String,
        attribute: true
      },
      // value: {
      //   type: String
      // },
      schemaSrc: {
        type: String
      }
    };
  }

  set schemaSrc(value) {
    this._schemaSrc = value;

    this.loadJSONSchemaFromUrl(value);
  }

  async loadJSONSchemaFromUrl(url) {
    console.log("Generating form schema from JSON Schema");
    let jsonSchema = await fetch(url).then((x) => x.json());
    let description = jsonSchema.description ?? undefined;

    let g = new gen.SchemaGenerator(new JSONSchemaReader(jsonSchema));
    let schema = g.createSchema();

    if (jsonSchema.description) schema.note = jsonSchema.description;

    this.language = "javascript";
    this.src = URL.createObjectURL(
      new Blob(
        [
          "/*",
          "Generated from " + url,
          "*/\n\n",
          "export const schema=",
          Util.stringifyJs(schema, null, 2),
          "\n\n",
          "/* Generated from JSON Schema",
          "\n",
          JSON.stringify(jsonSchema, null, 2),
          "\n*/"
        ],
        {
          type: "text/javascript"
        }
      )
    );
  }

  get schemaSrc() {
    return this._schemaSrc;
  }

  constructor() {
    super(...arguments);

    this.language = "javascript";

    this.addEventListener("change", this.changeHandler.bind(this));
  }

  dispose() {
    super.dispose();
    this.removeEventListener("change", this.changeHandler);
  }

  changeHandler(e) {
    const me = this;

    let form = document.getElementById(me.form);
    let schemaString = me.value;

    let q = schemaString.indexOf("export const ");
    if (q !== -1) {
      let p = schemaString.indexOf("=", q + 1);

      if (p !== -1) {
        schemaString =
          schemaString.substring(0, q - 1) +
          ";return " +
          schemaString.substring(p + 1);
      }

      form.schema = Util.scopeEval(me, schemaString);
    }
  }
}

customElements.define("xw-schemaeditor", SchemaEditor);
export default SchemaEditor;
