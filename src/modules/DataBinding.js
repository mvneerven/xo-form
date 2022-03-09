import PropertyMapper from "./PropertyMapper";

const equals = (x, y) => {
    if (Array.isArray(x))
        return arrayEquals(x, y);
    if (typeof (x) === "object")
        return Core.objectEquals(x, y)
    return x === y;
}

const arrayEquals = (a, b) => {
    return Array.isArray(a) &&
        Array.isArray(b) &&
        a.length === b.length &&
        a.every((val, index) => val === b[index]);
}

class DataBinding {

    instance = {};
    bound = {};
    hooks = {}

    constructor(context) {
        if (!context)
            throw Error("Missing context")

        const me = this;
        this._context = context;


        eventBus.register("xo-interaction", e => {
            console.log("interaction detected", e)

            if (e.detail.source.bind) {
                console.log("Map back UI update to instance 1", e.detail.source?.bind, e.detail.value)
                me.set(this.processBindingIndex(e.detail.source, e.detail.source.bind), e.detail.value)
            }

            else if (e.detail.control?.bind) {

                console.log("Map back UI update to instance 2", e.detail.control.bind, e.detail.value)
                me.set(this.processBindingIndex(e.detail.control, e.detail.control?.bind), e.detail.value)
            }
        })
    }

    initialize(schemaModel = {}) {
        const me = this;
        const proxify = (instanceName, target, path) => {
            path = path || instanceName;

            return new Proxy(target, {
                get: function (target, key) {
                    if (typeof target[key] === 'object' && target[key] !== null)
                        return proxify(instanceName, target[key], path + "/" + key)
                    else
                        return target[key];
                },
                set: function (target, key, value) {
                    if (equals(target[key], value)) return true;

                    let bindingPath = "#/" + path + "/" + key;

                    console.log("Set", bindingPath, value)

                    target[key] = value;

                    me.applyRules(bindingPath, value); // apply rules on change

                    if (me.bound[bindingPath]) {
                        me.bound[bindingPath].forEach(binding => {
                            let prop = binding.property === "bind" ? "value" : binding.property;
                            let boundPropertyValue = me.context.mapper.replaceVar(binding, prop, value)
                            me.context.mapper.map(binding.control, prop, boundPropertyValue);
                            console.log(`Set property '${prop}' on ${binding.control} to ${value}`)
                        })
                    }

                    eventBus.fire("xo-modelchange", {
                        model: schemaModel
                    })
                    return true;
                }
            })
        }

        schemaModel = {
            instance: {},
            ...schemaModel
        }

        this.addBuiltinModelState(schemaModel);

        // create Proxy for each instance
        Object.entries(schemaModel.instance).forEach(item => {
            const key = item[0];
            this.instance[key] = proxify(key, item[1])
        });

        // set up change hooks & run logic
        Object.entries(schemaModel.rules || {}).forEach(entry => {
            me.hooks[entry[0]] = entry[1];

            let value = me.get(entry[0]);

            if (typeof (value) !== "undefined")
                me.applyRules(entry[0], value)
        });

    }

    addBuiltinModelState(schemaModel) {
        schemaModel.instance["_xo"] = {
            page: 1,
            disabled: {
                back: true,
                next: false,
                send: true
            },
            nav: {
                back: 0,
                next: 0,
                send: 0
            }
        }

    }

    get context() {
        return this._context;
    }

    processBindingIndex(element, value) {
        if (typeof (value) === "string" && value.indexOf("[@index]") !== -1) {
            let scope = this.getParentScope(element);
            if(!scope)
                throw "No scope for @index";

            value = value.replace("[@index]", "/:" + scope.options.index);
        }
        return value;
    }

    getParentScope(element){
        let parent = element.parent;
        while(parent){
            if(!parent)
                break;
            
            if(parent.options?.scope)
                return parent;

            parent = parent.parent;
        }
    }

    processBindings(element, properties) {
        const me = this;

        for (let prop in properties) {

            let value = properties[prop];

            if (prop === "bind") {
                value = this.processBindingIndex(element, value); // process [@index]
                properties["value"] = me.get(value);
            }
            else {
                PropertyMapper.match(value, variable => {
                    const binding = {
                        control: element,
                        rawValue: value,
                        property: prop,
                        binding: variable
                    }

                    this.bound[variable] = this.bound[variable] || []
                    this.bound[variable].push(binding);

                    element.data = element.data ?? {};
                    element.data[prop] = this.processBindingIndex(element, value);

                    let v = me.get(variable);

                    if (typeof (v) !== "undefined") {
                        properties[prop === "bind" ? "value" : prop] = v;
                    }
                });
            }
        }

    }

    /**
     * Evaluates a script in the given scope
     * @param {Object} scope - the 'this' scope for the script to run in
     * @param {String} script - the script to execute
     * @returns The return value of the script, if any
     */
    static scopeEval(scope, script) {
        return Function('"use strict";' + script).bind(scope)();
    }

    applyRules(bindingPath, value) {
        const me = this;

        if (me.hooks[bindingPath]) {
            let ar = me.hooks[bindingPath]
            if (Array.isArray(ar)) {
                ar.forEach(expression => {
                    if (expression.set) {

                        // the 'this' scope for expressions to evaluate 
                        let obj = {
                            value: value,
                            get: name => {
                                let v = me.get(name);
                                return v;
                            },

                        }
                        let result;
                        if (typeof (expression.value) === "function") {
                            result = expression.value(obj);
                        }
                        else {
                            result = DataBinding.scopeEval(obj, "return " + expression.value);
                        }
                        me.set(expression.set, result)
                    }
                })
            }
        }
    }

    parseKey(key) {

        if (key.startsWith(":")) // numeric - array index
            key = parseInt(key.substring(1));

        return key;
    }

    get(path) {
        let pathElements = path.substring(2).split("/");
        let instanceName = pathElements.shift();
        var current = this.instance[instanceName];

        for (var i = 0; i < pathElements.length; i++) {
            let key = this.parseKey(pathElements[i]);
            if (i === pathElements.length - 1) {
                console.log("GET: ", path, current[key]);
                return current[key]
            }
            current = current[key];
        }
    }

    set(path, value) {
        let pathElements = path.substring(2).split("/");
        let instanceName = pathElements.shift();
        var current = this.instance[instanceName];

        for (var i = 0; i < pathElements.length; i++) {
            let key = this.parseKey(pathElements[i]);
            if (i === pathElements.length - 1) {
                current[key] = value;
                break;
            }
            current = current[key];
        }
    }
}

export default DataBinding;