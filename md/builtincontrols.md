# Built-in Controls

## Root (implicit)
The root element of the xo schema.

```js
{
  model: Object // model container,
  pages: Array // array of page containers
}
```

## Model
Holds all databinding state (instances) and logic (rules).

```js
{
  model: {
    rules: Object,
    instance: Object
  }
}
```

## Instance 
Defines a self-contained JavaScript object with data managed by the form. 
Instances are easy to directly pass to `REST` or `GraphQL` APIs, or use client-side.
Since each instance is proxied internally (using the JavaScript `Proxy` class), changes to its properties can immediately be reflected in the UI, and you can define `rules` to actively listen to changes.

```js
  {
    model: {
      instance: {
        <instance1>: Object,
        <instance2>: Object,
        [...]
      }
    }
  }
```

## Rules
Contains rules to execute whenever some property has changed in any instance.

```js
{
  model: {
    rules: {
      "<binding-expression1>": [
        {
          run: Function,
          set: String,
          value: String|Function
        }
      ],
      [...]
    }
  }
}
```

Example:
```js
const form = {
  model: {
    rules: {
      "#/state/added": [
        {
          run: (context) => {
            alert("Item added")
          }
        }
      ]
    }
  }
}
```

See [Databinding](./databinding.md)

## Page 
Groups controls and is normally displayed as a fieldset

```js
{
  pages: [
    { // page 1
      label: String // label (normally displayed as a legend tag),
      children: Array // array of control schemas 
    }
  ]
}
```

## Group
Groups controls and supports different layouts

```js
[...]
{
  label: String // label (normally displayed as a legend tag),
  layout: String, // horizontal|vertical
  children: Array // array of control schemas 
}
```

## Repeat
Repeats given template using a binding expression to an array.

```js
[...]
{
  label: String // label (normally displayed as a legend tag),
  bind: String, // binding expression to an Array
  template: Array // array of control schemas to use for each element in the array
}
```

