import xo from "../xo";
import SchemaGenerator from "../generator/schema-generator";

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

    const meta = {
      properties: {
        firstName: {
          type: "string",
          description: "The person's first name."
        }
      }
    };

    let g = new SchemaGenerator(meta);
    let schema = g.createSchema();
    console.log("Generated: ", schema);
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
