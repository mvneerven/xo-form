/**
 * Simplest example of using xo-form
 */
export const form = {
  icons: "data/svg/icons.svg",
  model: {
    // model node contains all data-related stuff

    rules: {
      "#/state/commit": [
        // when commit property changes....
        {
          run: (context) => {
            alert(JSON.stringify(context.data.instance.myData, null, 2));
          }
        }
      ]
    },
    instance: {
      // container for all instances
      state: {},
      myData: {
        emailAddress: "",
        msg: ""
      } // 'myData' instance
    }
  },
  pages: [
    // root node for form (form can have multiple pages)
    {
      label: "My Form",
      children: [
        // each page has array of field schemas
        {
          type: "email",
          label: "Email address",
          required: true,
          placeholder: "john@doe.io",
          bind: "#/myData/emailAddress",
          prepend: {
            icon: "email"
          }
        },
        {
          type: "textarea",
          required: true,
          bind: "#/myData/msg",
          placeholder: "Type a message...",
          label: "Message",
          rows: 5,
          prepend: {
            icon: "msg"
          }
        },
        {
          type: "div",
          label: "Result",
          container: false,
          innerText: "Message '#/myData/msg' to '#/myData/emailAddress'"
        },
        {
          type: "button",
          mixin: "xo/button/submit"
        }
      ]
    }
  ]
};
