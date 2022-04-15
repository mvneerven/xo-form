/**
 * Simple form that shows conditional UI.
 */
export const getNewsLetter = {
  // conditional logic form
  icons: "/data/svg/icons.svg",
  model: {
    rules: {
      "#/data/receive": [
        {
          set: "#/data/noreceive",
          value: "!this.value"
        }
      ]
    },
    instance: {
      data: {
        receive: false,
        email: "yama@moto.jp"
      }
    }
  },
  pages: [
    {
      label: "Newsletter",
      fields: [
        {
          type: "xw-switch",
          label: "Subscribe to the newsletter",
          text: "Yes, I would like to receive it",
          bind: "#/data/receive"
        },
        {
          label: "Email address",
          placeholder: "john@doe.com",
          bind: "#/data/email",
          type: "email",
          disabled: "#/data/noreceive",
          prepend: {
            icon: "email"
          }
        },
        {
          type: "button",
          label: "Test",
          prepend: {
            icon: "fas fa-share"
          }
        }
      ]
    }
  ]
};
