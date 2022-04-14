/**
 * Multi-step form example
 * Shows how to build wizard forms
 **/ 
export const wizard = {
  icons: "/data/svg/icons.svg", // pointer to svg sheet
  model: { 
    rules: {
      "#/state/send": [
        {
          run: (context) => {
            alert(JSON.stringify(context.data.instance.mail, null, 2));
          }
        }
      ]
    },
    instance: {
      state: {},
      mail: { // main email instance
        to: "",
        message: "",
        copy: true,
        tags: []
      }
    }
  },
  pages: [
    {
      label: "Compose mail",
      fields: [
        {
          type: "email",
          label: "Email address",
          placeholder: "john@doe.com",
          required: true,
          bind: "#/mail/to",
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
          maxlength: 150
        },
        {
          type: "xw-switch",
          label: "Copy to self",
          bind: "#/mail/copy"
        }
      ]
    },
    {
      label: "Add data",
      fields: [
        {
          type: "xw-tags",
          label: "Tags",
          bind: "#/mail/tags",
          placeholder: "Add tag",
          autocomplete: {
            items: ["Important", "Business", "Personal"]
          }
        },
        {
          label: "Select or drop attachments",
          type: "xw-filedrop",
          bind: "#/mail/attachments"
        }
      ]
    },
    {
      label: "Page 3",
      fields: [
        {
          type: "div",
          label: "Message",
          innerText: `Send "#/mail/message" to '#/mail/to'`
        },
        {
          type: "button",
          label: "Send",
          bind: "#/state/send"
        }
      ]
    }
  ]
};