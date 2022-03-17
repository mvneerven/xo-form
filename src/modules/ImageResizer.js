// const MAX_WIDTH = 320;
// const MAX_HEIGHT = 180;
// const MIME_TYPE = "image/jpeg";
// const QUALITY = 0.7;

class ImageResizer {
    static async resize(url, options = { 
            maxWidth: 1024, maxHeight: 768, contentType: "image/jpeg",   quality: 0.7 
        }) {
        return new Promise(resolve => {
            const img = new Image();
            img.src = url;
            img.onerror = function () {
                URL.revokeObjectURL(this.src);
            };
            img.onload = function () {
                URL.revokeObjectURL(this.src);
                const [newWidth, newHeight] = ImageResizer.calculateSize(img,
                    options.maxWidth, options.maxHeight);
                const canvas = document.createElement("canvas");
                canvas.width = newWidth; canvas.height = newHeight;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, newWidth, newHeight);

                const resultUrl = canvas.toDataURL(options.contentType, options.quality);
                const result = {
                    url: resultUrl,
                    contentType: resultUrl.match(/^data\:([^\;]+)\;base64,/mi)[1] || '',
                    b64: resultUrl.replace(/^data\:([^\;]+)\;base64,/gmi, '')
                };

                canvas.toBlob(blob => {
                    result.size = blob.size;
                    resolve(result);
                }, options.contentType, options.quality);


            };
        });
    }

    static calculateSize(img, maxWidth, maxHeight) {
        let width = img.width;
        let height = img.height;

        // calculate the width and height, constraining the proportions
        if (width > height) {
            if (width > maxWidth) {
                height = Math.round((height * maxWidth) / width);
                width = maxWidth;
            }
        } else {
            if (height > maxHeight) {
                width = Math.round((width * maxHeight) / height);
                height = maxHeight;
            }
        }
        return [width, height];
    }
}


export default ImageResizer; 