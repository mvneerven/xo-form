import MetaReader from "./meta-reader";
import Util from "../xo/Util";

/*
 * see https://json-schema.org/understanding-json-schema/reference/type.html
 * BASED ON JSON Schema version 7
 *
 * Basic schema types:
 *     string, number, integer, object, array, boolean, null
 */
class JSONSchemaReader extends MetaReader {
  constructor(schema) {
    super();
    this.schema = schema;
    this.expandSchema(this.schema);
  }

  get properties() {
    return this.schema.properties;
  }

  getFieldSchema(key) {
    let fieldSchema = {};
    this.apply(fieldSchema, key);
    return fieldSchema;
  }

  expandSchema(schema) {
    let props = {};
    if (schema?.properties) {
      for (var name in schema.properties) {
        let obj = schema.properties[name];
        props[name] = obj;

        if (obj.$ref) {
          props[name] = Util.getValue(schema, obj.$ref);

          if (props[name].$ref) {
            this.expandSchema(props[name]);
          }
        }
      }
    }

    schema.properties = props;
  }

  apply(field, key) {
    
    let props = {
      name: key,
      ...this.schema.properties[key]
    };

    if (
      Array.isArray(this.schema.required) &&
      this.schema.required.includes(key)
    ) {
      field.required = true;
    }

    if (!field.type) {
      let els = MetaReader.mapType(this.schema, field, props);
      for (var p in els) {
        field[p] = els[p];
      }
    }
  }
}

export default JSONSchemaReader;
