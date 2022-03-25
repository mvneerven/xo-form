import Util from "./Util";
import autoCompleteStyles from "../../css/autocomplete.css";
import Control from "./Control";

/**
 * Autocomplete helper for all textbox derived controls.
 */
class AutoComplete {
  cssClasses = {
    result: "xo-ac-rs",
    item: "xo-ac-itm",
  };

  /**
   * @returns {CSSStyleSheet}
   */
  static get sharedStyles() {
    if (!this._sheet) {
      this._sheet = new CSSStyleSheet();
      this._sheet.replaceSync(autoCompleteStyles);
    }
    return this._sheet;
  }

  constructor(control, textInput, settings) {
    this.settings = settings;
    this.control = control;
    this.htmlElement = textInput;
    this.htmlElement.setAttribute("autocomplete", "off");
    this.categories = settings.categories || {};

    if (!settings.items)
      throw TypeError(
        "Must pass items array, function or promise in autocomplete settings"
      );

    this.items = settings.items;
  }

  attach() {
    const isXoControl = this.control instanceof Control;

    const on = (a, b) => {
      this.htmlElement.addEventListener(a, b);
    };

    on("input", this.inputHandler.bind(this));
    on("click", this.clickHandler.bind(this));
    on("focusout", this.blurHandler.bind(this));
    on("keyup", this.keyUpHandler.bind(this));
    on("keydown", this.keyDownHandler.bind(this));

    this.resultsDiv = document.createElement("div");
    this.resultsDiv.title = ""; // block
    this.resultsDiv.classList.add(this.cssClasses.result);
    this.resultsDiv.addEventListener("mousedown", this.resultClick.bind(this));

    let cn = isXoControl
      ? this.control.shadowRoot.querySelector(".xo-cn")
      : this.control.shadowRoot.querySelector("*");

    cn.appendChild(this.resultsDiv);

    this.clear();

    cn.setAttribute("data-autocomplete", "on");
  }

  moveResult(add) {
    this.show();
    let all = this.resultsDiv.querySelectorAll("div");
    let length = all.length;
    this.rowIndex = this.rowIndex + add;

    if (this.rowIndex <= 0) this.rowIndex = 0;
    else if (this.rowIndex > length - 1) {
      this.rowIndex = 0;
    }
    all.forEach((r) => {
      r.classList.remove("selected");
    });

    let div = this.getSelectedDiv();
    if (div) {
      div.classList.add("selected");
      div.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    } else {
      this.clickHandler({
        target: this.htmlElement,
      });
    }
  }

  getSelectedDiv() {
    return this.resultsDiv.querySelector(`div:nth-child(${this.rowIndex + 1})`);
  }

  // execute action
  selectResult(div) {
    div = div || this.getSelectedDiv();

    if (div) {
      let index = parseInt(div.getAttribute("data-index"));
      this.resultClicked = true;
      let result = this.results[index];

      let handlingCategory = this.categories[result.category] || {
        action: this.setText.bind(this),
      };

      if (handlingCategory.newTab) {
        this.tabWindow = window.open("about:blank", "_blank"); // prevent popup blocking
      }

      let options = {
        ...result,
        search: this.htmlElement.value,
      };

      div.classList.add("active");

      setTimeout(() => {
        handlingCategory.action(options);
        if (handlingCategory.newTab) {
          if (options.url) {
            this.tabWindow.location.href = options.url;
          } else {
            this.tabWindow.close();
          }
        }

        var event = new Event("change", { bubbles: true });
        this.htmlElement.dispatchEvent(event);

        this.clear();

        const ev = new Event("result-selected", { bubbles: false });
        ev.detail = {
          text: options.text,
        };
        this.htmlElement.dispatchEvent(ev);
      }, 0);
    }
  }

  setText(options) {
    if (this.control.autoCompleteInput) {
      //this.control.autoCompleteInput.value = options.text;
    } else {
      this.control.value = options.text;
    }
    this.hide();
  }

  resultClick(event) {
    this.selectResult(event.target.closest(`.${this.cssClasses.item}`));
  }

  set categories(value) {
    this._categories = value;
  }

  get categories() {
    return this._categories || {};
  }

  blurHandler(e) {
    setTimeout(() => {
      if (!this.resultClicked) this.clear();

      this.resultClicked = false;
    }, 100);
  }

  clear() {
    this.resultsDiv.innerHTML = "";
    this.resultsDiv.style.display = "none";
  }

  show() {
    if (this.resultsDiv.style.display !== "block") {
      this.resultsDiv.style.display = "block";
      this.rowIndex = -1;
    }
  }

  hide() {
    this.resultsDiv.style.display = "none";
  }

  inputHandler(e) {
    this.clear();
    let options = {
      search: e.target.value,
      categories: this.categories,
    };

    this.getItems(options, e).then((r) => {
      this.clear();
      this.resultsHandler(r, options);
    });
  }

  keyDownHandler(e) {
    switch (e.keyCode) {
      case 13:
        e.stopPropagation();
        e.preventDefault();
        break;
      case 40:
      case 38:
        e.preventDefault();
    }
  }

