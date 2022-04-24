export const todos = {
  model: {
    rules: {
      "#/state/added": [
        {
          run: (context) => {
            
            let ar = context.data.instance.todo.items;
            ar.push({
              name: context.data.get("#/state/newTask"),
            });
            context.data.set("#/todo/items", ar)
          },
        },
      ],
    },
    instance: {
      state: {},
      todo: {
        items: [
          {
            name: "Do laundry",
          },
        ],
      },
    },
  },
  pages: [
    {
      fields: [
        {
          type: "repeat",

          items: "#/todo/items",
          
          fields: [
            {
              type: "div",
              innerText: "#/todo/items/@index/name",
            },
          ],
        },
        {
          type: "text",
          autofocus: true,
          label: "New task name",
          placeholder: "Task name...",
          bind: "#/state/newTask",
        },
        {
          type: "button",
          label: "Add",
          bind: "#/state/added",
        },
      ],
    },
  ],
};
