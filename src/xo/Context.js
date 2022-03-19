import PropertyMapper from "./PropertyMapper";
import DataBinding from "./DataBinding";
import xoStyles from "../../css/controls.txt";

class Context {
  static _sheet;

  constructor(form) {
    this._form = form;
    this._db = new DataBinding(this);
    this._mapper = new PropertyMapper(this);
  }

  get form() {
    return this._form;
  }

  get data() {
    return this._db;
  }

  get mapper() {
    return this._mapper;
  }

  static get sharedStyles(){
    if(!this._sheet) {
      this._sheet = new CSSStyleSheet();
      this._sheet.replaceSync(xoStyles);
    }
    return this._sheet;
  }
}

export default Context;
