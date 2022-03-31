class Util {
  static require(src, c) {
    var d = document;
    let elm = d.head.querySelector(`script[src="${src}"]`);
    if (elm) {
      let loadState = elm.getAttribute("data-exf-rl");
      if (loadState) {
        if (loadState === "1") {
          elm.addEventListener("load", (ev) => {
            ev.target.setAttribute("data-exf-rl", "2");
            if (typeof c === "function") {
              c();
            }
          });
        } else if (loadState === "2" && typeof c === "function") {
          c();
        }
        return;
      }
    }

    return new Promise((resolve, reject) => {
      const check = () => {
        if (typeof c === "function") {
          c();
        }
        resolve();
      };
      let e = d.createElement("script");
      e.setAttribute("data-exf-rl", "1");
      e.src = src;
      d.head.appendChild(e);
      e.onload = (ev) => {
        ev.target.setAttribute("data-exf-rl", "2");
        check();
      };
    });
  }

  static throttleEvent(elm, eventName, callback, delay = 100) {
    let timeout;
    callback();
    elm.addEventListener(eventName, (e) => {
      clearTimeout(timeout);
      timeout = setTimeout(callback, delay);
    });
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
