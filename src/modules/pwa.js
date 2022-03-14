import Router from "./Router";
import { LIT_COMPONENTS } from "../web-components";
import { bookATable } from '../forms/book-a-table';
import { managePets } from '../forms/manage-pets';
import { wizard } from '../forms/wizard';

class PWA {
    constructor() {
        this.router = new Router({
            type: "history",
            routes: {
                "/": "home",
                "/test": "test"
            }
        });

        this.router.listen().on("route", e => {
            console.log(e.detail.route, e.detail.url);
        });

        this.checkDarkTheme()
        this.form = document.querySelector("xo-form");

        this.form.schema = wizard;
    }

    checkDarkTheme() {

        const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
        if (prefersDarkScheme.matches) {
            document.documentElement.classList.toggle("theme-dark")
        }
    }
}

export default PWA;
