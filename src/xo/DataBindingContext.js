/**
 * Databinding Context
 */
class DataBindingContext {
  _options = null;

  constructor(options) {
    this._options = options;
  }

  get value() {
    return this._options.value;
  }

  get data() {
    return this._options.data;
  }

  get form() {
    return this._options.form;
  }

  get path() {
    return this._options.path;
  }

  get binding() {
    return this._options.binding;
  }
}

export default DataBindingContext;
