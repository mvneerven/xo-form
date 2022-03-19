import { html, css } from "lit";
import { repeat } from "lit/directives/repeat.js";
import Context from "../xo/Context";

const DEF_HEIGHT = "100px";

class FileDrop extends xo.Control {
  _value = [];

  _max = -1;

  _height = DEF_HEIGHT;

  _types = ["image/"];

  static get styles() {
    return [
      Context.sharedStyles,
      css`
        .drop {
          position: relative;
          height: var(--image-height, DEF_HEIGHT);
          min-width: 200px;
        }
        input {
          position: absolute;
          width: 100%;
          height: var(--image-height, DEF_HEIGHT);
          opacity: 0;
        }
        progress {
          width: 100%;
          visibility: hidden;
        }

        .dropping {
          border: 2px dotted rgba(127, 127, 127, 0.5);
        }

        .files {
          height: 100%;
        }

        .thumb {
          position: relative;
          border: 6px solid white;
          background-color: white;
          display: inline-block;
          height: 100%;
          width: 120px;
          background-size: contain;
          background-repeat: no-repeat;
          background-position-y: center;
          margin-right: 0.5rem;
        }

        .thumb > a {
          position: absolute;
          display: inline-block;
          top: 0px;
          right: 0px;
          padding: 0.2rem 0.3rem;
          color: black;
          background-color: rgba(40, 40, 40, 0.3);
          border-radius: 1rem;
          cursor: pointer;
        }

        .thumb > a:hover {
          color: white;
          background-color: rgba(40, 40, 40, 0.8);
          transition: all 0.2s ease;
        }
      `,
    ];
  }

  static get properties() {
    return {
      value: {
        type: Object,
      },
      height: {
        type: Number,
      },
      max: {
        type: Number,
      },
      types: {
        type: Array,
      },
    };
  }

  get height() {
    return this._height;
  }

  set height(height) {
    this._height = height;
  }

  set max(value) {
    this._max = value;
  }

  get max() {
    return this._max;
  }

  set value(value) {
    if (typeof value === "undefined") return;

    if (!Array.isArray(value)) throw Error("Invalid value for filedrop");

    this._value = value;
  }

  get value() {
    return this._value;
  }

  set types(value) {
    if (!Array.isArray(value)) throw Error("Types must be array");

    this._types = value;
  }

  get types() {
    return this._types;
  }

  renderInput() {
    const multiple = this.max !== 1 ? "multiple" : "";

    return html`<div
      style="--image-height: ${this.height}"
      class="drop"
      @dragover=${this.dragOver}
      @dragend=${this.dragEnd}
      @dragleave=${this.dragEnd}
      @drop=${this.drop}
    >
      <input @change=${this.change} type="file" ${multiple} />
      <div class="files">
        ${repeat(
          this.value,
          (item) => item.id,
          (item, index) => {
            return html`<div
              class="thumb"
              style="background-image: url(${item.dataUrl})"
            >
              <a data-index="${index}" @click=${this.removeThumb.bind(this)}
                >⨉</a
              >
            </div>`;
          }
        )}
      </div>

      <progress id="progress" value="0" max="100"></progress>
    </div>`;
  }

  removeThumb(e) {
    let index = parseInt(e.target.getAttribute("data-index"));
    this.value.splice(index, 1);
    this.requestUpdate();
  }

  dragOver(e) {
    e.dataTransfer.dropEffect = "copy";
    this.shadowRoot.querySelector(".drop").classList.add("dropping");
    return false;
  }

  dragEnd(e) {
    this.shadowRoot.querySelector(".drop").classList.remove("dropping");
    e.dataTransfer.dropEffect = "none";
    return false;
  }

  drop(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "none";
    this.readFiles(e.dataTransfer.files);
    this.dragEnd(e);
    return false;
  }

  change(e) {
    this.readFiles(e.target.files);
  }

  readFiles(files) {
    this._readCount = files.length;
    this._readIndex = 0;
    [...files].forEach((file) => {
      this.readFile(file);
    });
  }

  readFile(file) {
    this.checkConstraints(file);

    const me = this;
    const reader = new FileReader();
    const progress = this.shadowRoot.querySelector("progress");
    progress.style.visibility = "visible";
    reader.readAsDataURL(file);

    reader.onload = function () {
      me.value.push({
        name: file.name,
        type: file.type,
        size: file.size,
        date: new Date(file.lastModified).toISOString(),
        dataUrl: reader.result,
      });
      me._readIndex++;

      if (me._readIndex === me._readCount) {
        console.log("FileDrop ready reading all files");
        me._readCount = 0;
        me._readIndex = 0;
        me.fireChange();
        me.requestUpdate();
      }
    };

    reader.addEventListener("progress", (event) => {
      if (event.loaded && event.total) {
        const percent = (event.loaded / event.total) * 100;
        progress.value = percent;
        if (percent === 100) {
          progress.style.visibility = "hidden";
        }
      }
    });
  }

  checkConstraints(file) {
    this.checkMax();
    this.checkFileType(file.type);
    this.checkSizeLimit(file);
  }

  checkMax() {
    if (this.max !== -1 && this.value.length >= this.max)
      throw Error("Maximum number of files reached");
  }

  checkFileType(type) {
    let found = false;
    this.types.forEach((t) => {
      if (type.indexOf(t) === 0) found = true;
    });

    if (!found) throw Error("Invalid file type");
  }

  checkSizeLimit(file) {
    let totalSize = 0;
    this.value.forEach((f) => {
      totalSize += f.size;
    });
    if (totalSize > this.limit) {
      throw Error("File size limit exceeded");
    }
  }

  onInput(e) {
    e.preventDefault();
  }
}

customElements.define("xo-filedrop", FileDrop);
export default FileDrop;
