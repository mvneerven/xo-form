import { html, css } from "lit";
import { repeat } from 'lit/directives/repeat.js';

const DEF_HEIGHT = "100px";

class FileDrop extends xo.control {

    _value = [];

    _height = DEF_HEIGHT;

    static styles = css`
        .drop {
            position: relative;
            height: var(--image-height, DEF_HEIGHT)

        }
        input {
            position: absolute;
            width: 100%;
            height: var(--image-height, DEF_HEIGHT);
            opacity: 0
        }
        progress {
            width: 100%;
            visibility: hidden;
        }

        .dropping {
            border: 2px dotted rgba(127,127,127,.5);
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
            margin-right: .5rem
        }
        
        .thumb > a{
            position: absolute;
            display: inline-block;
            top: 5px;
            right: 5px;
            padding: .3rem;
            color: black;
            background-color: rgba(40,40,40,.1);
            border-radius: 1rem;
            cursor: pointer;
        }

        .thumb > a:hover{
            color: red;
        }
    `;

    static get properties() {
        return {
            value: {
                type: Array
            },
            height: {
                type: Number
            }
        }
    }

    get height() {
        return this._height
    }

    set height(height) {
        this._height = height;
    }

    get value() {
        return this._value;
    }

    set value(value) {
        if (!Array.isArray(value))
            return;

        this._value = value;
    }

    renderInput() {
        return html`<div style="--image-height: ${this.height}" class="drop" @dragover=${this.dragOver} @dragend=${this.dragEnd}
    @dragleave=${this.dragEnd} @drop=${this.drop}>
    <input @change=${this.change} type="file" multiple />
    <div class="files">
        ${repeat(this.value, (item) => item.id, (item, index) => {
            return html`<div class="thumb" style="background-image: url(${item.dataUrl})"><a data-index="${index}" @click=${this.removeThumb.bind(this)}>⨉</a></div>`
        }
        )}
    </div>

    <progress id="progress" value="0" max="100"> </progress>
</div>`
    }

    removeThumb(e){
        let index = parseInt(e.target.getAttribute("data-index"));
        this.value.splice(index, 1);
        this.requestUpdate();
    }


    dragOver(e) {
        e.dataTransfer.dropEffect = 'copy';
        this.shadowRoot.querySelector(".drop").classList.add('dropping');
        return false;
    }

    dragEnd(e) {
        this.shadowRoot.querySelector(".drop").classList.remove('dropping');
        e.dataTransfer.dropEffect = 'none';
        return false;
    }

    drop(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'none';
        this.readFiles(e.dataTransfer.files);
        this.dragEnd(e);
        return false;
    }

    change(e) {
        this.readFiles(e.target.files)
    }

    readFiles(files) {
        [...files].forEach(file => {
            this.readFile(file)
        });
    }

    readFile(file) {
        const me = this;
        const reader = new FileReader();
        const progress = this.shadowRoot.querySelector("progress")
        progress.style.visibility = "visible";
        reader.readAsDataURL(file);

        reader.onload = function () {
            me.value.push({
                name: file.name,
                type: file.type,
                size: file.size,
                date: new Date(file.lastModified).toISOString(),
                dataUrl: reader.result
            });
            me.requestUpdate()
        }

        reader.addEventListener('progress', (event) => {
            if (event.loaded && event.total) {
                const percent = (event.loaded / event.total) * 100;
                progress.value = percent;
                if (percent === 100) {
                    progress.style.visibility = "hidden"
                }
            }
        });
    }

    onInput(e) {
        e.preventDefault()
    }
}

customElements.define("xo-filedrop", FileDrop)
export default FileDrop