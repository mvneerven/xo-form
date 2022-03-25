# Introduction

The `xo-form` component library generates web forms from a declarative schema.

`xo-form` schemas are [JavaScript Object Literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_Objects#object_initializers) that are easily written, or generated from your code.

`xo-form` supports full two-way databinding to map a form to a data model and interface with APIs directly as the model changes.

The library is written as pure native [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components) in [ES6+](https://en.wikipedia.org/wiki/ECMAScript) Modules, and has just one dependency: [Lit](https://www.npmjs.com/package/lit).

## Features

- Reactive Rendering
- Direct Model Binding to Element Properties
- Full two-way Databinding
- Multi-page Forms/Wizards
- Powerful Rules engine for Conditional Logic
- Supports all HTML elements, including Custom Elements (Web Components)

# Setup

`npm i @mvneerven/xo-form`

# How it works

```xo-form``` is a Web Component (```<xo-form></xo-form>```). You pass a form schema either by setting the ```schema``` property directly, or by setting ```src``` to a path to dynamically load a js module from.

In the case below, we're loading a js module:

```html
<xo-form theme="material" src="/forms/my-form.js"></xo-form>
```

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
            alert(
              JSON.stringify(
                context.model.instance.data, 
                null, 
                2));
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
