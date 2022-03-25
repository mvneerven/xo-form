export const form = {
  model: {
    instance: {
      state: {},
      data: {
        name: "",
        msg: "",
        range: 8,
      },
    },
    rules: {
      "#/state/submit": [
        {
          value: (context) => {
            alert(JSON.stringify(context.model.instance.data, null, 2));
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
          type: "xw-tags",
          maxWidth: "300px",
          bind: "#/state/tags",
          label: "Tags",
          placeholder: "Type tag ↵",
          autocomplete: {
            items: ["Test", "Aap", "Noot"],
          },
        },
        {
          type: "text",
          label: "Your name",
          placeholder: "Enter your name...",
          bind: "#/state/msg",
          autocomplete: {
            items: ["Test", "Aap", "Noot"],
          },
        },
      ],
    },
  ],
};
