export const form = {
  validation: "inline",
  layout: "static",
  icons: "data/svg/icons.svg",
  model: {
    instance: {
      state: {},
      insurance: {}
    },
    rules: {
      
    }
  },
  pages: [
    {
      label: "My Form",
      children: [
        {
          
              type: "xw-omnibox",
              required: true,
              
              label: "Your question",
              categories: {
                Kennis: {
                  getItems: async options => {
                    return [
                      {
                        text: "Test"
                      }
                    ]
                  }
                }
              }
              
        }
      ]
    }
  ]
};
