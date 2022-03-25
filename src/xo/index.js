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
import AutoComplete from "./AutoComplete";

/**
 * XO - Namespace
 */
class xo {
  /**
   * XO Context
   * @returns {Context}
   */
  static get Context() {
    return Context;
  }

  /**
   * XO Control (```<xo-control/>```) - both Base Control for XO, and wrapping Control for other HTML elements
   * @returns {Control}
   */
  static get Control() {
    return Control;
  }

  /**
   * XO DataBinding - Manages dual-databinding within the form
   * @returns {DataBinding}
   */
  static get DataBinding() {
    return DataBinding;
  }

  /**
   * XO Form Control (```<xo-form/>```)
   * @returns {Form}
   */
  static get Form() {
    return Form;
  }

  /**
   * XO Group Control (```<xo-group/>```)
   * @returns {Group}
   */
  static get Group() {
    return Group;
  }

  /**
   * XO Property Mapper
   * @returns {PropertyMapper}
   */
  static get PropertyMapper() {
    return PropertyMapper;
  }

  /**
   * XO Page Control (```<xo-page/>```)
   * @returns {Page}
   */
  static get Page() {
    return Page;
  }

  /**
   * XO Repeat Control (```<xo-repeat/>```) - Repeats underlying structure for all items in *.items* Array.
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
   * @returns {Validation}
   */
  static get Validation() {
    return Validation;
  }

   /**
   * Validation - manages form validation
   * @returns {AutoComplete}
   */
   static get AutoComplete() {
     return AutoComplete;
   }
}

//window.xo = xo;
export default xo;
