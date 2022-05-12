// TO-DO app written entirely as declarative schema
export const todos = {
  icons: "/data/svg/icons.svg",
  model: {
    rules: {
      "#/todo/items/*/del": [
        {
          run: (context) => {
            let index = parseInt(context.path.split("/")[3]);
            context.data.instance.todo.items.splice(index, 1);
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
      ],
      "#/state/newTask": [
        {
          run: (context) => {
            context.data.set("#/state/newTaskEmpty", context.value === "");
          }
        }
      ]
    },
    instance: {
      state: { newTaskEmpty: true, check: false },
      todo: {
        items: []
      }
    }
  },
  pages: [
    {
      label: "My Task List",
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
                  type: "xw-checkbox",
                  text: "#/./name",
                  container: false,
                  name: "tasks",
                  style: "padding-top:12px; width: 300px",
                  bind: "#/./done",
                  title: "Mark task as done"
                },
                {
                  type: "button",
                  label: "⨉",
                  bind: "#/./del",
                  title: "Remove task"
                }
              ]
            }
          ]
        },
        {
          type: "text",
          label: "New task name",
          placeholder: "Task name...",
          bind: "#/state/newTask",
          prepend: {
            icon: "task"
          },
          required: true,
          minLength: 5
        },

        {
          type: "button",
          label: "Add task",
          style: "float: right",
          bind: "#/state/added",
          disabled: "#/state/newTaskEmpty"
        }
      ]
    }
  ]
};
