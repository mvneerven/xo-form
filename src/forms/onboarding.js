import breeds from "../../data/pet-breeds.json";

const breedAutoComplete = (options) => {
  let bd = window.breedData;
  let search = options.search.toLowerCase();
  return bd.filter((i) => {
    return i.text.toLowerCase().indexOf(search) >= 0;
  });
};

export const onboarding = {
  model: {
    instance: {
      state: {},
      insurance: {
        //type: "dog",
      },
    },
    rules: {
      "#/insurance/type": [
        {
          set: "#/state/breeds",
          value: (context) => {
            window.breedData = breeds[context.value].map((i) => {
              return {
                text: i.name,
              };
            });
          },
        },
        {
          set: "#/state/typeImage",
          value: (context) => {
            return `/img/pets/${context.get("#/insurance/type")}.webp`;
          },
        },
        {
          set: "#/_xo/nav/page",
          value: 2,
        },
      ],
    },
  },
  pages: [
    {
      fields: [
        {
          type: "info",
          title: "Petplan. Het plan dat je huisdier niet zelf kan maken",
        },
        {
          type: "radiogroup",
          layout: "cards",
          label: "Wat voor huisdier wil je verzekeren?",
          required: true,
          style: "--card-width: 110px; --card-height: 110px",
          bind: "#/insurance/type",
          items: [
            { label: "Cat", value: "cat", image: "/img/pets/cat.webp" },
            { label: "Dog", value: "dog", image: "/img/pets/dog.webp" },
            {
              label: "Parrot",
              value: "parrot",
              image: "/img/pets/parrot.webp",
            },
            {
              label: "Rabbit",
              value: "rabbit",
              image: "/img/pets/rabbit.webp",
            },
          ],
        },
      ],
    },
    {
      fields: [
        {
          type: "info",
          title: "Basisgegevens #/insurance/type",
          body: "Wat voor huisdier wil je verzekeren?",
        },
        {
          type: "text",
          label: "Name",
          required: true,
          bind: "#/insurance/name",
        },

        {
          type: "search",
          label: "Breed",
          bind: "#/insurance/breed",
          required: true,
          autocomplete: {
            items: breedAutoComplete,
          },
        },
        {
          type: "radiogroup",
          label: "Age",
          bind: "#/insurance/ageGroup",
          required: true,
          items: ["1-2 years", "3-5 years", "> 5 years"],
        },
      ],
    },
    {
      fields: [
        {
          type: "info",
          title: "Verzekeringen",
          body: "Kies een pakket",
        },
        {
          type: "radiogroup",
          layout: "list",
          style: "--card-width: 100%; --card-height: 110px",
          bind: "#/insurance/plan",
          items: [
            { label: "Standaard", value: "std" },
            { label: "Premium", value: "premium" },
          ],
        },
      ],
    },
  ],
};
