# Generating

Since ```xo-form``` schemas are data, it's extremely easy to generate them. You can obviously do so by hand, using any language, server- or client side, but ```xo-form``` also comes with a generator and adapters for [OpenAPI/Swagger](https://swagger.io/specification/) and [JSON Schema](https://json-schema.org/).

Syntax:

```js
import SchemaGenerator from "xo-form/dist/schema-generator";
const url = "//my-server.my-domain.com/myfolder/my-json-schema.json";
let jsonSchema = await fetch(url).then((x) => x.json());
let generator = new SchemaGenerator(new JSONSchemaReader(jsonSchema));
let schema = generator.createSchema();
```

Looking at the example above, the ```JSONSchemaReader``` class takes care of the JSON Schema specifics. This class inherits from ```MetaReader```, which is an abstract class.

```js
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
}
```

You can inherit from ```MetaReader``` to get your metadata from anywhere and feed the ```SchemaGenerator``` instance with the proper mappings.

