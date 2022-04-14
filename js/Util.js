class Util {
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
    },
    timeoutMilliseconds = 5000
  ) {
    return new Promise((resolve, reject) => {
      let timeout = setTimeout((e) => {
          if(tmr) clearInterval(tmr)
          reject("Timeout expired");
        }, timeoutMilliseconds),
        tmr,
        evualationResult = null;
      tmr = setInterval((e) => {
        try {
          if ((evualationResult = evaluator())) {
            clearInterval(tmr);
            clearTimeout(timeout);
            resolve(evualationResult);
          }
        } catch {}
      }, 50);
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
}

export default Util;
