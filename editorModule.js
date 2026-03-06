// editorModule.js
// This module initializes the image upload / canvas editor.
export function initEditor(){
    if (window.__editorInitialized) return;
    window.__editorInitialized = true;

    const upload = document.getElementById("upload");
    const canvas = document.getElementById("canvas");
    if (!upload || !canvas) return; // editor not present
    const ctx = canvas.getContext("2d");

    // store uploaded image and crop params
    let uploadedImage = null;
    let uploadedCrop = null;

    // offscreen buffer 1000x1000
    const buffer = document.createElement('canvas');
    buffer.width = 1000; buffer.height = 1000;
    const bctx = buffer.getContext('2d');

    // selectable overlay
    const overlay = new Image();
    // fixed top overlay
    const topOverlay = new Image();
    topOverlay.src = 'images/topOverlay.PNG';

    function drawBufferToVisible(){
        ctx.clearRect(0,0,canvas.width,canvas.height);
        ctx.drawImage(buffer, 0, 0, buffer.width, buffer.height, 0, 0, canvas.width, canvas.height);
    }

    function redrawBaseAndOverlay(){
        if (!uploadedImage) return;
        bctx.clearRect(0,0,buffer.width,buffer.height);
        const { sx, sy, size } = uploadedCrop;
        bctx.drawImage(uploadedImage, sx, sy, size, size, 0, 0, buffer.width, buffer.height);
        if (overlay.complete) bctx.drawImage(overlay, 0, 0, buffer.width, buffer.height);
        if (topOverlay.complete) bctx.drawImage(topOverlay, 0, 0, buffer.width, buffer.height);
        drawBufferToVisible();
    }

    function setOverlayByValue(value){
        overlay.src = `images/${value}.PNG`;
        if (overlay.complete){
            if (uploadedImage) redrawBaseAndOverlay();
            else drawBufferToVisible();
        }
    }

    overlay.onload = function(){
        if (uploadedImage) redrawBaseAndOverlay();
        else drawBufferToVisible();
    }

    topOverlay.onload = function(){ if (uploadedImage) redrawBaseAndOverlay(); }

    upload.addEventListener('change', function(e){
        const file = e.target.files[0]; if (!file) return;
        const reader = new FileReader();
        reader.onload = function(ev){
            const img = new Image();
            img.onload = function(){
                let size = Math.min(img.width, img.height);
                let sx = (img.width - size)/2;
                let sy = (img.height - size)/2;
                uploadedImage = img;
                uploadedCrop = { sx, sy, size };
                bctx.clearRect(0,0,buffer.width,buffer.height);
                bctx.drawImage(img, sx, sy, size, size, 0, 0, buffer.width, buffer.height);
                if (overlay.complete) bctx.drawImage(overlay, 0, 0, buffer.width, buffer.height);
                if (topOverlay.complete) bctx.drawImage(topOverlay, 0, 0, buffer.width, buffer.height);
                drawBufferToVisible();
            }
            img.src = ev.target.result;
        }
        reader.readAsDataURL(file);
    });

    document.getElementById('download').addEventListener('click', function(){
        const link = document.createElement('a');
        link.download = 'edited-image.png';
        // download high-res buffer
        link.href = buffer.toDataURL();
        link.click();
    });

    // wire radios
    const overlayRadios = document.querySelectorAll('input[name="overlayChoice"]');
    overlayRadios.forEach(r => r.addEventListener('change', function(){ if (this.checked) setOverlayByValue(this.value); }));
    const initial = document.querySelector('input[name="overlayChoice"]:checked');
    setOverlayByValue(initial ? initial.value : 'groovist');
}

export default { initEditor };