  keyUpHandler(e) {
    switch (e.keyCode) {
      case 40: // down
        this.moveResult(1);
        break;
      case 38: // up
        this.moveResult(-1);
        break;
      case 27:
        this.hide();
        break;
      case 13:
        if (this.getSelectedDiv()) {
          this.control.preventEnter = true;
          e.stopPropagation();
          e.preventDefault();
          this.selectResult();
          setTimeout(() => {
            this.control.preventEnter = false;
          }, 10);
        }

        break;
      default:
        //this.toggle();
        break;
    }
  }

  clickHandler(e) {
    this.clear();
    let value = e.target.value;
    this.suggest(value, e);
  }

  /**
   * Shows suggestion box
   * @param {string} value - String to suggest results for
   */
  suggest(value, e) {
    this.htmlElement.focus();
    const options = {
      suggest: true,
      search: value || "",
      categories: this.categories,
    };
    this.getItems(options, e).then((r) => {


      this.htmlElement.dispatchEvent(new CustomEvent("show-results", {
        detail: {
          results: r
        }
      }))


      this.resultsHandler(r, options);
    });
  }

  resultsHandler(r, options) {
    this.results = r;
    this.rowIndex = -1;
    let index = 0;

    r.forEach((i) => {
      let image = null,
        catHandler = options.categories[i.category] || {};
      if (i.image) {
        i.icon = "xo-ac-img";
        image = `style="background-image: url('${i.image}')"`;
      }
      if (i.element) {
        this.resultsDiv.appendChild(i.element);
      } else {
        i = typeof i === "string" ? { text: i } : i;
        this.resultsDiv.appendChild(
          Util.parseHTML(
            `<div title="${i.tooltip || ""}" data-index="${index}" class="${
              this.cssClasses.item
            }">
                            <span ${image} class="${
              i.icon || catHandler.icon
            }"></span>
                            <span class="text">${this.formatResultItem(
                              i,
                              options,
                              catHandler
                            )}</span>
                            <span class="category">${
                              i.category || ""
                            }</span></div>`
          )
        );
      }

      index++;
    });
    if (r.length) {
      this.show();
    }
  }

  formatResultItem(i, options, catHandler) {
    i = typeof i === "string" ? { text: i } : i;
    let result = i.text;

    if (options.search) {
      result = result.replace("%search%", options.search);
      i.description = i.description?.replace("%search%", options.search);
    }

    result = this.highlight(result, options.search);

    if (i.description) {
      result = `<div>${result}</div><small>${i.description}</small>`;
    }

    if (catHandler.format) {
      result = catHandler.format({
        item: i,
        result: result,
        options: options,
      });
    }
    return result;
  }

  highlight(str, find) {
    var reg = new RegExp("(" + find + ")", "gi");
    return str.replace(reg, '<span class="txt-hl">$1</span>');
  }

  async getItems(options, e) {
    const prop = this.settings.map;

    const normalizeItem = (i) => {
      return { text: i.text ?? i };
    };

    const map = (list) => {
      if (!prop) {
        return list;
      }
      return list.map((i) => {
        return { text: i[prop] };
      });
    };

    const max = (list) => {
      if (this.settings.max && this.settings.max > 0) {
        list.length = this.settings.max;
      }
      return list;
    };

    return new Promise((resolve) => {
      if (Util.isUrl(this.items)) {
        if (this.settings.minlength > 0) {
          if (
            !options.search ||
            options.search.length < this.settings.minlength
          ) {
            resolve([]);
            return;
          }
        }
        let url = this.formatSearch(this.items, options);
        fetch(url).then((x) => {
          if (x.status === 200) {
            x.json().then((items) => {
              items = map(items);

              resolve(
                max(
                  items.filter((i) => {
                    return this.isMatch(options, i);
                  })
                )
              );
            });
            return;
          }
          throw Error(`HTTP error ${x.status} - ${url}`);
        });
      } else if (Array.isArray(this.items)) {
        let simple = true;

        this.items = this.items.map((i) => {
          if (typeof i === "string") {
            return { text: i };
          }
          simple = false;
          return i;
        });
        if (simple) {
          this.control.classList.add("simple");
        }
        resolve(
          max(
            map(
              this.items.filter((i) => {
                return this.isMatch(options, i);
              })
            )
          )
        );
      } else if (typeof this.items === "function") {
        options.control = this.control;
        let ar = this.items(options, e).map((i) => {
          return normalizeItem(i);
        });

        ar = map(
          ar.filter((i) => {
            return this.isMatch(options, i);
          })
        );

        resolve(ar);
      } else {
        return resolve(Promise.resolve(this.items.apply(this, options)));
      }
    });
  }

  formatSearch(url, options) {
    if (url.indexOf("%search%")) {
      return url.replace("%search%", options.search || "");
    }

    return url + "?" + this.createQueryParam(options);
  }

  createQueryParam(options) {
    let suggest = options.suggest ? "&suggest=true" : "";
    return `q=${options.text}${suggest}`;
  }

  isMatch(options, i) {
    if (i.text?.indexOf("%search%") >= 0) return true;

    return options.search
      ? i.text?.toLowerCase().indexOf(options.search.toLowerCase()) >= 0
      : options.suggest;
  }
}

export default AutoComplete;
