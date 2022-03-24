# Introduction

XO Form is a tiny web forms library that translates declarative JavaScript schemas to complex data-bound web forms.

XO Form is written as [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components) in pure [ES6+](https://en.wikipedia.org/wiki/ECMAScript) JavaScript modules, and has just one dependency: [Lit](https://www.npmjs.com/package/lit).

## Features

- Reactive rendering
- Full two-way databinding
- Multi-page forms/wizards
- Rules engine for conditional logic
- Supports all HTML elements, including Custom Elements (Web Components)

# Setup

`npm i @mvneerven/xo-form`

# How it works

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
