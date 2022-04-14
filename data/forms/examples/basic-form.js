/**
 * Simplest example of using xo-form
 */
export const form = {
  icons: "/data/svg/icons.svg",
  model: { // model node contains all data-related stuff
    rules: {
      "#/state/send": [ // when model.instance.state.send changes....
        {
          run: (context) => {
            alert(JSON.stringify(context.data.instance.myData, null, 2));
          }
        }
      ]
    },
    instance: { // container for all instances
      state: {},
      myData: { // 'myData' instance
        userName: "johndoe"
      }
    }
  },
  pages: [ // root node for form (form can have multiple pages)
    {
      fields: [ // each page has array of field schemas
        {
          type: "text",
          label: "User name",
          required: true,
          placeholder: "Enter username...",
          bind: "#/myData/userName",
          prepend: {
            icon: "user"
          }
        },
        {
          type: "button",
          label: "Send",
          bind: "#/state/send"
        }
      ]
    }
  ]
};
