import PropertyMapper from "./PropertyMapper";
import Util from "./Util";
import DataBindingContext from "./DataBindingContext";

const isIrelevantChange = (oldValue, newValue) => {
  if (Util.equals(oldValue, newValue)) {
    if (Array.isArray(oldValue) && newValue.length === 0) {
      return false;
    } else {
      return true;
    }
  }
};

/**
 * XO DataBinding - Manages dual-databinding within the form
 */
class DataBinding {
  instance = {};
  bound = {};
  rules = {};

  constructor(context) {
    if (!context) throw Error("Missing context");

    const me = this;
    this._context = context;

    this.context.form.on("interaction", (e) => {
      console.debug("interaction", e);

      if (e.detail.control?.bind) {
        const path = this.processBindingIndex(
          e.detail.control,
          e.detail.control?.bind
        );

        me.set(path, e.detail.value, e.detail);
      }
    });
  }

  initialize(schemaModel = {}, options = {}) {
    const me = this;
    this.options = options;

    const proxify = (instanceName, target, path) => {
      path = path || instanceName;

      return new Proxy(target, {
        get: function (target, key) {
          if (
            ["[object Object]", "[object Array]"].indexOf(
              Object.prototype.toString.call(target[key])
            ) > -1
          ) {
            return proxify(instanceName, target[key], path + "/" + key);
          }
          return target[key];
        },
        set: function (target, key, value) {
          if (isIrelevantChange(target[key], value)) return true;

          let bindingPath = "#/" + path + "/" + key;

          const oldValue = target[key];

          target[key] = value;

          value = me.applyRules(bindingPath, value); // apply rules on change

          let matchPattern = me.matchArrays(bindingPath);

          if (me.bound[matchPattern]) {
            me.bound[matchPattern].forEach((binding) => {
              let prop =
                binding.property === "bind" ? "value" : binding.property;

              let boundPropertyValue = me.context.mapper.replaceVar(
                binding,
                prop,
                value
              );
              me.context.mapper.mapProperties(
                binding.control,
                prop,
                boundPropertyValue
              );

              console.debug(
                `Set property '${prop}' on ${binding.control} to`,
                value
              );
            });
          }

//TODO: JSON Patch - https://github.com/Palindrom/JSONPatcherProxy

          try {
            me.context.form.emit("modelchange", {
              model: schemaModel,
              change: bindingPath,
              oldValue: oldValue,
              newValue: value,
              context: me.originatingEventContext,
            });
          } finally {
            me.originatingEventContext = null;
          }

          return true;
        },
      });
    };

    me.schemaModel = {
      instance: {},
      ...schemaModel,
    };

    this.addBuiltinModelState();

    // create Proxy for each instance
    Object.entries(me.schemaModel.instance).forEach((item) => {
      const key = item[0];
      this.instance[key] = proxify(key, item[1]);
    });

    // set up change rules & run logic
    Object.entries(me.schemaModel.rules || {}).forEach((entry) => {
      let key = entry[0];

      me.rules[key] = entry[1];

      try {
        key = this.processBindingIndex(null, key); // process @index
        let value = me.get(key);

        if (typeof value !== "undefined") me.applyRules(key, value);
      } catch {}
    });

    setTimeout(() => {
      this.context.form.emit("modelchange", {
        model: me.schemaModel,
        initial: true,
        change: undefined,
      });
    }, 1);
  }

  addBuiltinModelState() {
    this.schemaModel.instance["_xo"] = {
      disabled: {
        back: true,
        next: false,
        send: true,
      },
      nav: {
        page: 1,
        total: this.options.pageCount,
        back: 0,
        next: 0,
        send: 0,
      },
    };
  }

  /**
   * @returns Context
   */
  get context() {
    return this._context;
  }

  processBindingIndex(element, value) {
    if (typeof value === "string" && value.indexOf("@index") !== -1) {
      let scope = this.getParentScope(element);
      if (!scope) throw "No scope for @index";

      value = value.replace("@index", scope.options.index);
    }
    return value;
  }

