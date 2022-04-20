# Extending

## Working with the custom element

Since `xo-form` is a web component, standard rules apply. This means that you can create it, attach it to the DOM, and pass in properties at run time, and you can listen to events dispatched by `xo-form`.

```js
const xForm = document.createElement("xo-form");
xForm.src = "/forms/my-form.js";

xForm.addEventListener("initialized", (e) => {
  // your handling code
});

xForm.addEventListener("ready", (e) => {
  // your handling code
});

xForm.addEventListener("first-updated", (e) => {
  // your handling code
});

document.body.appendChild(xForm);
```

## Extending schemas

Since `xo-form` schemas are data, extending them is a matter of manipulating the object literal:

```js

```

## Extending general xo-form behavior

### Defining mixins

You can define mixins at global level by passing in a mixins structure in the static `initialize` method of the `xo` object:

```js
xo.initialize({
  mixins: {
    myMixins: {
      styled: {
        style: "border: 1px solid red"
      }
    }
  }
});
```

Each mixin can define any number of properties for easy reuse. Using mixins in field schemas is done like this:

```js
{
  type: "button",
  mixin: "styles/fluent"
}
```

Using multiple mixins:

```js
{
  type: "button",
  mixin: ["xo/button/submit", "styles/fluent"]
}
```

> Mixins prefixed with 'xo/' are built-in and are used as shortcuts for default behavior and UI.
