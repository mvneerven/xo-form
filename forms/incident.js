export const form = {
  progress: "risesteps",
  submit: false,
  model: {
    rules: {
      "#/state/save": [
        {
          run: context=>{
            debugger
          }
        }
      ],
      "#/incident/shortcut": [
        {
          set: "#/incident/date",
          value: (context) => {
            switch (context.value) {
              case "specificDate":
                context.data.set("#/state/specificDateHidden", false);

                break;
              case "today":
                context.data.set("#/state/specificDateHidden", true);
                context.data.set(
                  "#/incident/date",
                  context.data.get("#/calc/today")
                );
                break;
              case "yesterday":
                context.data.set("#/state/specificDateHidden", true);
                context.data.set(
                  "#/incident/date",
                  context.data.get("#/calc/yesterday")
                );
                break;
            }
          },
        },
      ],
      "#/incident/locationType": [
        {
          set: "#/state/isOnline",
          value: (context) => {
            return context.value === "online";
          },
        },
        {
          set: "#/state/isPhysical",
          value: (context) => {
            return context.value !== "online";
          },
        },
      ],
    },
    instance: {
      state: {
        specificDateHidden: true,
        isOnline: true,
        isPhysical: false,
      },
      calc: {
        dateString: "",
        yesterday: (() => {
          let date = new Date();
          date.setDate(new Date().getDate() - 1);
          return date.toISOString().split("T")[0];
        })(),
        today: new Date().toISOString(),
      },
      incident: {
        shortcut: "today",
        date: new Date().toISOString(),
        time: new Date().getHours() + ":" + new Date().getMinutes(),
        locationType: "online",
        where: "",
        what: "",
        who: "",
        why: [],
        witnesses: [],
        assets: {
          imageFiles: [],
          audioFiles: [],
          videoFiles: [],
          textFiles: [],
        },
      },
      people: {
        offenders: ["John"],
        witnesses: ["Jannie"],
      },
    },
  },
  pages: [
    {
      label: "Nieuw Incident",
      intro: "Waar en wanneer gebeurde het?",
      fields: [
        {
          type: "xw-radiogroup",
          name: "locType",
          bind: "#/incident/locationType",
          layout: "default",
          required: true,
          items: [
            { value: "online", label: "Internet" },
            { value: "inside", label: "Binnen" },
            { value: "outside", label: "Buiten" },
          ],
        },
        {
          type: "search",
          bind: "#/incident/where",
          placeholder: "Facebook",
          required: true,
          // prepend: {
          //   icon: "fas fa-map-marker-alt",
          // },
          info: "Geef aan op welk medium het online incident plaatsvond",
          autocomplete: {
            items: [
              {
                icon: "fab fa-facebook-f",
                text: "Facebook",
              },
              {
                icon: "fab fa-instagram",
                text: "Instagram",
              },
              {
                icon: "fab fa-whatsapp",
                text: "WhatsApp",
              },
              {
                icon: "fab fa-tiktok",
                text: "TikTok",
              },
              {
                icon: "fas fa-share-alt",
                text: "Andere Social Media",
              },
            ],
          },
          hidden: "#/state/isPhysical",
        },
        {
          type: "search",
          hidden: "#/state/isOnline",

          bind: "#/incident/where",
          placeholder: "Kalverstraat, Amsterdam",
          required: true,
          info: "Beschrijf zo nauwkeurig mogelijk waar het incident plaatsvond",
          // prepend: {
          //   icon: "fas fa-map-marker-alt",
          // },
          autocomplete: {
            items: [],
          },
        },
        {
          required: true,
          singleSelect: true,

          bind: "#/incident/shortcut",
          type: "xw-radiogroup",
          layout: "default",
          items: [
            {
              value: "today",
              label: "Vandaag",
            },
            {
              value: "yesterday",
              label: "Gisteren",
            },
            {
              value: "specificDate",
              label: "Anders...",
            },
          ],
        },
        {
          type: "date",
          name: "incidentdate",
          bind: "#/incident/date",
          label: "Datum",
          hidden: "#/state/specificDateHidden",
          max: "#/calc/today",
        },
        {
          type: "time",
          bind: "#/incident/time",
          label: "Tijd",
        },
      ],
    },
    {
      label: "Dader",
      intro:
        "Geef de naam van de dader, als je die weet. In 'Beheer Daders' kun je de verdere gegevens noteren.",
      fields: [
        {
          type: "xw-radiogroup",
          required: true,
          bind: "#/incident/who",
          addcaption: "[Nieuwe dader]",
          items: "#/people/offenders",
        },

        {
          type: "xw-tags",
          items: ["Test"],
          bind: "#/incident/why",
          placeholder: "Selecteer...",
          required: true,
          label: "Weet je waarom de dader dit deed?",
          autocomplete: {
            items: [
              "Jaloezie",
              "Wrok",
              "Haat",
              "Onder invloed",
              "Breuk niet verkroppen",
              "Onbekend",
            ].map((i) => {
              return { icon: "far fa-circle", text: i };
            }),
          },
          info: "Je kunt meerdere redenen selecteren",
        },
      ],
    },
    {
      label: "Wat gebeurde er?",
      intro: "Geef zoveel mogelijk informatie over het voorval",

      fields: [
        {
          type: "textarea",
          class: "exf-border exf-std-lbl",

          bind: "#/incident/what",
          label: "Beschrijf het incident met #/incident/who",
          placeholder: "Wat er gebeurde was...",
          info: "Benoem alles wat naar jouw mening bijdraagt aan de ernst van de zaak, met het oog op een latere aangifte.",
          autogrow: true,
          required: true,
          rows: 8,
        },
      ],
    },
    {
      label: "Bijlagen",
      intro:
        "Voeg bijlagen toe waarmee het voorval verduidelijkt wordt. Je kunt afbeeldingen, video's, audio- en tekstbestanden toevoegen",

      fields: [
        {
          type: "xw-filedrop",
          bind: "#/incident/assets/imageFiles",
          style: "--thumb-bgcolor: white",
          label: "Foto's",
          height: "300px",
          max: 3,
          thumbSize: "70px",
          fileTypes: ["image/", "text/"],
        },
      ],
    },
    {
      label: "Getuigen",
      intro:
        "Geef hier alleen de namen van de getuigen. Je kunt in 'Beheer Getuigen' de verdere gegevens noteren, zodat er contact opgenomen kan worden.",

      fields: [
        {
          type: "xw-checkgroup",
          bind: "#/incident/witnesses",
          addcaption: "[Nieuwe getuige]",
          items: "#/people/witnesses",
        },
      ],
    },

    {
      label: "Opslaan",
      intro: "Overzicht van het incident",
      fields: [
        {
          type: "xw-info",
          label: "Samenvatting",
          title: "Incident",
          body: "#/incident/who - #/incident/what #/incident/where",
        },
        {
          type: "button",
          label: "Opslaan",
          bind: "#/state/save",
          icon: "ti-save",
        },
      ],
    },
  ],
};