  getParentScope(element) {
    let parent = element?.parent;
    while (parent) {
      if (!parent) break;

      if (parent.options?.scope) return parent;

      parent = parent.parent;
    }
  }

  processBindings(element, properties) {
    const me = this;

    for (let prop in properties) {
      let value = properties[prop];

      if (prop === "bind") {
        let orig = value;
        value = this.processBindingIndex(element, value); // process @index
        properties["value"] = me.get(value);

        this.addBinding({
          control: element,
          rawValue: orig,
          property: prop,
          binding: orig,
        });
      } else {
        PropertyMapper.match(value, (variable) => {
          this.addBinding({
            control: element,
            rawValue: value,
            property: prop,
            binding: variable,
          });

          variable = this.processBindingIndex(element, variable);

          let v = me.get(variable);

          if (typeof v !== "undefined") {
            properties[prop === "bind" ? "value" : prop] = v;
          }
        });
      }
    }
  }

  addBinding(options) {
    const boundPath = this.matchArrays(options.binding);
    this.bound[boundPath] = this.bound[boundPath] || [];

    if (
      this.bound[boundPath].findIndex((i) => {
        return i.control === options.control;
      }) === -1
    ) {
      this.bound[boundPath].push(options);
    }
  }

  applyRules(bindingPath, value) {
    const me = this,
      path = this.matchArrays(bindingPath);

    if (me.rules[path]) {
      let ar = me.rules[path];

      if (Array.isArray(ar)) {
        ar.forEach((expression) => {
          expression.set = expression.set ?? bindingPath;

          const context = new DataBindingContext({
            data: me,
            form: me.form,
            value: value,
            path: path,
            binding: bindingPath,
          });

          if (expression.run) {
            if (typeof expression.run === "function") expression.run(context);
            else Util.scopeEval(context, "return " + expression.run);
          } else if (expression.set) {
            let result;
            if (typeof expression.value === "function") {
              result = expression.value(context);
            } else {
              result = Util.scopeEval(context, "return " + expression.value);
            }
            if (typeof result !== "undefined") {
              me.set(expression.set, result);
              if (expression.set === bindingPath) value = result;
            }
          }
        });
      }
    }

    return value;
  }

  matchArrays(s) {
    let m = s.split("/");
    s = "";
    let count = m.length,
      index = 0;
    m.forEach((e) => {
      index++;
      if (!isNaN(parseInt(e))) {
        s += "*";
      } else {
        s += e;
      }
      if (index < count) s += "/";
    });

    return s;
  }

  parseKey(key) {
    let number = parseInt(key); // numeric - array index
    if (!isNaN(number)) return number;
    return key;
  }

  get(path) {
    if (path.indexOf("*") !== -1 || path.indexOf("@index") !== -1)
      throw Error("Invalid binding path: " + path);

    let pathElements = path.substring(2).split("/");
    let instanceName = pathElements.shift();
    var current = this.instance[instanceName];
    if (!current) return undefined;

    for (var i = 0; i < pathElements.length; i++) {
      let key = this.parseKey(pathElements[i]);
      if (i === pathElements.length - 1) {
        if (typeof key === "number") console.log("GET: ", path, current[key]);
        return current[key];
      }
      current = current[key];
    }
  }

  set(path, value, originatingEventContext) {
    let pathElements = path.substring(2).split("/");
    let instanceName = pathElements.shift();
    var current = this.instance[instanceName];
    if (!current) return undefined;

    for (var i = 0; i < pathElements.length; i++) {
      let key = this.parseKey(pathElements[i]);
      if (i === pathElements.length - 1) {
        this.originatingEventContext = this.createDataBindingOriginContext(
          originatingEventContext
        );
        current[key] = value;
        break;
      }
      current = current[key];
    }
  }

  createDataBindingOriginContext(originatingEventContext) {
    if (!originatingEventContext) return;
    return {
      eventType: originatingEventContext.type,
      sourceControl: originatingEventContext.control,
      eventSourceElement: originatingEventContext.source,
      controlValue: originatingEventContext.value,
      guid: originatingEventContext.guid,
    };
  }
}

export default DataBinding;
