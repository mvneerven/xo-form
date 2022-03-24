import Control from "./Control";
import Form from "./Form";
import Group from "./Group";
import Page from "./Page";
import Repeat from "./Repeat";
import Navigation from "./Navigation";
import Context from "./Context";
import Util from "./Util";
import DataBinding from "./DataBinding";
import PropertyMapper from "./PropertyMapper";
import Validation from "./Validation";

/**
 * XO - Namespace
 */
class xo {
  /**
   * XO Context
   */
  static get Context() {
    return Context;
  }

  /**
   * XO Control (```<xo-control/>```) - both Base Control for XO, and wrapping Control for other HTML elements
   */
  static get Control() {
    return Control;
  }

  /**
   * XO DataBinding - Manages dual-databinding within the form
   */
  static get DataBinding() {
    return DataBinding;
  }

  /**
   * XO Form Control (```<xo-form/>```)
   */
  static get Form() {
    return Form;
  }

  /**
   * XO Group Control (```<xo-group/>```)
   */
  static get Group() {
    return Group;
  }

  /**
   * XO Property Mapper
   */
  static get PropertyMapper() {
    return PropertyMapper;
  }

  /**
   * XO Page Control (```<xo-page/>```)
   */
  static get Page() {
    return Page;
  }

  /**
   * XO Repeat Control (```<xo-repeat/>```) - Repeats underlying structure for all items in *.items* Array.
   */
  static get Repeat() {
    return Repeat;
  }

  /**
   * Util Class - contains static helper methods
   */
  static get Util() {
    return Util;
  }

  /**
   * Navigation - Manages multi-step form navigation
   */
  static get Navigation() {
    return Navigation;
  }

  /**
   * Validation - manages form validation
   */
  static get Validation() {
    return Validation;
  }
}

//window.xo = xo;
export default xo;
