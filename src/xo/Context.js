import PropertyMapper from "./PropertyMapper";
import DataBinding from "./DataBinding";
import xoStyles from "../../css/controls.css";

/**
 * XO Context - Gives access to contextual properties
 */
class Context {
  static _sheet;

  constructor(form) {
    this._form = form;
    this._db = new DataBinding(this);
    this._mapper = new PropertyMapper(this);
  }

  /**
   * Returns a reference to the Form instance.
   * @returns {import('./Form.js') as Form}
   */
  get form() {
    return this._form;
  }

  /**
   * Gets a reference to the DataBinding for the form.
   * @returns {DataBinding}
   */
  get data() {
    return this._db;
  }

  /**
   * @returns {PropertyMapper}
   */
  get mapper() {
    return this._mapper;
  }

  /**
   * @returns {CSSStyleSheet}
   */
  static get sharedStyles() {
    if (!this._sheet) {
      this._sheet = new CSSStyleSheet();
      this._sheet.replaceSync(xoStyles);
    }
    return this._sheet;
  }
}

export default Context;
