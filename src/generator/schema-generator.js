import MetaReader from "./meta-reader";

/**
 * Generates xo-form schema using specified MetaReader.
 */
class SchemaGenerator {
  _schema = {
    note: "Generated schema",
    model: { rules: {}, instance: {} },
    pages: [{ fields: [] }]
  };

  /**
   * Constructor
   * @param {MetaReader} reader
   */
  constructor(reader) {
    this._reader = reader;
  }

  createSchema() {
    const instance = {},
      page1 = this.schema.pages[0];
    Object.entries(this.reader.properties).forEach((entry) => {
      let key = entry[0];
      instance[key] = undefined;
      let field = this.reader.getFieldSchema(key);
      page1.fields.push(field);
    });

    this.schema.model.instance["data"] = instance;

    return this._schema;
  }

  get schema() {
    return this._schema;
  }

  get reader() {
    return this._reader;
  }
}

export default SchemaGenerator;
