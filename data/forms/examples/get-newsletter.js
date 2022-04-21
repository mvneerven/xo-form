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
          bind: "#/data/receive",
          text: "Yes, I would like to receive it"
        },
        {
          type: "email",
          label: "Email address",
          bind: "#/data/email",
          placeholder: "john@doe.com",
          disabled: "#/data/noreceive",
          prepend: {
            icon: "email"
          }
        }
      ]
    }
  ]
};
