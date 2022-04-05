import { LitElement, html, css } from "lit";
import Util from "./Util";

const LEAFLET_VERSION = "1.7.1",
  getTheme = () => {
    return document.documentElement.classList.contains("theme-dark")
      ? "vs-dark"
      : "vs-light";
  };

/**
 * Monaco Code Editor Wrapper
 */
class Leaflet extends LitElement {
  _version = LEAFLET_VERSION;

  async requireLeaflet() {
    return new Promise(async (resolve) => {
      await Util.requireJS(
        `https://unpkg.com/leaflet@${this.version}/dist/leaflet.js`
      );

      let tmr;
      tmr = setInterval((e) => {
        if (window.L) {
          clearInterval(tmr);
          resolve(window.L);
        }
      }, 50);
    });
  }

  async firstUpdated() {
    console.debug("Leaflet first update");
    const me = this;
    super.firstUpdated();

    let leaflet = await this.requireLeaflet();

    let elm = this.shadowRoot.getElementById("leaflet");

    const pos = [52.85582619118, 5.717743972222222];

    const zoom = 14;

    var map = leaflet.map(elm).setView(pos, zoom);
    console.debug("Leaflet Map", map);
    leaflet
      .tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      })
      .addTo(map);
  }

  render() {
    return html`<div>
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@${this.version}/dist/leaflet.css"
      />
      <div id="leaflet" style="height: 300px; width: 100%"></div>
    </div>`;
  }

  get version() {
    return this._version;
  }

  set version(version) {
    this._version = version;
  }
}

customElements.define("xw-leaflet", Leaflet);
export default Leaflet;
