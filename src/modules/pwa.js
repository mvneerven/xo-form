import Router from "./Router";
import { LIT_COMPONENTS } from "../Components";
import breeds from '../../data/pet-breeds.json';

class PWA {
    constructor() {
        this.router = new Router({
            type: "history",
            routes: {
                "/": "home",
                "/test": "test"
            }
        });

        this.router.listen().on("route", e => {
            console.log(e.detail.route, e.detail.url);
        });

        this.checkDarkTheme()

        this.area = document.querySelector("main")

        this.form = document.querySelector("xo-form");

        const schema1 = {
            model: {
                rules: {
                    "#/state/choice": [
                        {
                            set: "#/state/choicesvisible",
                            value: "!this.value"
                        }
                    ],
                    "#/state/name": [

                        {
                            set: "#/state/msg",
                            value: "`This is ${this.value.toUpperCase()}'s message`"
                        }
                    ],
                    "#/state/button1": [
                        {
                            set: "#/state/width",
                            value: 290
                        }
                    ],
                    "#/state/button2": [
                        {
                            set: "#/state/date",
                            value: "'2001-08-23'"
                        }
                    ],
                    "#/state/button3": [
                        {
                            set: "#/_xo/page",
                            value: 2
                        }
                    ]


                },
                instance: {
                    state: {
                        name: "Marc",
                        width: 200,
                        msg: "",
                        choice: false,

                        date: "1970-01-01",
                        img: "/img/bull.webp",
                        pet: {
                            type: "Dog",
                            name: "Pavlov"
                        }
                    }
                }
            },
            pages: [
                {
                    label: "Page 1",
                    fields: [
                        {
                            type: "text",
                            name: "txt1",
                            autocomplete: {
                                items: ["Marc", "Mama", "Joke"]
                            },
                            label: "Your name",
                            required: true,
                            bind: "#/state/name",
                            pattern: "Marc"

                        },
                        {
                            type: "textarea",
                            name: "txt2",
                            label: "Your message",
                            bind: "#/state/msg"

                        },
                        {
                            type: "group",
                            fields: [{
                                type: "slider",
                                name: "chk1",
                                label: "Special wishes",
                                bind: "#/state/choice"
                            },
                            {
                                type: "checkboxlist",
                                name: "chk_list",
                                items: ["Vegetarian", "Vegan", "Gluten free"],
                                value: ["Bad"],
                                hidden: "#/state/choicesvisible"
                            }]
                        },
                        {
                            type: "date",
                            name: "date",
                            bind: "#/state/date",
                            min: "1920-01-01",
                            max: "2004-01-01",
                            label: "My date"
                        },

                        {
                            type: "group",
                            label: "Resizable image",

                            layout: "vertical",
                            fields: [
                                {
                                    type: "url",
                                    name: "url",
                                    label: "Image url",
                                    bind: "#/state/img",
                                    placeholder: "Enter URL",
                                    required: true
                                },
                                {
                                    type: "img",
                                    src: "#/state/img",
                                    width: "#/state/width"
                                },
                                {
                                    type: "range",
                                    label: "Image #/state/img width: #/state/width", //label: "Range",
                                    bind: "#/state/width",
                                    min: 100,
                                    max: 600
                                }
                            ]
                        },

                        {
                            type: "group",
                            label: "Group",
                            layout: "horizontal",
                            fields: [
                                {
                                    type: "button",
                                    label: "Test 1",
                                    bind: "#/state/button1"

                                },
                                {
                                    type: "button",
                                    label: "Test 2",
                                    bind: "#/state/button2"
                                },

                                {
                                    type: "button",
                                    label: "Test 3",
                                    bind: "#/state/button3"
                                },
                            ]
                        }


                    ]
                },

                {
                    label: "Page 2",
                    fields: [
                        {
                            type: "textarea",
                            name: "txtarea",
                            rows: "10",
                            label: "My message",
                            value: "This is a large piece of \ntext"
                        },
                        {
                            type: "select",
                            name: "select",
                            label: "My select dropdown",
                            items: ["Good", "Bad", "Ugly"]
                        },
                        {
                            type: "time",
                            required: true,
                            label: "My time",
                            bind: "#/state/time"
                        }
                    ]
                }
            ]
        };

        const schema = {
            model: {
                instance: {

                    state: {
                        type: "Cat",
                        
                        pets: [
                            { type: "Dog", name: "Pavlov", breed: "Pyrenese Berghond" },
                            { type: "Cat", name: "Gijs", breed: "British Shorthair" },
                            { type: "Dog", name: "Macho", breed: "Spanish Bastard" }
                        ]
                    }
                },
                rules: {
                    "#/state/add": [
                        {
                            set: "#/state/pets",
                            value: context => {
                                let ar = context.get("#/state/pets");
                                ar.push({
                                    name: "Unnamed Pet",
                                    type: context.get("#/state/type"),
                                    breed: context.get("#/state/breed"),
                                })
                                return ar;
                            }
                        }
                    ],
                    "#/state/type": [
                        {
                            set: "#/state/breeds",
                            value: context => {
                                window.breedData = breeds[context.value.toLowerCase()]
                            }
                        }
                    ],
                    "#/state/pets[@index]/remove": [
                        {
                            set: "#/dd/",
                            value: context => {
                                debugger
                            }
                        }
                    ]
                }
            },
            pages: [
                {
                    label: "Page 1",

                    fields: [
                        {
                            type: "group",
                            layout: "horizontal",
                            fields: [
                                {
                                    type: "select",
                                    items: ["Dog", "Cat", "Parrot", "Rabbit"],
                                    bind: "#/state/type",
                                    label: "Type"

                                },
                                {
                                    type: "text",
                                    bind: "#/state/breed",
                                    
                                    autocomplete: {
                                        items: () => {
                                            return breedData.map(x => {
                                                return {
                                                    text: x.name
                                                }
                                            })
                                        }
                                    },
                                    label: "Breed"

                                },
                                {
                                    type: "button",
                                    label: "Add",
                                    bind: "#/state/add"
                                }
                            ]
                        },
                        {
                            type: "repeat",
                            layout: "vertical",
                            items: "#/state/pets",
                            fields: [
                                {
                                    type: "group",
                                    layout: "horizontal",
                                    fields: [
                                        {
                                            type: "text",
                                            style: "width: 8em",
                                            label: "Name",
                                            bind: "#/state/pets[@index]/name"
                                        },
                                        {
                                            type: "text",
                                            label: "#/state/pets[@index]/type breed",
                                            readonly: true,
                                            bind: "#/state/pets[@index]/breed"
                                        },

                                        {
                                            type: "date",
                                            label: "Birthdate",
                                            bind: "#/state/pets[@index]/birthdate"
                                        },
                                        {
                                            type: "button",
                                            label: "⨉",
                                            bind: "#/state/pets[@index]/remove"
                                            
                                            
                                        }
                                    ]
                                }


                            ]
                        }

                    ]
                }
            ]
        }

        const schema2 = {
            submit: false,
            model: {
                rules: {
                    "#/person/birthdate": [
                        {
                            set: "#/state/under18",
                            value: "this.value === null"
                        }
                    ]
                },

                instance: {
                    _xo: {
                        prevDisabled: true,
                        nextDisabled: false
                    },
                    state: {
                        age: -1,
                        under18: false
                    },
                    person: {
                        name: {
                            first: "John",
                            last: "Doe"
                        },
                        birthdate: "",
                        gender: "unknown"
                    },
                    contract: {
                        agree: false
                    }
                }
            },
            pages: [
                {
                    label: "Enter your details",
                    fields: [
                        {
                            type: "group",
                            label: "Name",
                            layout: "horizontal",
                            fields: [
                                {
                                    type: "text",
                                    required: true,
                                    label: "First name",
                                    bind: "#/person/name/first"
                                },
                                {
                                    type: "text",
                                    required: true,
                                    label: "Last name",
                                    bind: "#/person/name/last"
                                }
                            ]
                        },

                        {
                            name: "gender",
                            type: "select",
                            label: "Gender",
                            items: [
                                {
                                    label: "Please choose",
                                    value: "unknown"
                                },
                                {
                                    label: "Male",
                                    value: "male"
                                },
                                {
                                    label: "Female",
                                    value: "female"
                                },
                                {
                                    label: "Not important",
                                    value: "unspecified"
                                }
                            ],
                            bind: "#/person/gender"
                        },
                        {
                            name: "birthdate",
                            type: "date",
                            min: "1921-01-01",
                            max: "2015-01-01",
                            step: 1,
                            label: "Your birthdate",
                            bind: "#/person/birthdate",
                            info: "You have to be over 18 to continue"
                        },
                        {
                            name: "agree",
                            disabled: "#/state/under18",
                            type: "checkboxlist",
                            items: [
                                {
                                    value: "yes",
                                    label: "I have read the terms & conditions and agree to proceed"
                                }
                            ],
                            label: "Agree",
                            tooltip: "Check to continue",
                            bind: "#/contract/agree"
                        }
                    ]
                },
                {
                    legend: "Finalize",
                    relevant: "#/contract/agree",
                    fields: [
                        {
                            type: "button",
                            "class": "exf-lg",
                            label: "Submit",
                            actions: [
                                {
                                    "do": {
                                        alert: [
                                            "Submitted!"
                                        ]
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        };

        this.form.load(schema)
    }

    checkDarkTheme() {

        const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
        if (prefersDarkScheme.matches) {
            document.documentElement.classList.toggle("theme-dark")
        }
    }
}

export default PWA;
