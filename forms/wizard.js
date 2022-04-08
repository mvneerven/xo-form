export const wizard = {
  icons: "/data/icons.svg",
  model: {
    rules: {
      "#/state/send": [
        {
          set: "#/state/sent",
          value: (context) => {
            alert(JSON.stringify(context.data.instance.mail, null, 2));
          },
        },
      ],
    },
    instance: {
      state: {},
      mail: {
        emailAddress: "",
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
          prepend: {
            icon: "email"
          }
        },
        {
          type: "textarea",
          label: "Message to send",
          placeholder: "Type a message",
          required: true,
          bind: "#/mail/message",
          maxlength: 150,
        },
        {
          type: "xw-radiogroup",
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
          type: "xw-tags",
          label: "Tags",
          bind: "#/mail/tags",
          placeholder: "Add tag",
          autocomplete: {
            items: ["Milk", "Honey"],
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
          bind: "#/state/send",
        },
      ],
    },
  ],
};
