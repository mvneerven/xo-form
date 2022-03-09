import AutoComplete from "./AutoComplete";

let ctlNr = 1000;
const getUniqueName = () => {
    return `xo${(ctlNr++).toString(16)}`;
}
const propMappings = {}

class PropertyMapper {

    constructor(context) {
        this._context = context;
    }

    get context() {
        return this._context;
    }

    map(element, properties, value) {
        const nested = element.nestedElement;
        let isInitialState = true;

        if (typeof (properties) === "string") { // single prop passed
            let prop = properties;
            properties = {};
            properties[prop] = value;
            isInitialState = false;
        }

        if (!properties.name)
            properties.name = getUniqueName();


        if (isInitialState) { // first distill all bindings to manage
            this.context.data.processBindings(element, properties)
        }


        for (let prop in properties) {
            if (prop === "type") continue;

            let value = this.getCurrentValue(element, properties, prop)
            
            element[prop] = value;

            let hyphenAttrName = PropertyMapper.camelCaseToHyphen(prop);

            if (nested) {
                if (PropertyMapper.elementSupportsProperty(nested, prop)) {
                    nested[prop] = value ?? ""
                }
                else {
                    if (PropertyMapper.isReservedProperty(prop))
                        continue;

                    if (PropertyMapper.elementSupportsAttribute(nested, hyphenAttrName)) {
                        nested.setAttribute(hyphenAttrName, value);
                    }
                    else {
                        nested.setAttribute("data-" + hyphenAttrName, value);
                    }

                }
            }
        }


        // if (nested instanceof HTMLInputElement) {
        //     PropertyMapper.tryAutoComplete(element, properties.autocomplete );
        // }

        if (nested instanceof HTMLSelectElement) {
            PropertyMapper.importItems(nested, properties.items );
        }
        else if (nested instanceof HTMLButtonElement) {
            if(typeof(properties.label) !== "undefined")    
                nested.innerText = properties.label;
            
            nested.addEventListener("click", properties.click)
        }
    }

    getCurrentValue(element, properties, prop) {
        if (["type", "bind"].includes(prop))
            return properties[prop]

        let varRes, i=0;
        if (element.data && element.data[prop]) {
            let result = PropertyMapper.match(element.data[prop], variable => {
                i++;
                varRes = this.context.data.get(variable)
                return varRes;
            });
            if(i===1 && typeof(varRes) !== "undefined" ){
                return varRes;
            }
            return result;
            
        }
        return properties[prop]
    }

    static isReservedProperty(name) {
        return ["type", "label"].includes(name);
    }

    static match(s, callback) {
        if (typeof (s) !== "string" || s.length < 5) // #/a/b
            return s;

        return s.replace(/(#\/[A-Za-z_]+[A-Za-z_0-9:/]*[A-Za-z_:]+[A-Za-z_0-9]*)(?=[\s+/*,.?!;)]|$)/gm,
            (match, token) => {
                return callback(token);
            })
    }

    replaceVar(binding, prop, value) {
        let varRes, i=0, result = PropertyMapper.match(binding.rawValue, variable => {
            i++;
            
            varRes =  value;
            return varRes;
            
        });
        if(i===1 && typeof(varRes) !== "undefined" ){            
            return varRes;
        }                    
        return  result;
    }

    static importItems(select, items = []) {
        for (let item of items) {
            let option = document.createElement("option");
            option.value = item.value || item
            option.innerText = item.label || item
            select.appendChild(option)
        }
    }

    tryAutoComplete(input, autoComplete){
        if(autoComplete && autoComplete.items ){
            let ac = new AutoComplete(input, autoComplete);
            ac.attach(input);
        }
    }

    // Convert 'actionHandler' to 'action-handler'
    static camelCaseToHyphen(camelCase) {
        return camelCase.replace(/[A-Z]/g, x => {
            return "-" + x.toLowerCase();
        })
    }

    static elementSupportsAttribute(element, attribute) {
        var test = document.createElement(element.nodeName.toLowerCase());
        return (attribute in test) || ["role"].includes(attribute) || attribute.startsWith("aria-");
    };

    static elementSupportsProperty(element, propName) {
        let type = element.nodeName.toLowerCase();

        if (!propMappings[type]) {
            propMappings[type] = [];
            propMappings[type] = Object.getOwnPropertyNames(Object.getPrototypeOf(element));
            propMappings[type] = [...propMappings[type], ...Object.getOwnPropertyNames(HTMLElement.prototype)];
            propMappings[type] = [...new Set(propMappings[type])]
        }

        return propMappings[type].includes(propName)
    };

}

export default PropertyMapper