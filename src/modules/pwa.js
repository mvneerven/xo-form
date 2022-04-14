import xo from "../xo";
import MdHtml from "./md-html";
import gen from "../generator";
import jsonSchema from "../../data/json-schemas/person-schema.json";
import JSONSchemaReader from "../generator/json-schema-reader";

class PWA {
  constructor() {
    this.checkDarkTheme();

    const fog = document.getElementById("forkongithub");

    window.addEventListener("scroll", (e) => {
      let o = 1 - Math.min(100, window.scrollY) * 0.01;
      fog.style.opacity = o;
    });

    if (window.location.pathname === "/meta.html") {
      let g = new gen.SchemaGenerator(new JSONSchemaReader(jsonSchema));

      let schema = g.createSchema();
      console.log(schema);

      let x = document.querySelector("xo-form");
      x.schema = schema;
    }
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
