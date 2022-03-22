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
        emailAddress: "marc@van-neerven.net",
        message: "",
        copy: "No",
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
          placeholder: "john@doe.com",
          required: true,
          bind: "#/mail/emailAddress",
        },
        {
          type: "textarea",
          label: "Message to send",
          placeholder: "Type a message",
          bind: "#/mail/message",
          maxlength: 150,
        },
        {
          type: "select",
          label: "Copy to self",
          bind: "#/mail/copy",
          items: ["Yes", "No"],
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
          placeholder: "Add tag",
          autocomplete: {
            items: ["Test", "Bla"],
          },
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
