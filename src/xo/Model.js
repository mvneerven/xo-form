import Util from "./Util";
const APPLY_RULE_MODES = {
  Set: 1,
  Run: 2
};
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

  get path() {
    return this._options.path;
  }

  get expression() {
    return this._options.expression;
  }
}

/**
 * Model
 */
class Model {
  _instance = {};
  revocableProxies = {};
  _stack = {};
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
          if (Util.isObject(target[key])) {
            let proxyPath = path + "/" + key;
            const revocable = proxify(instanceName, target[key], proxyPath);

            me.revocableProxies[proxyPath] = revocable;

            return revocable.proxy;
          }
          return target[key];
        },
        set: function (target, key, value) {
          const bindingPath = "#/" + path + "/" + key,
            oldValue = target[key];

          if (isIrelevantChange(target[key], value)) return true;

          if (me.stack(bindingPath) > 5) return true;
          let matchPattern = bindingPath.replace(/[\/]\d{1,}/gm, "/*");
        
          let newValue = me.applyRules(
            matchPattern,
            bindingPath,
            value,
            APPLY_RULE_MODES.Set
          ); // apply 'set' rules
          if (newValue !== oldValue) {
            value = newValue;
          }

          if (typeof value !== "undefined") {
            me.stack(bindingPath, +1);

            try {
              if (oldValue !== value) target[key] = value;
            } finally {
              me.stack(bindingPath, -1);
            }

            console.debug("Model change: ", bindingPath, value);

            me.checkBindings(matchPattern, value);

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
          }

          setTimeout(() => {
            me.applyRules(
              matchPattern,
              bindingPath,
              value,
              APPLY_RULE_MODES.Run
            ); // apply 'run' rules
          }, 1);

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
      this.revocableProxies["#/" + key] = revocable;
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

  checkBindings(matchPattern, value) {
    const me = this;

    if (me.bound[matchPattern]) {
      me.bound[matchPattern].forEach((binding) => {
        if (binding.partial) {
          //debugger;
        }
        let prop = binding.property === "bind" ? "value" : binding.property;

        let boundPropertyValue = Model.replaceVar(binding, prop, value);
        binding.control.map(prop, boundPropertyValue);

        console.debug(`Set property '${prop}' on ${binding.control} to`, value);
      });
    }
  }

  stack(path, level) {
    if (typeof level !== "undefined")
      this._stack[path] = (this._stack[path] ?? 0) + level;

    return this._stack[path] ?? 0;
  }

  applyRules(
    bindingExpression,
    bindingPath,
    value,
    mode = APPLY_RULE_MODES.unknown
  ) {
    const me = this;
    if (Array.isArray(me.rules[bindingExpression])) {
      let ar = me.rules[bindingExpression];
      ar.forEach((expression) => {
        const context = new DataBindingContext({
          data: me,
          path: bindingPath,
          form: me.form,
          value: value,
          binding: bindingExpression
        });

        let newValue = me.executeRule(expression, context, value, mode);
        if (typeof newValue !== "undefined") {
          if (expression.set && expression.set !== bindingExpression) {
            // Set value if expression points to different value
            me.set(expression.set, newValue);
            value === undefined;
          } else {
            value = newValue;
          }
        }
      });
    }

    return value;
  }

  executeRule(expression, context, value, mode = APPLY_RULE_MODES.unknown) {
    const me = this;
    let result;
    if (mode === APPLY_RULE_MODES.Run && expression.run) {
      if (typeof expression.run === "function") expression.run(context);
      else Util.scopeEval(context, "return " + expression.run);
    } else if (mode === APPLY_RULE_MODES.Set) {
      if (typeof expression.value === "function") {
        result = expression.value(context);
      } else {
        result = Util.scopeEval(context, "return " + expression.value);
      }
    }
    return result;
  }

  dispose() {
    if (this.instance && this.revocableProxies) {
      Object.keys(this.revocableProxies).forEach((item) => {
        this.revocableProxies[item].revoke();
      });
    }
    this.revocableProxies = {};
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

  /**
   * Process binding expressions
   * @param {HTMLElement} element
   * @param {Object} properties
   */
  processBindings(element, properties) {
    for (let prop in properties) {
      let value = properties[prop];

      const test = Model.testForExpressions(value); // check for expressions

      if (test.expressions.length > 0) {
        // expressions found
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

    this.stack(path, +1);

    try {
      Util.setValue(this.instance, path, value);
    } finally {
      this.stack(path, -1);
    }
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
