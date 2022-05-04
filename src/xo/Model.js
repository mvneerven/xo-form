import Util from "./Util";
const DATABINDING_EXPRESSION =
  /(#\/[A-Za-z_.]+[A-Za-z_0-9\/@]*[A-Za-z_]+[A-Za-z_0-9]*)(?=[\s+\/*,.?!;'")]|$)/gm;
const REGEX_DATABINDING_EXPRESSION = new RegExp(DATABINDING_EXPRESSION);

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
 * Databinding Context
 */
class DataBindingContext {
  _options = null;

  constructor(options) {
    this._options = options;
  }

  get value() {
    return this._options.value;
  }

  get data() {
    return this._options.data;
  }

  get form() {
    return this._options.form;
  }

  get binding() {
    return this._options.binding;
  }
}

/**
 * Model
 */
class Model {
  _instance = {};
  revocables = [];
  bound = {};
  rules = {};

  constructor(form, schemaModel = {}, options = {}) {
    const me = this;
    this._form = form;
    this._instance = schemaModel.instance;
    this.options = options;

    const proxify = (instanceName, target, path) => {
      path = path || instanceName;

      return Proxy.revocable(target, {
        get: function (target, key) {
          if (
            ["[object Object]", "[object Array]"].indexOf(
              Object.prototype.toString.call(target[key])
            ) > -1
          ) {
            const revocable = proxify(
              instanceName,
              target[key],
              path + "/" + key
            );
            me.revocables.push(revocable);
            return revocable.proxy;
          }
          return target[key];
        },
        set: function (target, key, value) {
          if (isIrelevantChange(target[key], value)) return true;

          let bindingPath = "#/" + path + "/" + key;

          const oldValue = target[key];

          target[key] = value;

          console.debug("Model change: ", bindingPath, value);

          value = me.applyRules(bindingPath, value); // apply rules on change

          let matchPattern = bindingPath; // me.matchArrays(bindingPath);

          
          if (me.bound[matchPattern]) {
            console.log("Found matching binding", me.bound[matchPattern]);

            me.bound[matchPattern].forEach((binding) => {
              if (binding.partial) {
                //debugger;
              }
              let prop =
                binding.property === "bind" ? "value" : binding.property;

              let boundPropertyValue = Model.replaceVar(binding, prop, value);
              binding.control.map(prop, boundPropertyValue);

              console.debug(
                `Set property '${prop}' on ${binding.control} to`,
                value
              );
            });
          }

          //TODO: JSON Patch - https://github.com/Palindrom/JSONPatcherProxy

          try {
            me.form.emit("modelchange", {
              model: me._instance,
              change: bindingPath,
              oldValue: oldValue,
              newValue: value,
              context: me.originatingEventContext
            });
          } finally {
            me.originatingEventContext = null;
          }

          return true;
        }
      });
    };

    me.schemaModel = {
      instance: {},
      ...schemaModel
    };

    this.addBuiltinModelState();

    // create Proxy for each instance
    Object.entries(me.schemaModel.instance).forEach((item) => {
      const key = item[0];
      const revocable = proxify(key, item[1]);
      this.revocables.push(revocable);
      this.instance[key] = revocable.proxy;
    });

    // set up change rules & run logic
    Object.entries(me.schemaModel.rules || {}).forEach((entry) => {
      let key = entry[0];

      me.rules[key] = entry[1];

      try {
        let value = me.get(key);

        if (typeof value !== "undefined") me.applyRules(key, value);
      } catch {}
    });

    setTimeout(() => {
      this.form.emit("modelchange", {
        model: me.schemaModel.instance,
        initial: true,
        change: undefined
      });
    }, 1);
  }

  applyRules(path, value) {
    const me = this;

    if (me.rules[path]) {
      let ar = me.rules[path];

      if (Array.isArray(ar)) {
        ar.forEach((expression) => {
          expression.set = expression.set ?? path;
          const context = new DataBindingContext({
            data: me,
            form: me.form,
            value: value,
            //path: path,
            binding: path
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
              if (expression.set === path) value = result;
            }
          }
        });
      }
    }

    return value;
  }

  dispose() {
    if (this.instance && this.revocables) {
      this.revocables.forEach((item) => {
        item.revoke();
      });
    }
    this.revocables.length = 0;
  }

  get form() {
    return this._form;
  }

  get instance() {
    return this._instance;
  }

  addBuiltinModelState() {
    this._instance._xo = {
      disabled: {
        back: true,
        next: false,
        send: true
      },
      nav: {
        page: 1,
        total: this._form.schema.pages.length // this.options.pageCount
      }
    };
  }

  processBindings(element, properties) {
    
    //const litProps = element.constructor.properties;

    for (let prop in properties) {
      let value = properties[prop];
      // first, check for expressions
      const test = Model.testForExpressions(value);

      if (test.expressions.length > 0) { // expressions found
        if (test.expressions.length === 1 && !test.isEmbedded) {
          // the whole property value is an expression
          this.addBinding({
            control: element,
            rawValue: value,
            property: prop,
            binding: value
          });
        } else {
          // there are multiple expressions in the property value
          const result = Model.replaceExpressions(value, (variable) => {
            this.addBinding({
              partial: test,
              control: element,
              rawValue: value,
              property: prop,
              binding: variable
            });
            return element.getData(variable);
          });
        }
      }
    }
  }

  addBinding(options) {
    const boundPath = options.binding;
    options.model = this;
    this.bound[boundPath] = this.bound[boundPath] || [];

    if (
      this.bound[boundPath].findIndex((i) => {
        return i.control === options.control && i.property === options.property;
      }) === -1
    ) {
      this.bound[boundPath].push(options);
    }
  }

  static testForExpressions(value) {
    const result = {
      expressions: [],
      isEmbedded: false
    };
    if (typeof value === "string") {
      let resulting = value.replace(
        REGEX_DATABINDING_EXPRESSION,

        (match, token, r) => {
          result.expressions.push(token);
          return "";
        }
      );
      if (result.expressions.length > 0) {
        result.isEmbedded = resulting.length > 0;
      }
    }

    return result;
  }

  static replaceExpressions(s, callback) {
    const origString = s;
    if (typeof s !== "string" || s.length < 5) {
      // minimum variable length: #/a/b
      return s;
    }

    return s.replace(
      REGEX_DATABINDING_EXPRESSION,

      (match, token, r) => {
        return callback(token, origString);
      }
    );
  }

  static replaceVar(binding, prop, value) {
    const me = this;
    let combinedString = false;
    let varRes,
      result = this.replaceExpressions(
        binding.rawValue,
        (variable, origString) => {
          if (origString !== variable) combinedString = true;

          varRes = binding.control.getData(variable); // value;
          return varRes;
        }
      );

    if (!combinedString) {
      return varRes;
    }
    return result;
  }

  get(path) {
    return Util.getValue(this.instance, path);
  }

  set(path, value, originatingEventContext) {
    this.originatingEventContext = Model.createDataBindingOriginContext(
      originatingEventContext
    );

    Util.setValue(this.instance, path, value);
  }

  static createDataBindingOriginContext(originatingEventContext) {
    if (!originatingEventContext) return;
    return {
      eventType: originatingEventContext.type,
      sourceControl: originatingEventContext.control,
      eventSourceElement: originatingEventContext.source,
      controlValue: originatingEventContext.value,
      guid: originatingEventContext.guid
    };
  }
}

export default Model;
