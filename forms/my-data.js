export const form = {
    model: {
      instance: {
        myData: {
          userName: "johndoe"
        }
      }
    },
    pages: [
      {
        fields: [
          {
            type: "text",
            label: "User name",
            bind: "#/myData/userName"
          }
        ]
      }
    ]
  }