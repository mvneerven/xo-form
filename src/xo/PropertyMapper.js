import builtinMixins from "./Mixins.json";
import Util from "./Util";

const RESERVED_PROPERTIES = ["type", "label", "bind", "classes"];

let ctlNr = 1000;
const getUniqueName = () => {
  return `xo${(ctlNr++).toString(16)}`;
};
const propMappings = {};

/**
 * Property Mapper
 */
class PropertyMapper {
  static _mixins = {
    ...builtinMixins
  };

  constructor(element) {
    this._element = element;
  }

  static get mixins() {
    return this._mixins;
  }

  get element() {
    return this._element;
  }

  mapProperties(element, properties, value) {
    const nested = element.nested;
    let isInitialState = true;

    if (typeof properties === "string") {
      // single prop passed
      let prop = properties;
      properties = {};
      properties[prop] = value;
      isInitialState = false;
    } else {
      if (element.beforeMap) {
        element.beforeMap();
      }
    }

    if (properties.mixin) this.applyMixins(properties);

    if (!properties.id) properties.id = getUniqueName();
    if (!properties.name) properties.name = properties.id;

    for (let prop in properties) {
      if (prop === "type") continue;

      let value = this.getCurrentValue(element, properties, prop);

      if (!["id"].includes(prop)) element[prop] = value;

      if (["style", "title", "id"].includes(prop)) {
        element[prop] = value ?? "";
      } else if (nested) {
        if (PropertyMapper.elementSupportsProperty(nested, prop)) {
          nested[prop] = value ?? "";
        } else {
          if (PropertyMapper.isReservedProperty(prop)) continue;

          let hyphenAttrName = PropertyMapper.camelCaseToHyphen(prop);

          if (typeof value !== "object") {
            if (
              PropertyMapper.elementSupportsAttribute(nested, hyphenAttrName)
            ) {
              nested.setAttribute(hyphenAttrName, value);
            } else {
              hyphenAttrName = hyphenAttrName.startsWith("data-")
                ? hyphenAttrName
                : "data-" + hyphenAttrName;

              nested.setAttribute(hyphenAttrName, value);
            }
          }
        }
      }
    }

    if (nested instanceof HTMLSelectElement) {
      PropertyMapper.importItems(nested, properties.items);
    } else if (
      nested instanceof HTMLButtonElement ||
      nested instanceof HTMLAnchorElement
    ) {
      if (typeof properties.label !== "undefined")
        nested.innerText = properties.label;

      const getParent = (elem, f) => {
        let m = elem;
        if (m.nodeType === 11) m = m.host;
        else m = m.parentNode;

        if (!m) return;

        if (f(m)) return m;

        return getParent(m, f);
      };

      if (properties.click) {
        nested.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();

          let node = e.path[0];

          let repeat = getParent(node, (x) => {
            return x.nodeName === "XO-REPEAT";
          });
          let index = -1;
          if (repeat) {
            [...repeat.childNodes].forEach((x) => {
              if (index === -1) {
                getParent(node, (x) => {
                  let ix = x.getAttribute ? x.getAttribute("data-index") : null;
                  if (ix) {
                    index = parseInt(ix) - 1;
                  }
                });
              }
            });
          }

          let event = {
            target: e.target,
            path: e.path,
            detail: {
              repeat: repeat,
              index: index
            }
          };

          properties.click(event);
        });
      }
    }
  }

  applyMixins(properties) {
    if (!Array.isArray(properties.mixin)) properties.mixin = [properties.mixin];

    for (const mixin of properties.mixin) {
      if (typeof mixin !== "string" || mixin.indexOf("/") <= 0)
        console.warn("Invalid mixin syntax: ", mixin);

      this.applyMixin(properties, mixin);
      console.debug("Mixin applied: ", mixin, properties);
    }
    delete properties.mixin;
  }

  applyMixin(properties, mixin) {
    const props = Util.getValue(PropertyMapper.mixins, "#/" + mixin);
    if (typeof props === "object") {
      Object.entries(props).forEach((entry) => {
        properties[entry[0]] = entry[1];
      });
    } else {
      console.warn("Mixin not found: ", mixin);
    }
  }

  getCurrentValue(element, properties, prop) {
    if (prop === "bind") return properties[prop];

    let value = properties[prop];
    if (typeof value === "string" && value.indexOf("#/") !== -1) {
      value = this.element.getData(value);

      return value;
    }

    return properties[prop];
  }

  static isReservedProperty(name) {
    return RESERVED_PROPERTIES.includes(name);
  }

  static isExpression(value) {
    return typeof value === "string" && value.startsWith("#/");
  }

  static importItems(select, items = []) {
    for (let item of items) {
      let option = document.createElement("option");
      option.value = item.value || item;
      option.innerText = item.label || item;
      select.appendChild(option);
    }
  }

  // Convert 'actionHandler' to 'action-handler'
  static camelCaseToHyphen(camelCase) {
    return camelCase.replace(/[A-Z]/g, (x) => {
      return "-" + x.toLowerCase();
    });
  }

  static elementSupportsAttribute(element, attribute) {
    var test = document.createElement(element.nodeName.toLowerCase());
    return (
      (attribute in test && typeof test[attribute] !== "function") ||
      ["role", "readonly", "maxlength"].includes(attribute) ||
      attribute.startsWith("aria-")
    );
  }

  static elementSupportsProperty(element, propName) {
    let type = element.nodeName.toLowerCase();

    if (!propMappings[type]) {
      propMappings[type] = [];
      propMappings[type] = Object.getOwnPropertyNames(
        Object.getPrototypeOf(element)
      );
      propMappings[type] = [
        ...propMappings[type],
        ...Object.getOwnPropertyNames(HTMLElement.prototype)
      ];
      propMappings[type] = [...new Set(propMappings[type])];
    }

    return propMappings[type].includes(propName);
  }
}

export default PropertyMapper;
