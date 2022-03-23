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
    let parser = new DOMParser(),
      doc = parser.parseFromString(html, "text/html");
    return doc.body.firstChild;
  }

  /**
   * Throttles fast-repeating events
   * @param {Function} listener 
   * @param {Number} delay 
   * @returns 
   */
  static throttle(listener, delay = 500) {
    var timeout;
    var throttledListener = function (e) {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(listener, delay, e);
    };
    return throttledListener;
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
}

export default Util;
