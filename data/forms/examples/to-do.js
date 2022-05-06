// TO-DO app written entirely as declarative schema
export const todos = {
  model: {
    rules: {
      "#/todo/items/*/del": [
        {
          run: (context) => {
            //debugger;
            let index = parseInt(context.path.split("/")[3]);
            context.data.instance.todo.items.splice(index, 1);
            console.log("Removed item", index, "new item count: ", context.data.instance.todo.items.length)
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
            
            context.data.set("#/state/newTask", "");
          }
        }
      ]
    },
    instance: {
      state: {},
      todo: {
        items: [
          
        ]
      }
    }
  },
  pages: [
    {
      children: [
        {
          type: "repeat",
          bind: "#/todo/items",
          template: [
            {
              type: "group",
              layout: "horizontal",
              children: [
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
          required: true,
          minLength: 5,
          autocomplete: {
            items: ["Binge", "Shop", "Sleep"]
          }
        },
        
        {
          type: "button",
          label: "Add",
          bind: "#/state/added"
        }
      ]
    }
  ]
};
