import MetaReader from "./meta-reader";

class SchemaGenerator {
  _schema = {
    note: "Generated schema",
    model: { rules: {}, instance: {} },
    pages: [{ fields: [] }]
  };

  /**
   * Constructor
   * @param {MetaReader} metaReader
   */
  constructor(metaReader) {
    this._metaReader = metaReader;
  }

  createSchema() {
    const instance = {}, page1 = this.schema.pages[0];
    Object.entries(this.reader.properties).forEach((entry) => {
      let key = entry[0];
      instance[key] = undefined;

      let field= this.reader.getFieldSchema(key);
      page1.fields.push(field)
    });

    this.schema.model.instance["data"] = instance;

    return this._schema;
  }

  get schema() {
    return this._schema;
  }

  get reader() {
    return this._metaReader;
  }
}

export default SchemaGenerator;
