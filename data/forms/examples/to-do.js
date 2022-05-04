export const todos = {
  model: {
    rules: {
      "#/todo/items/*/del": [
        {
          run: (context) => {
            debugger;
          }
        }
      ],
      "#/state/added": [
        {
          run: (context) => {
            let ar = context.data.instance.todo.items;
            ar.push({
              name: context.data.get("#/state/newTask")
            });
            context.data.set("#/todo/items", ar);
            context.data.set("#/state/newTask", "");
          }
        }
      ]
    },
    instance: {
      state: {},
      todo: {
        items: [
          {
            name: "Do laundry"
          },
          {
            name: "Walk dogs"
          },
          {
            name: "Kill time"
          }
        ]
      }
    }
  },
  pages: [
    {
      fields: [
        {
          type: "repeat",
          bind: "#/todo/items",
          fields: [
            {
              type: "group",
              layout: "horizontal",
              fields: [
                {
                  type: "div",

                  style: "padding-top:12px; width: 200px",
                  container: false,
                  innerText: "#/./name"
                },

                {
                  type: "button",
                  label: "⨉",
                  bind: "#/./del"
                }
              ]
            }
          ]
        },
        {
          type: "text",
          autofocus: true,
          label: "New task name",
          placeholder: "Task name...",
          bind: "#/state/newTask",
          autocomplete: {
            items: ["Binge", "Shop", "Sleep"]
          }
        },
        {
          type: "img",
          height: 100,
          src: "/img/logo.png",
          hidden: true
        },
        {
          type: "button",
          label: "Add",
          bind: "#/state/added"
        }
      ]
    },
    {
      fields: [
        {
          type: "button",
          label: "Test",
          bind: "#/state/tested"
        }
      ]
    }
  ]
};
