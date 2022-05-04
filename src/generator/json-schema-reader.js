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
          props[name] = Util.getValue(schema, obj.$ref);

          if (props[name].$ref) {
            this.expandSchema(props[name]);
          }
        }
      }
    }

    schema.properties = props;
  }

  apply(field) {
    let path = field.name;
    let props = this.schema.properties[path];

    field.bind = "#/data/" + field.name;

    if (
      Array.isArray(this.schema.required) &&
      this.schema.required.includes(path)
    ) {
      field.required = true;
    }

    if (!field.type) {
      let els = JSONSchemaReader.mapType(this.schema, field, props);
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
  }

  static mapType(schema, field, prop) {
    // string, number, integer, object, array, boolean, null
    let type = prop?.type,
      nullable = false;
    if (Array.isArray(type)) {
      if (type.length === 2 && type.includes("null")) {
        nullable = true;
        type = type
          .filter((s) => {
            return s !== "null";
          })
          .join();
        prop.type = type;
      }
    }

    switch (type) {
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
        return this.applyArrayType(schema, field, prop);
      case "object":
        return this.applyObjectType(schema, field, prop);

      default:
        console.error("Mapping error", prop?.type, field, prop);
    }

    return { type: "text" };
  }

  static applyArrayType(schema, field, props) {
    field = { type: "xw-checkgroup" };

    if (props?.items?.$ref) {
      let enumStruct = Util.getValue(schema, props.items.$ref);
      if (Array.isArray(enumStruct.enum)) field.items = enumStruct.enum;
    }

    return field;
  }

  static applyObjectType(schema, field, props) {
    let obj = { type: "group" };

    if (!field.children) {
      obj.children = [];

      for (var name in props.properties) {
        var p = props.properties[name];
        obj.children.push({
          ...JSONSchemaReader.mapType(schema, obj, p),
          name: name,
          label: Util.toWords(name)
        });
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
