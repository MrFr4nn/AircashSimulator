(function () {
    'use strict';

    angular
        .module('app')
        .factory('print', print);

    function print() {
        var service = {
            print: print
        };

        return service;

        function print(b64Data) {
            
            let iframe = document.getElementById("Iframe");
            if (iframe)
                iframe.remove();
            let blob = getBlobUrl(b64Data);
            var ifrm = document.createElement("iframe");
            ifrm.setAttribute("src", blob);
            ifrm.setAttribute("hidden", true);
            ifrm.setAttribute("id", "Iframe");
            ifrm.addEventListener("load", function () {
                let ifr = document.getElementById("Iframe");
                if (ifr) {
                    ifr.contentWindow.print();
                }
            })
            document.body.appendChild(ifrm);
        }
    }
})();

function b64toBlob(b64Data, contentType = '', sliceSize = 512) {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize),
            byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
}

function getBlobUrl(b64Data) {
    let contentType = "application/pdf";
    let blob = this.b64toBlob(b64Data, contentType);
    return URL.createObjectURL(blob);
}



