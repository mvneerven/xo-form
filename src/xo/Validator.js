const DEFAULT_VALIDATION_TYPE = "inline";
const VALIDATION_TYPE_INLINE = "inline";

/**
 * Validator - manages form validation
 */
class Validator {
  constructor(xoForm) {
    this.form = xoForm;
    const me = this;
    this.form
      .on("interaction", (e) => {
        let elm = e.detail.control;
        this.processValidation(elm);
        this.checkValid();
      })

      .on("page", (e) => {
        me.form.on(
          "page-updated",
          (e) => {
            me.checkValid();
          },
          {
            once: true
          }
        );
      });

    this.form.on("created-control", (e) => {
      if (
        this.form.schema.validation ??
        DEFAULT_VALIDATION_TYPE === VALIDATION_TYPE_INLINE
      ) {
        if (e.detail.control.nested) {
          e.detail.control.nested.addEventListener("invalid", (e2) => {
            e2.preventDefault();
            e2.stopPropagation(); // stop it from bubbling up
            e.detail.control.validationMessage = e2.target.validationMessage;
          });
        }
      }
    });
  }

  checkValid() {
    const db = this.form.model;
    let invalidCtls = [];
    let pageValid = undefined; //;this.isPageValid(this.form.page);
    let totalPages = db.get("#/_xo/nav/total");

    let allValid = true;
    for (let p = 1; p <= totalPages; p++) {
      let pv = this.isPageValid(p);
      if (p === this.form.page) pageValid = pv;
      if (!pv) allValid = false;
    }

    db.set("#/_xo/disabled/next", !pageValid || this.form.page >= totalPages);
    db.set("#/_xo/disabled/back", this.form.page <= 1);
    db.set("#/_xo/disabled/send", !allValid);

    console.debug(
      "Validation: page valid: ",
      pageValid,
      "all valid:",
      allValid,
      "total pages: ",
      totalPages,
      "page: ",
      this.form.page
    );
  }

  processValidation(elm) {
    let validState = elm.checkValidity();
    if (!validState) {
      let xoc = elm.closestElement("xo-control");
      try {
        xoc.invalidMessage = elm.validationMessage;
      } catch {}
      if (xoc && xoc.reportValidity) {
        xoc.reportValidity();
      }
    }
  }

  isPageValid(page) {
    let pg = this.form.childNodes[page - 1];
    if (pg) {
      let elms = pg?.childNodes,
        count = elms.length,
        i = 0;
      elms.forEach((elm) => {
        let valid = elm.checkValidity();
        if (valid) i++;
      });

      return i === count;
    }
  }
}

export default Validator;
