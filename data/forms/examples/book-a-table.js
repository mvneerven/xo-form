const TODAY = new Date().toISOString().split("T")[0],
  SPECIAL_WISHES = ["Vegetarian", "Vegan", "Gluten free"],
  SLOTS = ["17:00", "18:00", "19:00", "20:00"];

/**
 * Booking a table at a restaurant
 */
export const bookATable = {
  icons: "data/svg/icons.svg",
  model: {
    instance: {
      state: {
        nospecial: true
      },
      eat: {
        // main instance
        who: "",
        email: "",
        tel: "",
        special: false,
        time: "19:00",
        date: TODAY,
        wishes: []
      }
    },
    rules: {
      "#/eat/special": [
        // toggle visibility of 'special wishes'
        {
          set: "#/state/nospecial",
          value: "!this.value"
        }
      ]
    }
  },
  pages: [
    {
      label: "Book a table",
      children: [
        {
          type: "text",
          label: "Your name",
          required: true,
          placeholder: "John Doe",
          bind: "#/eat/who",
          prepend: {
            icon: "user"
          }
        },
        {
          type: "group",
          layout: "horizontal",
          children: [
            {
              label: "Date",
              type: "date",
              required: true,
              bind: "#/eat/date",
              min: TODAY
            },
            {
              label: "Time",
              type: "xw-radiogroup",
              required: true,
              placeholder: "17:00",
              bind: "#/eat/time",
              items: SLOTS
            }
          ]
        },

        {
          type: "group",
          children: [
            {
              bind: "#/eat/special",
              type: "xw-switch",
              text: "On",
              label: "Special wishes"
            },
            {
              type: "xw-tags",
              bind: "#/eat/wishes",

              placeholder: "Add special wish...",
              autocomplete: {
                items: SPECIAL_WISHES
              },
              hidden: "#/state/nospecial"
            }
          ]
        }
      ]
    },
    {
      label: "Book a table on #/eat/date, #/eat/time",
      children: [
        
        {
          type: "email",
          label: "Your email address",
          required: true,
          bind: "#/eat/email",
          placeholder: "john@doe.com",
          prepend: {
            icon: "email"
          }
        },
        {
          type: "tel",
          label: "Your phone number",
          required: true,
          bind: "#/eat/tel",
          placeholder: "0612345678",
          prepend: {
            icon: "phone"
          }
        }
      ]
    },
    {
      label: "Book",
      children: [
        {
          type: "button",
          label: "Book now",
          class: "exf-lg"
        }
      ]
    }
  ]
};
