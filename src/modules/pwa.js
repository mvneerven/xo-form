import xo from "../xo";

xo.initialize({
  mixins: {
    styles: {
      right: {
        style: "float: right"
      }
    }
  }
});

class PWA {
  constructor() {
    this.checkDarkTheme();

    const fog = document.getElementById("forkongithub");

    window.addEventListener("scroll", (e) => {
      let o = 1 - Math.min(100, window.scrollY) * 0.01;
      fog.style.opacity = o;
    });

    document.getElementById("xo-version").innerText = "v" + xo.version;
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
