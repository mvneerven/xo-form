export const bookATable = {
  model: {
    instance: {
      eat: {
        special: false,
        time: "19:00",
        date: "",
        wish: "",
        wishes: ["Vegatarian", "Vegan", "Gluten free"],
      },
    },
    rules: {
      "#/eat/special": [
        {
          set: "#/eat/nospecial",
          value: "!this.value",
        },
      ],
    },
  },
  pages: [
    {
      label: "Book a table",
      fields: [
        {
          type: "group",
          layout: "horizontal",
          fields: [
            {
              label: "Date",
              type: "date",
              bind: "#/eat/date",
              min: "2021-10-01",
            },
            {
              label: "Time",
              type: "radiogroup",
              bind: "#/eat/time",
              items: ["17:00", "18:00", "19:00", "20:00"],
            },
          ],
        },

        {
          bind: "#/eat/special",
          type: "switch",
          label: "Special wishes",
        },
        {
          name: "field2",
          type: "checkgroup",
          label: "Wishes",
          bind: "#/eat/wish",
          items: "#/eat/wishes",
          hidden: "#/eat/nospecial",
        },
      ],
    },
    {
      label: "Contact",
      fields: [
        {
          type: "email",
          label: "Your email address",
          placeholder: "john@doe.com",
        },
      ],
    },
    {
      label: "Book",
      fields: [
        {
          type: "button",
          label: "Book now",
          class: "exf-lg",
        },
      ],
    },
  ],
};
