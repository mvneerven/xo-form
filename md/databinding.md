# Data Binding

Web Forms manipulate data structures, so regardless of what their role is, there has to be a transparent and easy way to map data to UI and vice versa.

With `xo-form`, you don't need a reactive framework to do that, since it's there. You pass in data using the `model` node, bind state to be manipulated in the model to UI elements using the `bind` property on controls (two-way binding), or refer to state using one-way binding, in any control property.

Let's see how it works.

In this example, two-way binding is used on an `email` value, which is shown in the UI as an `input[type="email"]`. The `email` field however is disabled when the `receive` boolean value is false.
Since the `receive` property is mapped to a `xw-switch` control, it can be toggled, enabling the `email` field in the UI.
Note that the `disabled` property of the `email` control is set to `#/data/noreceive`, and that the `noreceive` property is calculated using a `rule` in the model, based on the `receive` property mapped to the `xw-switch` control.

```js
/**
 * Simple form that shows conditional UI.
 */
export const getNewsLetter = {
  // conditional logic form
  icons: "/data/svg/icons.svg",
  model: {
    rules: {
      "#/data/receive": [
        {
          set: "#/data/noreceive",
          value: "!this.value"
        }
      ]
    },
    instance: {
      data: {
        receive: false,
        email: "yama@moto.jp"
      }
    }
  },
  pages: [
    {
      label: "Newsletter",
      children: [
        {
          type: "xw-switch",
          label: "Subscribe to the newsletter",
          bind: "#/data/receive",
          text: "Yes, I would like to receive it"
        },
        {
          type: "email",
          label: "Email address",
          bind: "#/data/email",
          placeholder: "john@doe.com",
          disabled: "#/data/noreceive",
          prepend: {
            icon: "email"
          }
        }
      ]
    }
  ]
};
```

## Rules

As you see in the above example, the `rules` node in the `model` allows you to apply logic when changes occur in any instance in the model.

Rules are nodes that have a binding expression as the _key_. In the example, `#/data/receive` is such an expression. It maps to `model.instance.data.receive`.

The rule _value_ is an array of `actions`:

```js
"#/data/receive": [
  {
    set: "#/data/noreceive",
    value: "!this.value"
  }
]
```

Actions can use `set` to change state. The `value` property in an action can be a string or a `Function`:

The above rule is equivalent to:

```js
"#/data/receive": [
  {
    set: "#/data/noreceive",
    value: context => {return !context.value}
  }
]
```

As we've seen in other examples, a rule can also just run functionality.

UI:

```js
{
  type: "button",
  bind: "#/state/commit"
}
```

Model:

```js
"#/state/commit": [
  {
    run: context => {
      alert(JSON.stringify(
        context.data.instance.myData, null, 2)
      );
    }
  }
]
```

## Binding state to UI

As we've seen above, you can use binding expressions in nearly all properties. If the UI element can manipulate data, you use the `bind` property to get two-way binding back to the model.

### Buttons

A notable exception is the `button` element (shown in the last example above). Since it normally doesn't change a value, but rather fires a `click` event when clicked on, `xo-form` uses a litle trick, incrementing a _click-count_ value on click under the hood to allow for binding to model state.

