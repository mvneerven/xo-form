import Util from "./Util";

class Validation {
  constructor(xoForm) {
    this.xo = xoForm;
    this.form = xoForm.query("form").pop();

    eventBus.register("xo-interaction", (e) => {      
      let elm = e.detail.control;
      this.processValidation(elm);
      this.checkValid();
    });

    setTimeout(() => {
      this.checkValid();
    }, 60);
  }

  checkValid() {
    let pageValid = this.isPageValid(this.xo.page);
    let totalPages = this.xo.context.data.get("#/_xo/nav/total");
    this.xo.context.data.set(
      "#/_xo/disabled/next",
      !pageValid || this.xo.page >= totalPages
    );
    this.xo.context.data.set("#/_xo/disabled/back", this.xo.page <= 1);
  }

  processValidation(elm) {
    let validState = elm.checkValidity();

    let xoc = Util.closestElement("xo-control", elm);

    try {
      xoc.invalidMessage = elm.validationMessage;
    } catch {}
    if (xoc && xoc.reportValidity) {
      xoc.reportValidity();
    }
  }

  isPageValid(page) {
    let pg = this.xo.childNodes[page - 1];
    let elms = pg.childNodes;
    let count = elms.length;
    let i = 0;
    elms.forEach((elm) => {
      elm.checkValidity();
      if (elm.valid) i++;
    });
    return i === count;
  }
}

export default Validation;
