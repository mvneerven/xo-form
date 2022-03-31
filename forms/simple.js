export const form = {
  validation: "inline",
  layout: "static",
  model: {
    instance: {
      state: {},
      data: {
        name: "",
        schema: "const schema = {};",
        range: 8,
      },
    },
    rules: {
      "#/state/submit": [
        {
          run: (context) => {
            alert(JSON.stringify(context.data.instance.data, null, 2));
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
          label: "Your name",
          required: true,
          placeholder: "Enter your name...",
          minLength: 3,
          bind: "#/data/name",
        },
        {
          type: "email",
          label: "Your email address",
          required: true,
          placeholder: "john@doe.com",
          bind: "#/data/email",
        },
        {
          type: "xw-tags",
          label: "Tags",
        },
        {
          type: "xw-omnibox",
          label: "Search",
          bind: "#/data/srch",
        },
        {
          type: "xw-monaco",
          bind: "#/data/schema",
          label: "Message",
          placeholder: "Your message...",
        },
        {
          type: "button",
          label: "Send",
          bind: "#/state/submit",
        },
      ],
    },
  ],
};
