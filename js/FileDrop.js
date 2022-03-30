import { LitElement, html, css } from "lit";
import { repeat } from "lit/directives/repeat.js";
import { ifDefined } from "lit/directives/if-defined.js";

const DEF_THUMB_HEIGHT = "70px";

class FileDrop extends LitElement {
  _value = [];

  _max = -1;

  _thumbSize = DEF_THUMB_HEIGHT;

  _types = ["image/"];

  static get styles() {
    return [
      css`
        .drop {
          position: relative;
          border-radius: 1rem;
          height: 100%;
          min-width: 200px;
          cursor: pointer;
          border: 2px transparent;
          min-height: 60px;
          transition: all .2s ease;
        }

        .drop:not(.has-files) [part="files"]:after {
          top: 5px;
          left: 5px;
          width: 100%;
          height: fit-content;

          content: var(
            --filedrop-info-text,
            "Select files to upload, or drag & drop them here..."
          );
          position: absolute;
          opacity: 0.3;
          pointer-events: none;
        }

        input {
          position: absolute;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: pointer;
        }
        progress {
          width: 100%;
          visibility: hidden;
        }

        .dropping {
          border: 2px dotted rgba(127, 127, 127, 0.5);
          
          min-height: 200px;
          transition: all .2s ease;
        }

        .files {
          height: 100%;
          display: flex;
          width: 100%;
          overflow-x: auto;
        }

        .thumb {
          position: relative;
          border: 6px solid white;
          background-color: var(--filedrop-thumb-bgcolor, rgba(227, 227, 227, 0.1));
          display: inline-block;
          width: var(--filedrop-thumb-size, 70px);
          height: var(--filedrop-thumb-size, 70px);
          background-size: contain;
          background-repeat: no-repeat;
          background-position-x: center;
          background-position-y: center;
          margin-right: 0.5rem;
          border: 15px solid transparent;
          border-radius: 10px;
        }

        .thumb > a {
          position: absolute;
          display: inline-block;
          top: -14px;
          right: -14px;
          padding: 0px 2px;
          color: var(--accent);
          filter: grayscale(100%);
          background-color: rgba(40, 40, 40, 0.3);
          border-radius: 1rem;
          cursor: pointer;
        }

        .thumb > a:hover {
          filter: grayscale(0%);
          background-color: rgba(127, 127, 127, 0.4);
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
        type: String,
      },
      thumbSize: {
        type: String,
      },
      max: {
        type: Number,
      },
      types: {
        type: Array,
      },
      infotext: {
        type: String,
      },
    };
  }
 

  get thumbSize() {
    return this._thumbSize;
  }

  set thumbSize(height) {
    this._thumbSize = height;
  }

  set max(value) {
    this._max = value;
  }

  get max() {
    return this._max;
  }

  set value(value) {
    if (typeof value === "undefined") return;

    if (!Array.isArray(value)) return; // throw Error("Invalid value for filedrop");

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

  render() {
    const setinfo = this.infotext
      ? `--filedrop-info-text: ${this.infotext}`
      : "";
    const style =
      `--filedrop-thumb-size: ${this.thumbSize};` +
      setinfo;

    return html`<div
      style="${style}"
      class="drop ${this.value.length ? "has-files" : ""}"
      @dragover=${this.dragOver}
      @dragend=${this.dragEnd}
      @dragleave=${this.dragEnd}
      @drop=${this.drop}
    >
      <input @change=${this.change} type="file" .multiple=${this.max !== 1} />
      <div class="files" part="files">
        ${repeat(
          this.value,
          (item) => item.id,
          (item, index) => {
            return this.renderFile(item, index);
          }
        )}
      </div>

      <progress id="progress" value="0" max="100"></progress>
    </div>`;
  }

  renderFile(item, index) {
    let url = item.dataUrl ?? item.url;
    return html`<div
      class="thumb"
      style=${ifDefined(url ? `background-image: url(${url});` : undefined)}
    >
      <a data-index="${index}" @click=${this.removeThumb.bind(this)}>⨉</a>
    </div>`;
  }

  removeThumb(e) {
    let index = parseInt(e.target.getAttribute("data-index"));
    this.value.splice(index, 1);
    this.fireChange();
    this.requestUpdate();
  }

  dragOver(e) {
    e.dataTransfer.dropEffect = "copy";
    this.shadowRoot.querySelector(".drop").classList.add("dropping");
    return false;
  }

  reportValidity() {
    this.invalidMessage = "";
    try {
      this.checkConstraints();
    } catch (ex) {
      this.validationMessage = ex.message;
      
      //this.invalidMessage = ex.message;
      //this.setCustomValidity(ex.message);
      return ex.message;
    } finally {
      this.requestUpdate();
    }
  }

  checkValidity() {
    try {
      this.checkConstraints();
      return true;
    } catch (ex) {
      return false;
    }4
  }

  dragEnd(e) {
    this.shadowRoot.querySelector(".drop").classList.remove("dropping");
    e.dataTransfer.dropEffect = "none";
    return false;
  }

  get valid(){
    return this.checkValidity();
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
    try {
      this.checkConstraints(file);
    } catch {
      return;
    }

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

  fireChange() {
    this.dispatchEvent(
      new Event("change", { bubbles: true, cancelable: false })
    );
  }

  checkConstraints(file) {
    this.checkMax();

    if (file) {
      this.checkFileType(file.type);
      this.checkSizeLimit(file);
    }
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

customElements.define("xw-filedrop", FileDrop);
export default FileDrop;
