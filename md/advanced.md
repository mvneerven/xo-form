# Advanced Topics

## Generating form schemas from anywhere

As we've seen in [Generating](./generating.md), xo-form supports creating xo schemas from meta data. There is an adaptor for JSON Schema, as we saw, but the mechanism is open and it's easy to work with meta data in other forms and pass them to the schema generator:

```js
import SchemaGenerator from "xo-form/dist/schema-generator";

// 
const meta = {
  properties: {
    firstName: {
      type: "string",
      description: "The person's first name."
    }
  }
};

let gen = new SchemaGenerator(meta);
let schema = gen.createSchema();
console.log("Generated: ", schema);

```