import PropertyMapper from "./PropertyMapper";
import DataBinding from "./DataBinding";
import xoStyles from "../../css/controls.css";
import Util from "./Util";
/**
 * XO Context - Gives access to contextual properties
 */
class Context {
  static _sheet;

  // static constructor
  static _staticConstructor = (() => {})();

  constructor(form) {
    this._form = form;
    this._db = new DataBinding(this);
    this._mapper = new PropertyMapper(this);
  }

  static get controlProperties() {
    return {
      name: { type: String, attribute: true },
      bind: { type: String },
      type: { type: String, attribute: true },
      hidden: { type: Boolean, attribute: true },
      disabled: { type: Boolean, attribute: true },
      required: { type: Boolean, attribute: true },
      autofocus: { type: Boolean },
      hasFocus: { type: Boolean },
      label: { type: String },
      title: { type: String },
      placeholder: { type: String, attribute: true },
      value: { type: Object },
      classes: { type: Array },
      autocomplete: { type: Object },
      prepend: { type: Object },
      append: { type: Object },
      mixin: { type: Object }
    };
  }

  dispose() {
    this._db.dispose();
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
      this._sheet = Util.createStyleSheet(new Document(), xoStyles);
    }
    return this._sheet;
  }
}

export default Context;
