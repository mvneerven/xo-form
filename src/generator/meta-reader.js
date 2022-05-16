import Util from "../xo/Util";

class MetaReader {
  /**
   * Must return the list of properties to be mapped to an xo-form
   */
  get properties() {}

  /**
   * Called to get one field schema based on one single schema property
   * @param {Object} key
   */
  getFieldSchema(key) {}

  static mapType(schema, field, prop) {
    // string, number, integer, object, array, boolean, null

    let fieldSchema = {};

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
        fieldSchema = this.applyStringType(field, prop);
        break;
      case "number":
        fieldSchema = this.applyNumericType(field, prop);
        break;
      case "integer":
        fieldSchema = this.applyIntegerRestrictions(
          field,
          this.applyNumericType(field, prop)
        );
        break;
      case "boolean":
        fieldSchema = { type: "checkbox" };
        break;
      case "array":
        fieldSchema = this.applyArrayType(schema, field, prop);
        break;
      case "object":
        fieldSchema = this.applyObjectType(schema, field, prop);
        break;
      default:
        console.error("Mapping error", prop?.type, field, prop);
        fieldSchema = { type: "text" };
    }

    fieldSchema.bind = "#/data/" + prop.name;

    fieldSchema.label =
      ((prop ? prop.title : null) || Util.toWords(prop.name)) ??
      fieldSchema.label;

    if (prop.contentEncoding === "base64") {
      fieldSchema.type = "xw-filedrop";
    }

    if (prop.enum && !field.items) {
      fieldSchema.type = "xw-checkgroup";
      fieldSchema.items = prop.enum;
    }

    return fieldSchema;
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
        var p = {
          name: name,
          ...props.properties[name]
        };
        obj.children.push({
          ...this.mapType(schema, obj, p),
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

export default MetaReader;
