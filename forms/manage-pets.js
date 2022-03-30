import breeds from "./pet-breeds.json" assert { type: "json" };
const weightCategories = {
  parrot: [],
  rabbit: [],
  cat: [],
  dog: [
    "Mix 0-9 kg",
    "Mix 10-19 kg",
    "Mix 20-29 kg",
    "Mix 30-39 kg",
    "Mix 40+ kg",
  ],
};
const breedAutoComplete = (options) => {
  let index =
    parseInt(options.control.parent.parent.parent.getAttribute("data-index")) -
    1;
  let type = (
    options.control?.context?.data.instance.state.pets[index].type ?? "dog"
  ).toLowerCase();

  let bd = breeds[type].map((i) => {
    return {
      text: i.name,
    };
  });
  //let search = options.search.toLowerCase();

  return weightCategories[type]
    .map((i) => {
      return { text: i };
    })
    .concat(bd);
};

export const managePets = {
  model: {
    instance: {
      state: {
        pets: [],
      },
    },
    rules: {
      "#/state/pets/*/remove": [
        {
          run: (context) => {
            // context.binding ~ #/state/pets/1/remove'
            const index = parseInt(context.binding.split("/")[3]);
            const ar = context.data.get("#/state/pets");
            ar.splice(index, 1);
            context.data.set("#/state/pets", ar);
          },
        },
      ],
      "#/state/pets/*/name": [
        {
          value: (context) => {
            return context.value.toUpperCase();
          },
        },
      ],
      "#/state/pets/*/image/*": [
        {
          set: "#/state/ga",
          value: (context) => {
            debugger;
          },
        },
      ],

      "#/state/add": [
        {
          set: "#/state/pets",
          value: (context) => {
            let ar = context.data.get("#/state/pets");
            ar.push({
              name: context.data.get("#/state/name"),
            });
            return ar;
          },
        },
      ],
    },
  },
  pages: [
    {
      label: "Page 1",

      fields: [
        {
          type: "group",
          layout: "horizontal",
          align: "center",
          fields: [
            {
              type: "text",
              label: "Add pet",
              bind: "#/state/name",
              placeholder: "Pet name....",
            },
            {
              type: "button",
              label: "Add",
              style: "margin-top: -8px",
              bind: "#/state/add",
            },
          ],
        },
        {
          type: "repeat",
          layout: "vertical",
          items: "#/state/pets",

          fields: [
            {
              type: "group",
              layout: "horizontal",
              ui: "panel",
              fields: [
                {
                  type: "group",
                  layout: "vertical",

                  fields: [
                    {
                      type: "text",
                      style: "width: 8em",
                      label: "Name",
                      required: true,
                      bind: "#/state/pets/@index/name",
                    },
                    {
                      type: "search",
                      label: "Type",
                      required: true,
                      bind: "#/state/pets/@index/type",
                      autocomplete: {
                        items: ["Cat", "Dog", "Parrot", "Rabbit"],
                      },
                    },
                    {
                      type: "search",
                      label: "Breed",
                      required: true,
                      bind: "#/state/pets/@index/breed",
                      autocomplete: {
                        items: breedAutoComplete,
                      },
                    },
                    {
                      type: "text",
                      label: "Birthdate",
                      bind: "#/state/pets/@index/birthDate",
                      required: true,
                      placeholder: "DD-MM-JJJJ",
                      pattern: "[0-9]{2}-[0-9]{2}-[1-2][9,0][1-9]{2}",
                    },
                  ],
                },
                {
                  type: "xw-filedrop",
                  label: "Photo",
                  bind: "#/state/pets/@index/image",
                  height: "200px",
                  max: 1,
                  types: ["image/"],
                  limit: 1024 * 5 * 1000,
                },

                {
                  type: "button",
                  label: "⨉",
                  bind: "#/state/pets/@index/remove",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
