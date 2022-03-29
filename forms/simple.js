export const form = {
  validation: "inline",
  layout: "static",
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
          bind: "#/state/name",
        },
        {
          type: "email",
          label: "Your email address",
          required: true,
          placeholder: "john@doe.com",
          bind: "#/state/email",
        },
        {
          type: "textarea",
          bind: "#/state/msg",
          label: "Message",
          placeholder: "Your message..."
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
