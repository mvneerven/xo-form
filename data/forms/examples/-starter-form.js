// A simple form starter, with an implicit model
export const myForm = {
  pages: [
    {
      label: "My Form", // legend
      children: [
        {
          type: "text", // input[type=text]
          label: "Your name",
          bind: "#/data/name" // implicitly generates 'data' instance
        }
      ]
    }
  ]
};
