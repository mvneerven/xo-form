class Validation {

    constructor(xoForm) {
        this.xo = xoForm;
        this.form = xoForm.query("form").pop();

        
        eventBus.register("xo-interaction", e => {
            //console.log("interaction detected", e)
            let elm = e.detail.control
            this.processValidation(elm)
            this.checkValid()
        })

        setTimeout(() => {
            this.checkValid();    
        }, 60);
        
        
    }

    checkValid() {
        
        let pv = this.isPageValid(this.xo.page);
        console.log("Page ", this.xo.page, "valid: ", pv )
        this.xo.context.data.set("#/_xo/disabled/next", !pv)
        this.xo.context.data.set("#/_xo/disabled/back", this.xo.page <= 1)
    }



    processValidation(elm) {

        let validState = elm.checkValidity();
        console.log("Valid: ", validState, elm.nodeName + "@" + elm.name);

        let xoc = this.xo.closestElement("xo-control", elm);

        try { xoc.invalidMessage = elm.validationMessage } catch { }
        if (xoc && xoc.reportValidity) {
            xoc.reportValidity();
        }
    }

    isPageValid(page) {

        let pg = this.xo.childNodes[page - 1];
        let elms = pg.childNodes;
        let count = elms.length;
        let i = 0;
        elms.forEach(elm => {
            elm.checkValidity();
            if (elm.valid)
                i++;
        })
        return i === count;

    }
}

export default Validation;