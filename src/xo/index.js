import Control from "./Control";
import Form from "./Form";
import Group from "./Group";
import Page from "./Page";
import Repeat from "./Repeat";
import Context from "./Context";
import { EventBus } from "./EventBus";
import Util from "./Util";

const xo = {
  Control: Control,
  Form: Form,
  Group: Group,
  Context: Context,
  Page: Page,
  Repeat: Repeat,
  Util: Util
};

window.xo = xo;

export default xo;
