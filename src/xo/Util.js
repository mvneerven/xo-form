/**
 * Util Class - contains static helper methods
 */
class Util {
  /**
   * Checks whether the fiven string is a valid URL.
   * @param {String} txt - the string to evaluate
   * @returns Boolean indeicating whether the string is a URL.
   */
  static isUrl(txt) {
    try {
      if (typeof txt !== "string") return false;
      if (txt.indexOf("\n") !== -1 || txt.indexOf(" ") !== -1) return false;
      if (txt.startsWith("#/")) return false;
      new URL(txt, window.location.origin);
      return true;
    } catch {}
    return false;
  }

  /**
   * Generates an Html Element from the given HTML string
   * @param {String} html
   * @returns {HTMLElement} DOM element
   */
  static parseHTML(html) {
    return new DOMParser().parseFromString(html, "text/html").body.firstChild;
  }

  static objectEquals(x, y) {
    if (x === null || x === undefined || y === null || y === undefined) {
      return x === y;
    }
    // after this just checking type of one would be enough
    if (x.constructor !== y.constructor) {
      return false;
    }
    // if they are functions, they should exactly refer to same one (because of closures)
    if (x instanceof Function) {
      return x === y;
    }
    // if they are regexps, they should exactly refer to same one (it is hard to better equality check on current ES)
    if (x instanceof RegExp) {
      return x === y;
    }
    if (x === y || x.valueOf() === y.valueOf()) {
      return true;
    }
    if (Array.isArray(x) && x.length !== y.length) {
      return false;
    }

    // if they are dates, they must had equal valueOf
    if (x instanceof Date) {
      return false;
    }

    // if they are strictly equal, they both need to be object at least
    if (!(x instanceof Object)) {
      return false;
    }
    if (!(y instanceof Object)) {
      return false;
    }

    // recursive object equality check
    var p = Object.keys(x);
    return (
      Object.keys(y).every(function (i) {
        return p.indexOf(i) !== -1;
      }) &&
      p.every(function (i) {
        return Util.objectEquals(x[i], y[i]);
      })
    );
  }

  static equals(x, y) {
    if (Array.isArray(x)) return Util.arrayEquals(x, y);
    if (typeof x === "object") return Util.objectEquals(x, y);
    return x === y;
  }

  static arrayEquals(a, b) {
    return (
      Array.isArray(a) &&
      Array.isArray(b) &&
      a.length === b.length &&
      a.every((val, index) => val === b[index])
    );
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

  static addStyleSheet(src, attr) {
    var d = document;
    if (d.querySelector("head > link[rel=stylesheet][href='" + src + "']"))
      return;

    let e = d.createElement("link");
    e.rel = "stylesheet";
    e.href = src;
    if (attr) {
      for (var a in attr) {
        e.setAttribute(a, attr[a]);
      }
    }
    d.head.appendChild(e);
  }

  /**
   * Returns a random GUID
   * @returns string (36 characters)
   */
  static guid(options) {
    options = { ...(options || {}) };
    let g = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        var r = (Math.random() * 16) | 0,
          v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
    return `${options.prefix || ""}${options.compact ? g.split("-").pop() : g}`;
  }

  static async requireJS(src) {
    return new Promise((resolve) => {
      let headElement = document.querySelector(`[src="${src}"]`);
      if (!headElement) {
        let script = document.createElement("script");
        script.src = src;
        script.onload = (e) => {
          resolve();
        };
        document.querySelector("head").appendChild(script);
      } else {
        resolve();
      }
    });
  }

  static async waitFor(
    evaluator = () => {
      return true;
    }
  ) {
    return new Promise((resolve) => {
      let tmr,
        evualationResult = null;
      tmr = setInterval((e) => {
        try {
          if ((evualationResult = evaluator())) {
            clearInterval(tmr);
            resolve(evualationResult);
          }
        } catch {}
      }, 50);
    });
  }

  static toWords(text) {
    var result = text.replace(/([A-Z])/g, " $1");
    return result.charAt(0).toUpperCase() + result.slice(1);
  }

  /**
   * Does JS code stringification comparable to JSON.stringify()
   * @param {Object} jsLiteral - the JavaScript literal to stringify
   * @param {Function} replacer
   * @param {Number} indent
   * @returns String
   */
  static stringifyJs(jsLiteral, replacer, indent) {
    const sfy = (o, replacer, indent, level) => {
      let type = typeof o,
        tpl,
        tab = (lvl) => " ".repeat(indent * lvl);

      if (o === null) {
        return "null";
      } else if (o === undefined) {
        return "undefined";
      } else if (type === "function") {
        return o.toString();
      }

      if (type !== "object") {
        return JSON.stringify(o, replacer);
      } else if (Array.isArray(o)) {
        let s = "[\n";

        let ar = [];
        level++;
        s += tab(level);

        o.forEach((i) => {
          ar.push(sfy(i, replacer, indent, level));
        });

        s += ar.join(",\n" + tab(level));
        level--;
        s += "\n" + tab(level) + "]";
        return s;
      }

      let result = "";
      level++;
      result += "{\n" + tab(level);
      let props = Object.keys(o)
        .filter((key) => {
          return !key.startsWith("_");
        })
        .map((key) => {
          return `${Util.quoteKeyIfNeeded(key)}: ${sfy(
            o[key],
            replacer,
            indent,
            level
          )}`;
        })

        .join(",\n" + tab(level));

      result += props + "\n";
      level--;
      result += tab(level) + "}";

      return result;
    };

    let level = 0;
    return sfy(jsLiteral, replacer, indent, level);
  }

  /**
   * Returns appropriate use of the given key for identifiers
   * @param {*} key
   * @returns The adequately quoted or non-quoted identifier name
   */
  static quoteKeyIfNeeded(key) {
    return Util.isValidVarName(key) ? key : `"${key}"`;
  }

  /**
   * Returns true if the given name is valid as variable name
   * @param {*} name
   * @returns Boolean value indicating whether the given name is a valid variable name
   */
  static isValidVarName(name) {
    try {
      Function("var " + name);
    } catch (e) {
      return false;
    }
    return true;
  }
}

export default Util;
