import Router from "./Router";
import xo from '../xo';
import { bookATable } from "../../forms/book-a-table";
import { managePets } from "../../forms/manage-pets";
import { wizard } from "../../forms/wizard";
import { movies } from "../../forms/movies";
import { onboarding } from "../../forms/onboarding";

class PWA {
  constructor() {

    // this.router = new Router({
    //   type: "history",
    //   routes: {
    //     "/": "home",
    //     "/test": "test",
    //   },
    // });

    // this.router.listen().on("route", (e) => {
    //   console.log(e.detail.route, e.detail.url);
    // });

    this.checkDarkTheme();
    
  }

  checkDarkTheme() {
    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
    if (prefersDarkScheme.matches) {
      document.documentElement.classList.toggle("theme-dark");
    }
  }
}

export default PWA;
