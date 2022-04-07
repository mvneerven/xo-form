# Introduction

Imagine writing fully self-contained complex Web Forms as pure JavaScript Object Literals.

Imagine automatically translating an OpenAPI/Swagger or JSON Schema to a matching Web Form.

With `xo-form`, you can!

## Use it:

Install
```
> npm i xo-form
```

Import
```js
import xo from 'xo-form';
```

Markup
```html
<xo-form src="/my-xo-form.js"></xo-form>
```

## Schemas

Schemas for `xo-form` are [JavaScript Object Literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_Objects#object_initializers) are easy to write, extremely developer friendly, and can be generated from (meta)data.

Example:

```js
export const form = {
  pages: [
    {
      fields: [
        {
          type: "text",
          required: true,
          label: "Your email address",
          placeholder: "Enter your email address",
        },
      ],
    },
  ],
};
```

The library is written as pure native [ES6+](https://en.wikipedia.org/wiki/ECMAScript) Modules, and has just one dependency: [Lit](https://www.npmjs.com/package/lit).

## Features

- Supports all HTML elements and [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components)
- Full two-way databinding to map a form to a data model and interface with APIs directly as the model changes.
- Multi-page Forms/Wizards
- Powerful Rules engine for Conditional Logic

# Setup

`npm i xo-form`

# How it works

`xo-form` is a Web Component (`<xo-form></xo-form>`). You pass a form schema either by setting the `schema` property directly, or by setting `src` to a path to dynamically load a js module from.

In the case below, we're loading a js module:

... where my-form.js looks like this:

```js
export const form = {
  model: {
    instance: {
      state: {},
      data: {
        name: "",
        msg: "",
      },
    },
    rules: {
      "#/state/submit": [
        {
          value: (context) => {
            alert(JSON.stringify(context.model.instance.data, null, 2));
          },
        },
      ],
    },
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
          placeholder: "Enter your name",
        },
        {
          type: "textarea",
          bind: "#/data/msg",
          label: "Your message",
          required: true,
          placeholder: "Enter a message",
          maxlength: 100,
          rows: 6,
        },
        {
          type: "button",
          bind: "#/state/submit",
          label: "Submit",
        },
      ],
    },
  ],
};
```

## Understanding `xo-form` schemas

### Main elements

#### `pages`

The `pages` node is an array of `page` elements. Each page describes a set of controls that are grouped together, mostly in separately shown wizard steps, but pages could also be shown differently, in a tabstrip for instance.

#### `model`

The `model` property contains all data model related elements, such as the `instance` node that contains one or multiple named instance nodes.

In the example below, the `myData` node defines data that a form can bind to:

```js
export const form = {
  model: {
    instance: {
      myData: {
        userName: "johndoe",
      },
    },
  },
  pages: [
    {
      fields: [
        {
          type: "text",
          label: "User name",
          bind: "#/myData/userName",
        },
      ],
    },
  ],
};
```

Result:
![Monaco](./md/img/my-data-bind.png "Form with simple data binding")

## Schema & Control Creation

### Explicit and implicit element types

The `pages` and `controls` nodes in an `xo-form` schema are interpreted at runtime and generate controls.

In the case of a page, an `xo-page` element is implicitly created. The `xo-page` element inherits from the `xo-group` element. Groups can be created explicitly as well, using the following syntax:

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
