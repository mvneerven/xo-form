/**
 * Simple form that shows conditional UI.
 */
export const getNewsLetter = {
  // conditional logic form
  icons: "data/svg/icons.svg",
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
        noreceive: true,
        email: "yama@moto.jp"
      }
    }
  },
  pages: [
    {
      label: "Newsletter",
      children: [
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
          required: true,
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
