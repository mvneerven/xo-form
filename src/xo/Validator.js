const DEFAULT_VALIDATION_TYPE = "inline";
const VALIDATION_TYPE_INLINE = "inline";

/**
 * Validator - manages form validation
 */
class Validator {
  constructor(xoForm) {
    this.form = xoForm;

    this.form
      .on("interaction", (e) => {
        let elm = e.detail.control;
        this.processValidation(elm);
        this.checkValid();
      })
      .on("ready", (e) => {
        setTimeout(() => {
          this.checkValid();
        }, 1);
      });

    this.form.on("created-control", (e) => {
      if (
        this.form.schema.validation ??
        DEFAULT_VALIDATION_TYPE === VALIDATION_TYPE_INLINE
      ) {
        e.detail.control.on("invalid", (e2) => {
          e2.preventDefault();
        });
        if (e.detail.control.nestedElement) {
          e.detail.control.nestedElement.addEventListener("invalid", (e2) => {
            e2.preventDefault();
            e2.stopPropagation(); // stop it from bubbling up
            e.detail.control.validationMessage = e2.target.validationMessage;
          });
        }
      }
    });
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
