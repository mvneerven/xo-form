
/**
 * Validation - manages form validation
 */
class Validation {
  constructor(xoForm) {
    this.form = xoForm;
    this.form.addEventListener("interaction", (e) => {
      let elm = e.detail.control;
      this.processValidation(elm);
      this.checkValid();
    });

    setTimeout(() => {
      this.checkValid();
    }, 60);
  }

  checkValid() {
    let pageValid = this.isPageValid(this.form.page);
    let totalPages = this.form.context.data.get("#/_xo/nav/total");
    this.form.context.data.set(
      "#/_xo/disabled/next",
      !pageValid || this.form.page >= totalPages
    );
    this.form.context.data.set("#/_xo/disabled/back", this.form.page <= 1);
  }

  processValidation(elm) {
    let validState = elm.checkValidity();

    let xoc = elm.closestElement("xo-control");

    try {
      xoc.invalidMessage = elm.validationMessage;
    } catch {}
    if (xoc && xoc.reportValidity) {
      xoc.reportValidity();
    }
  }

  isPageValid(page) {
    let pg = this.form.childNodes[page - 1];
    if (pg) {
      let elms = pg?.childNodes;
      let count = elms.length;
      let i = 0;
      elms.forEach((elm) => {
        elm.checkValidity();
        if (elm.valid) i++;
      });
      return i === count;
    }
  }
}

export default Validation;
