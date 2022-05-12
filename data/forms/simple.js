export const form = {
  validation: "inline",
  layout: "static",
  icons: "data/svg/icons.svg",
  model: {
    instance: {
      state: {},
      insurance: {}
    },
    rules: {
      "#/insurance/zipCode": [
        {
          value: (context) => {
            let s = (context.value ?? "").replace(" ", "");

            if (s && s.length >= 6) {
              s = s.substring(0, 4) + " " + s.substring(4);
              return s.toUpperCase();
            }
            return context.value;
          }
        }
      ]
    }
  },
  pages: [
    {
      label: "My Form",
      children: [
        {
          type: "group",
          children: [
            {
              type: "text",
              required: true,
              bind: "#/insurance/zipCode",
              label: "Your zip code",
              maxlength: 7,
              pattern: "[1-9][0-9]{3}\\s?[a-zA-Z]{2}",
              placeholder: "1234 AB"
            }
          ]
        },

        {
          type: "button",
          label: "Send",
          mixin: "xo/button/submit",
          prepend: {
            icon: "db"
          }
        }
      ]
    }
  ]
};
