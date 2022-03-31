export const form = {
  validation: "inline",
  layout: "static",
  model: {
    instance: {
      state: {},
      data: {
        name: "",
        schema: "const schema = {};",
        range: 8,
      },
    },
    rules: {
      "#/state/submit": [
        {
          run: (context) => {
            alert(JSON.stringify(context.data.instance.data, null, 2));
          },
        },
      ],
    },
  },
  pages: [
    {
      label: "My Form",
      fields: [
        {
          type: "text",
          label: "Your name",
          required: true,
          placeholder: "Enter your name...",
          minLength: 3,
          bind: "#/data/name",
        },
        {
          type: "email",
          label: "Your email address",
          required: true,
          placeholder: "john@doe.com",
          bind: "#/data/email",
        },
        {
          type: "xw-tags",
          label: "Tags",
          placeholder: "New tag...",
          autocomplete: {
            items: ["Beer", "Wine", "Coffee"],
          },
        },
        {
          type: "xw-omnibox",
          label: "Omnibox",
          bind: "#/data/srch",
          placeholder: "Start typing your cocktail...",
          categories: {
            Bla: {
              trigger: (options) => {
                return options.search.length > 1;
              },
              getItems: async (options) => {
                let result = await fetch(
                  "https://www.thecocktaildb.com/api/json/v1/1/search.php?s=" +
                    options.search
                ).then((x) => x.json());

                return result.drinks.map((d) => {
                  return {
                    text: d.strDrink,
                  };
                });
              },
            },
            Test: {
              newTab: true,

              getItems: (options) => {
                return [
                  {
                    text: "Look up",
                    url: "https://vinepair.com/articles/50-most-popular-cocktails-world-2017/",
                    description: "Go to vinepair.com...",
                  },
                ];
              },
            },
          },
        },
        {
          type: "xw-monaco",
          bind: "#/data/schema",
          label: "Message",
          placeholder: "Your message...",
        },
        {
          type: "button",
          label: "Send",
          bind: "#/state/submit",
        },
      ],
    },
  ],
};
