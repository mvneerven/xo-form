class Util {
    /**
     * Checks whether the fiven string is a valid URL.
     * @param {String} txt - the string to evaluate
     * @returns Boolean indeicating whether the string is a URL.
     */
    static isUrl(txt) {
        try {
            if (typeof (txt) !== "string")
                return false;
            if (txt.indexOf("\n") !== -1 || txt.indexOf(" ") !== -1)
                return false;
            if (txt.startsWith("#/"))
                return false;
            new URL(txt, window.location.origin)
            return true;
        }
        catch { }
        return false;
    }

    /**
    * Generates an Html Element from the given HTML string
    * @param {String} html 
    * @returns DOM element
    */
    static parseHTML(html) {
        let parser = new DOMParser(),
            doc = parser.parseFromString(html, 'text/html');
        return doc.body.firstChild;
    }

    static throttle(listener, delay = 500) {
        var timeout;
        var throttledListener = function(e) {
            if (timeout) clearTimeout(timeout);
            timeout = setTimeout(listener, delay, e);
        }
        return throttledListener;
    }
}

export default Util