
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

const xo = {
  Context: Context,
  Control: Control,
  DataBinding: DataBinding,
  Form: Form,
  Group: Group,  
  PropertyMapper: PropertyMapper,
  Page: Page,
  Repeat: Repeat,
  Util: Util,
  Validation: Validation
};

window.xo = xo;

export default xo;
