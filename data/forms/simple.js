export const form = {
  validation: "inline",
  layout: "static",
  icons: "/data/svg/icons.svg",
  model: {
    instance: {
      state: {},
      data: {
        name: "",
        schema: "const schema = {};",
        range: 8
      }
    },
    rules: {
      "#/state/submit": [
        {
          run: (context) => {
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
          label: "Your name",
          required: true,
          placeholder: "Enter your name...",
          minLength: 3,
          bind: "#/data/name",
          prepend: {
            icon: "test"
          }
        },
        {
          type: "email",
          label: "Your email address",
          required: true,
          placeholder: "john@doe.com",
          bind: "#/data/email",
          prepend: {
            icon: "email"
          }
        },
        {
          type: "xw-tags",
          label: "Tags",
          placeholder: "New tag...",
          autocomplete: {
            items: ["Beer", "Wine", "Coffee"]
          }
        },
       
        {
          type: "button",
          label: "Send",
          bind: "#/state/submit"
        }
      ]
    }
  ]
};
