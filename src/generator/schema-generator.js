import MetaReader from "./meta-reader";

/**
 * Generates xo-form schema using specified MetaReader.
 */
class SchemaGenerator {
  _schema = {
    note: "Generated schema",
    model: { rules: {}, instance: {} },
    pages: [{ children: [] }]
  };

  /**
   * Constructor
   * @param {MetaReader} reader
   */
  constructor(reader) {
    this._reader = reader;
  }

  createSchema() {
    const me = this;
    const instance = {},
    gfs =  me.reader.getFieldSchema ?? me.getFieldSchema.bind(me),
      page1 = this.schema.pages[0];
    Object.entries(this.reader.properties).forEach((entry) => {
      let key = entry[0];
      instance[key] = undefined;
      
      let field = gfs(key, me)

      page1.children.push(field);
    });

    this.schema.model.instance["data"] = instance;

    return this._schema;
  }

  getFieldSchema (key) {
    let fieldSchema = this.map(key, this.reader.properties[key]);
    return fieldSchema;
  }

  map(key, property){
    property = {
      name: key,
      ...property
    }
    let fieldSchema = {};
    
    return MetaReader.mapType(this.reader.schema, fieldSchema, property)

  }

  get schema() {
    return this._schema;
  }

  get reader() {
    return this._reader;
  }
}

export default SchemaGenerator;
