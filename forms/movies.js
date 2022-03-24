const genres = [
  "[Unknown]",
  "Action",
  "Adventure",
  "Apocalyptic",
  "Biography",
  "Comedy",
  "Crime",
  "Drama",
  "Fantasy",
  "Filmhouse",
  "Horror",
  "Sci-Fi",
  "Thriller",
];
const getGenres = options => {
  
  return genres;

}
export const movies = {
  model: {
    instance: {
      state: {
        name: "",
        noname: true,
        genre: "",
        movies: [],
      },
    },
    rules: {
      "#/state/name": [
        {
          set: "#/state/noname",
          value: "this.value===''",
        },
      ],
      "#/state/add": [
        {
          set: "#/state/movies",
          value: (context) => {
            let ar = context.get("#/state/movies");
            const item = {
              name: context.get("#/state/name"),
              genre: context.get("#/state/genre"),
            };
            ar.push(item);

            context.set("#/state/name", "");
            context.set("#/state/genre", "");

            return ar;
          },
        },
      ],
    },
  },
  pages: [
    {
      label: "Your movies",

      fields: [
        {
          type: "group",
          layout: "horizontal",
          fields: [
            {
              type: "search",
              autocomplete: {
                items: getGenres,
              },
              bind: "#/state/genre",
              label: "Genre",
            },

            {
              type: "search",
              bind: "#/state/name",
              required: true,
              label: "Name",
            },
            {
              type: "button",
              label: "Add",
              bind: "#/state/add",
              disabled: "#/state/noname",
            },
          ],
        },
        {
          type: "repeat",
          layout: "vertical",
          items: "#/state/movies",
          fields: [
            {
              type: "group",
              layout: "horizontal",
              fields: [
                {
                  type: "group",
                  layout: "vertical",
                  fields: [
                    {
                      type: "text",
                      label: "Name",
                      size: 12,
                      bind: "#/state/movies/@index/name",
                    },
                    {
                      type: "search",
                      label: "Genre",
                      autocomplete: {
                        items: genres,
                      },
                      readonly: true,
                      bind: "#/state/movies/@index/genre",
                    },
                    {
                      type: "tags",
                      bind: "#/state/movies/@index/tags",
                      label: "Tags",
                    },
                  ],
                },

                {
                  type: "button",
                  label: "⨉",
                  click: (e) => {
                    const repeat = e.detail.repeat;
                    if (repeat) {
                      const data = repeat.context.data,
                        ar = data.get("#/state/movies");
                      ar.splice(e.detail.index, 1);
                      data.set("#/state/movies", ar);
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
