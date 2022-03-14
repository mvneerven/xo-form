import breeds from '../../data/pet-breeds.json';

const breedAutocomplete = options => {
    let search = options.search.toLowerCase();
    return breedData.filter(i => {
        return i.name.toLowerCase().indexOf(search) >= 0;
    }).map(x => {
        return {
            text: x.name
        }
    })
};

export const managePets = {
    model: {
        instance: {

            state: {
                type: "Cat",
                profileimg: [],

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
            ]

        }
    },
    pages: [
        {
            label: "Page 1",

            fields: [
                {
                    type: "filedrop",
                    label: "Profile Image",
                    bind: "#/state/profileimg",
                    height: "100px"
                },
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
                            type: "search",
                            bind: "#/state/breed",

                            autocomplete: {
                                items: breedAutocomplete
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
                                    type: "search",
                                    label: "#/state/pets[@index]/type breed",
                                    readonly: true,
                                    bind: "#/state/pets[@index]/breed",
                                    autocomplete: {
                                        items: breedAutocomplete
                                    },
                                },

                                {
                                    type: "date",
                                    label: "Birthdate",
                                    bind: "#/state/pets[@index]/birthdate"
                                },
                                {
                                    type: "button",
                                    label: "⨉",
                                    click: e => {
                                        const repeat = e.detail.repeat;
                                        if (repeat) {
                                            const data = repeat.context.data,
                                                ar = data.get("#/state/pets");
                                            ar.splice(e.detail.index, 1);
                                            data.set("#/state/pets", ar)
                                        }
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
}
