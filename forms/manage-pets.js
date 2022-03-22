import breeds from "../data/pet-breeds.json" assert { type: "json" };

const breedAutocomplete = (options, e) => {
  let host = e.target.getRootNode().host;
  let rp = host.closestElement("xo-repeat");
  let type = null;
  if (rp) {
    let index = host.closestElement("xo-group").parentNode.parentNode.index;
    type = rp.items[index].type;
  }
  let bd = breedData;

  if (type) bd = breeds[type.toLowerCase()];

  let search = options.search.toLowerCase();
  return bd
    .filter((i) => {
      return i.name.toLowerCase().indexOf(search) >= 0;
    })
    .map((x) => {
      return {
        text: x.name,
      };
    });
};

export const managePets = {
  model: {
    instance: {
      state: {
        pets: [],
      },
    },
    rules: {
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
            let ar = context.get("#/state/pets");
            ar.push({
              name: context.get("#/state/name"),
            });
            return ar;
          },
        },
      ],
      "#/state/type": [
        {
          set: "#/state/breeds",
          value: (context) => {
            window.breedData = breeds[context.value.toLowerCase()];
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
                      bind: "#/state/pets/@index/name",
                    },
                    {
                      type: "search",
                      label: "Type",
                      bind: "#/state/pets/@index/type",
                      autocomplete: {
                        items: ["Cat", "Dog", "Parrot", "Rabbit"],
                      },
                    },
                    {
                      type: "search",
                      label: "Breed",
                      bind: "#/state/pets/@index/breed",
                      autocomplete: {
                        items: breedAutocomplete,
                      },
                    },
                    {
                      type: "date",
                      label: "Birthdate",
                      bind: "#/state/pets/@index/birthDate",
                    },
                  ],
                },
                {
                  type: "filedrop",
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
                  click: (e) => {
                    const repeat = e.detail.repeat;
                    if (repeat) {
                      const data = repeat.context.data,
                        ar = data.get("#/state/pets");
                      ar.splice(e.detail.index, 1);
                      data.set("#/state/pets", ar);
                    }
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
