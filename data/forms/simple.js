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
      children: [
        {
          type: "group",
          children: [
            {
              type: "text",
              label: "Your name",
              autofocus: true,
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
            }
          ]
        },

        {
          type: "button",
          label: "Send",
          mixin: "xo/button/submit",
          prepend: {
            icon: "db"
          }
        }
      ]
    }
  ]
};
