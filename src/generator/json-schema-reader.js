//import ExoFormSchema from './ExoFormSchema';
//import Core from '../../pwa/Core';
//import ExoFormFactory from '../../exo/core/ExoFormFactory';
import DataBinding from "../xo/DataBinding";
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
    let fieldSchema = {
      name: key
    };
    this.apply(fieldSchema);
    return fieldSchema;
  }

  expandSchema(schema) {
    let props = {};
    if (schema?.properties) {
      for (var name in schema.properties) {
        let obj = schema.properties[name];
        props[name] = obj;

        if (obj.$ref) {
          let ref = obj.$ref.substr(2).replace("/", ".");
          props[name] = DataBinding.getValue(schema, ref);

          if (props[name].$ref) {
            this.expandSchema(props[name]);
          }
        }
      }
    }

    schema.properties = props;
  }

  apply(field) {
    //try {
    //let path = ExoFormSchema.getPathFromBind(field.bind);
    let path = field.name;
    let props = this.schema.properties[path]; // todo deep path

    field.bind = "#/data/" + field.name;
    // if (!field.name) {
    //   field.name = path;
    // }

    if (
      Array.isArray(this.schema.required) &&
      this.schema.required.includes(path)
    ) {
      field.required = true;
    }

    if (!field.type) {
      let els = JSONSchemaReader.mapType(field, props);
      for (var p in els) {
        field[p] = els[p];
      }
    }

    if (!field.label) {
      field.label = (props ? props.title : null) || Util.toWords(path);
    }

    if (props.contentEncoding === "base64") {
      field.type = "xw-filedrop";
    }

    if (props?.enum && !field.items) {
      field.type = "xw-checkgroup";
      field.items = props.enum;
    }
    // } catch (ex) {
    //   console.error(
    //     `Error applying JSON Schema for field ${field.name}`,
    //     ex
    //   );
    // }
  }

  static mapType(field, prop) {
    // string, number, integer, object, array, boolean, null
    switch (prop?.type) {
      case "string":
        return this.applyStringType(field, prop);
      case "number":
        return this.applyNumericType(field, prop);
      case "integer":
        return this.applyIntegerRestrictions(
          field,
          this.applyNumericType(field, prop)
        );
      case "boolean":
        return { type: "checkbox" };
      case "array":
        return { type: "checkboxlist" };
      case "object":
        return this.applyObjectType(field, prop);

      default:
        console.error("Mapping ", field, prop);
    }

    return { type: "text" };
  }

  static applyObjectType(field, props) {
    let obj = { type: "multiinput" };

    if (!field.fields) {
      obj.fields = {};

      for (var name in props.properties) {
        var p = props.properties[name];
        obj.fields[name] = JSONSchema.mapType(obj, p);
        obj.fields[name].caption = Core.toWords(
          obj.fields[name].caption || name
        );
      }
    }
    return obj;
  }

  static applyStringType(field, props) {
    let obj = { type: "text" };

    switch (props.format) {
      case "date-time":
        return { type: "datetime-local" };
      case "time":
        return { type: "text" };
      case "date":
        return { type: "date" };
      case "email":
        return { type: "email" };
      case "uri":
        return { type: "url" };
    }

    if (props.maxLength > 100) {
      obj.type = "multiline";
    }

    if (props.pattern) {
      obj.pattern = props.pattern;
    }

    return obj;
  }

  static applyNumericType(field, props) {
    let obj = { type: "number", step: "0.01" };

    if (props.minimum !== undefined) {
      obj.min = props.minimum;
    }

    if (props.maximum !== undefined) {
      obj.max = props.maximum;
    }

    if (props.exclusiveMinimum !== undefined) {
      obj.min = props.minimum;
    }

    if (props.multipleOf !== undefined) {
      obj.step = props.multipleOf;
    }

    return obj;
  }

  static applyIntegerRestrictions(field, props) {
    props.step = 1;
    return props;
  }

  static getTypeName(type) {
    if (!type || typeof type === "string") return type || "string";

    if (typeof type == "function") return type.name.toLowerCase();
  }
}

export default JSONSchemaReader;
