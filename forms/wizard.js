export const wizard = {
  model: {
    rules: {
      "#/mail/send": [
        {
          set: "#/mail/sent",
          value: (context) => {
            alert(1);
          },
        },
      ],
    },
    instance: {
      mail: {
        emailAddress: "",
        message: "",
        tags: [],
      },
    },
  },
  pages: [
    {
      label: "Page 1",
      fields: [
        {
          type: "email",
          label: "Email address",
          required: true,
          bind: "#/mail/emailAddress",
        },
        {
          type: "textarea",
          label: "Message",
          bind: "#/mail/message",
          maxlength: 150
        },
      ],
    },
    {
      label: "Page 2",
      fields: [
        
        {
          type: "tags",
          label: "Tags",
          bind: "#/mail/tags",
          autocomplete: {
            items: ["Test", "Bla"]
          }
        },
      ],
    },
    {
      label: "Page 3",
      fields: [
        {
          type: "div",
          label: "Message",
          innerText: `Send "#/mail/message" to '#/mail/emailAddress'`,
        },
        {
          type: "button",
          label: "Send",
          bind: "#/mail/send",
        },
      ],
    },
  ],
};
