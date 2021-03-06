# Schema Reference

## Control (base class)

### `label` (String)
Renders a label for the control, or a legend in the subclassed `Page` class.

### `children` (Array)
Array of `field` objects in a page.

### `type` (String)

Defines the control to be created. 

Can be any html tag name, including any custom element (web component), or any [HTML input type(https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input)], such as `text` , `email`, `password`, `tel`, `date`, `month`, `week`, `button`, `color`, etc.

```js

// creates a textarea element
{
  type: "textarea"
}

// creates an input[type="range"] element
{
  type: "range"
}

// creates an custom element <my-element></my-element>
{
  type: "my-element"
}
```

### `name` (String)

Name of the control.

### `bind` (String)
Databinding expression. Syntax: `#/<instance>/<property-path>`

`#/data/email` points to the `email` property of the `data` instance.


### `classes` (Array|String)

Array of class names to add.

### `autocomplete` (Object|String)

Use `"off"` for disabling browser autocomplete, or use an object declaring the autocomplete settings on textual controls.

Example:

```js
{
  type: "search",
  autocomplete: {
    items: ["Beer", "Wine", "Coffee"]
  }
}
```

### `prepend` (Object)
Structure that defines prepended data in a control

Example:

```js
{
  type: "email",
  label: "Email address",
  prepend: {
    icon: "email"
  }
}
```

> Note: with icons, an `icons` property in the root of the schema must be set to a URL pointing to an SVG sheet:

```js
const form = {
  icons: "data/svg/icons.svg",
  pages: []
};
```

... where `icons.svg` looks like this:

```xml
<!-- https://materialdesignicons.com/ -->

<svg xmlns="http://www.w3.org/2000/svg">
    <defs>
        <symbol id="email" viewBox="0 0 24 24">
            <path d="M12,15C12.81,15 13.5,14.7 14.11,14.11C14.7,13.5 15,12.81 15,12C15,11.19 14.7,10.5 14.11,9.89C13.5,9.3 12.81,9 12,9C11.19,9 10.5,9.3 9.89,9.89C9.3,10.5 9,11.19 9,12C9,12.81 9.3,13.5 9.89,14.11C10.5,14.7 11.19,15 12,15M12,2C14.75,2 17.1,3 19.05,4.95C21,6.9 22,9.25 22,12V13.45C22,14.45 21.65,15.3 21,16C20.3,16.67 19.5,17 18.5,17C17.3,17 16.31,16.5 15.56,15.5C14.56,16.5 13.38,17 12,17C10.63,17 9.45,16.5 8.46,15.54C7.5,14.55 7,13.38 7,12C7,10.63 7.5,9.45 8.46,8.46C9.45,7.5 10.63,7 12,7C13.38,7 14.55,7.5 15.54,8.46C16.5,9.45 17,10.63 17,12V13.45C17,13.86 17.16,14.22 17.46,14.53C17.76,14.84 18.11,15 18.5,15C18.92,15 19.27,14.84 19.57,14.53C19.87,14.22 20,13.86 20,13.45V12C20,9.81 19.23,7.93 17.65,6.35C16.07,4.77 14.19,4 12,4C9.81,4 7.93,4.77 6.35,6.35C4.77,7.93 4,9.81 4,12C4,14.19 4.77,16.07 6.35,17.65C7.93,19.23 9.81,20 12,20H17V22H12C9.25,22 6.9,21 4.95,19.05C3,17.1 2,14.75 2,12C2,9.25 3,6.9 4.95,4.95C6.9,3 9.25,2 12,2Z" />
        </symbol>

        <!-- more icons-->

    </defs>
</svg>
```

### `append` (Object)
TBD

### `mixin` (Array|String)
(List of) mixins that define any number of properties for easy reuse. 

See [Extending](./extending.md)

Example:

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

