import { css } from "lit";
import Group from "./Group";
import Control from "./Control";
/**
 * Navigation - Manages multi-step form navigation
 */

class Navigation extends Group {
  static get styles() {
    return [
      Control.sharedStyles,
      css`
        :host {
          display: flex;
        }
        .xo-grp {
          display: inline-block;
          margin: auto;
        }
      `
    ];
  }

  beforeMap() {
    this.layout = "horizontal";

    this._controls = [];

    const totalPages = this.getData("#/_xo/nav/total");

    if (totalPages > 1) {
      this._controls.push(
        ...[
          {
            type: "button",
            name: "prev",
            label: "Back",
            bind: "#/_xo/nav/back",
            disabled: "#/_xo/disabled/back",
            click: this.prev.bind(this)
          },
          {
            type: "button",
            name: "nxt",
            label: "Next",
            bind: "#/_xo/nav/next",
            disabled: "#/_xo/disabled/next",
            click: this.next.bind(this)
          }
        ]
      );
    }
  }

  static get properties() {
    return {
      page: {
        type: Number
      },
      controls: {
        type: Array
      }
    };
  }

  set page(value) {
    if(value === null || typeof(value) === "undefined") return
    
    if (typeof value !== "number") throw Error("Invalid value for page");
    const old = this.form.page;
    this.form.page = value;
    this.form.emit("page", {
      from: old,
      to: value
    });
  }
  
  get page() {
    return this.form.page;
  }

  set controls(value) {
    if (!Array.isArray(value)) throw Error("Invalid controls property value");
    this._controls = value;

    for (let control of this._controls) {
      let navElement = this.createControl(this, "button", control);
      this.appendChild(navElement);
    }
  }

  get controls() {
    return this._controls;
  }

  prev() {
    this.updateState(-1);
  }

  next() {
    this.updateState(+1);
  }

  updateState(dir) {
    let p = this.getData("#/_xo/nav/page");
    let total = this.getData("#/_xo/nav/total");
    if (dir > 0) p = Math.min(total, p + 1);
    else p = Math.max(1, p - 1);

    this.setData("#/_xo/nav/page", p);
    this.setData("#/_xo/disabled/next", p >= total);
    this.setData("#/_xo/disabled/back", p <= 1);
  }

  submit() {
    let xo = this.closest("xo-form"),
      result = {};

    Object.entries(xo.elements).forEach((item) => {
      let name = item[1].name;
      if (name) {
        let value = item[1].value;
        result[name] = value;
      }
    });
    console.log(JSON.stringify(result, null, 2));
  }
}

window.customElements.define("xo-nav", Navigation);
export default Navigation;
