import Control from "./Control";
import Form from "./Form";
import Group from "./Group";
import Page from "./Page";
import Repeat from "./Repeat";
import Navigation from "./Navigation";
import Util from "./Util";
import PropertyMapper from "./PropertyMapper";
import Validator from "./Validator";
import { version } from "../../package.json";

/**
 * The xo namespace
 */
class xo {
  static _options = {};

  static get version() {
    return version;
  }

  static initialize(options = {}) {
    this.options = {
      throttleInput: 150, // input event throttling
      defaultTheme: "material",
      ...options
    };

    if (this.options && this.options.mixins) {
      PropertyMapper._mixins = {
        ...PropertyMapper._mixins,
        ...this.options.mixins
      };
    }
  }

  /**
   * Base Control and wrapping Control for other HTML elements
   * @returns {Control}
   */
  static get Control() {
    return Control;
  }

  /**
   * Form Control
   * @returns {Form}
   */
  static get Form() {
    return Form;
  }

  /**
   * Group Control
   * @returns {Group}
   */
  static get Group() {
    return Group;
  }

  /**
   * Property Mapper
   * @returns {PropertyMapper}
   */
  static get PropertyMapper() {
    return PropertyMapper;
  }

  /**
   * Page Control
   * @returns {Page}
   */
  static get Page() {
    return Page;
  }

  /**
   * Repeat Control - Repeats underlying structure for all items in the Array the repeat is bound to.
   * @returns {Repeat}
   */
  static get Repeat() {
    return Repeat;
  }

  /**
   * Util Class - contains static helper methods
   * @returns {Util}
   */
  static get Util() {
    return Util;
  }

  /**
   * Navigation - Manages multi-step form navigation
   * @returns {Navigation}
   */
  static get Navigation() {
    return Navigation;
  }

  /**
   * Validation - manages form validation
   * @returns {Validator}
   */
  static get Validation() {
    return Validator;
  }
}

//window.xo = xo;
export default xo;
