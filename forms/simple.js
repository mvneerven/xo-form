export const form = {
  validation: "inline",
  model: {
    instance: {
      state: {},
      data: {
        name: "",
        msg: "",
        range: 8,
      },
    },
    rules: {
      "#/state/submit": [
        {
          run: (context) => {
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
          label: "Your name",
          required: true,
          placeholder: "Enter your name...",
          minLength: 3,
          bind: "#/state/msg",
        },
        {
          type: "email",
          label: "Your email address",
          required: true,
          placeholder: "john@doe.com",
          bind: "#/state/email",
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
