export const categories = {
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
};
