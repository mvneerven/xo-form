# Writing Schemas

The `xo-form` schema syntax is quite simple. It consists of a few entry level nodes: `model` (data binding model), `pages` (UI).

## Basic skeleton

```js
export const form = {
  model: {
    instance: {
      // one or more instance nodes
    },
    rules: {
      // any number of instance node references to hook into when they get modified
    }
  },
  pages: [
    {
      label: "My Form",

      fields: [
        {
          type: "<any (custom)element or input type>",
          // any other properties
        }
        // any other fields...
      ]
    }
    // any other pages...
  ]
};
```

Let's build a more elaborate example form. This one has three data-bound controls and shows the JSON of the ```data``` instance on submit:

```js
export const form = {
  model: {
    instance: {
      state: {},
      data: {
        name: "",
        msg: ""
      }
    },
    rules: {
      "#/state/commit": [
        {
          value: (context) => {
            alert(JSON.stringify(context.data.instance.data, null, 2));
          }
        }
      ]
    }
  },
  pages: [
    {
      label: "My Form",

      fields: [
        {
          type: "text",
          bind: "#/data/name",
          required: true,
          label: "Your name",
          placeholder: "Enter your name"
        },
        {
          type: "textarea",
          bind: "#/data/msg",
          label: "Your message",
          required: true,
          placeholder: "Enter a message",
          maxlength: 100,
          rows: 6
        },
        {
          type: "button",
          mixin: "xo/button/submit"
        }
      ]
    }
  ]
};
```

## The `pages` node

The `pages` node is an array of `page` elements. Each page describes a set of controls that are grouped together, mostly in separately shown wizard steps, but pages could also be shown differently, in a tabstrip for instance.

## The `model` node

The `model` property contains all data model related elements, such as the `instance` node that contains one or multiple named instance nodes.

In the example below, the `myData` node defines data that a form can bind to:

```js
export const form = {
  model: {
    instance: {
      myData: {
        userName: "johndoe"
      }
    }
  },
  pages: [
    {
      fields: [
        {
          type: "text",
          label: "User name",
          bind: "#/myData/userName"
        }
      ]
    }
  ]
};
```

Result:
![Monaco](./md/img/my-data-bind.png "Form with simple data binding")

## Schema & Control Creation

### Explicit and implicit element types

The `pages` and `controls` nodes in an `xo-form` schema are interpreted at runtime and generate controls.

For each page node, an `xo-page` element (which inherits from the `xo-group` element) is implicitly created.

You can also explicitly create a group, using the following syntax:

```js
{
  type: "group", // xo-group element
  fields: []
}
```

### Schema type to element mapping

The schema interpreter has some very simple rules to generate element from the schema nodes:

- If the `type` property starts with 'xo-', the corresponding XO element is instantiated.
- If `document.createElement(type)` is successful, the returned object is used.
- If type doesn't contain a dash (`-`), the interpreter tries to create an `HtmlInputElement` and set its `type` property to the given type.

### Schema property mapping

Once an element is created using above rules, the remaining properties in the field schema are mapped to internal state of the element. To make `xo-form` schemas intuitive, a few simple rules define how this is done:

- If the element supports the given property, the value is directly mapped
- Otherwise, if the element supports the attribute, the attribute is set (using camelCase to hyphen naming conversion - dataTest -> data-test, ariaLabel -> aria-label)
- In cases where there is no actual support, the property will be mapped to a data attribute: zzzzzz -> data-zzzzzz.
