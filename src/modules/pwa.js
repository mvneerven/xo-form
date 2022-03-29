import xo from "../xo";

class PWA {
  constructor() {
    this.checkDarkTheme();
  }

  checkDarkTheme() {
    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
    document.documentElement.classList.toggle(
      "theme-dark",
      prefersDarkScheme.matches
    );
    document.documentElement.classList.toggle(
      "theme-light",
      !prefersDarkScheme.matches
    );
  }
}

export default PWA;
