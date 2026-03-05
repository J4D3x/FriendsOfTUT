


// Countdown timer that updates the element with id "dateTime".
// By default it counts down to the next midnight. You can start a custom
// countdown by calling `startCountdown('2026-12-31T23:59:59')` or passing any
// value accepted by `new Date(...)`.

// support multiple simultaneous countdowns keyed by element id
    document.getElementById("editorPage").hidden=true;
    document.getElementById('infoPage').hidden = true;
    document.getElementById('contactPage').hidden = true;

let countdownIntervals = {};

function getDefaultTarget() {
	// Default target: Saturday, 14 March 2026 at 00:00:00
	// (updated per user's request)
	return new Date('2026-03-14T00:00:00');
}

function formatTimePart(n) {
	return n.toString().padStart(2, '0');
}

function startCountdown(target, elementId = 'dateTime') {
	// clear existing interval for this element, if any
	if (countdownIntervals[elementId]) {
		clearInterval(countdownIntervals[elementId]);
		delete countdownIntervals[elementId];
	}

	const targetDate = target ? new Date(target) : getDefaultTarget();
	if (isNaN(targetDate.getTime())) {
		console.warn('Invalid target date for countdown:', target);
		return;
	}

	function update() {
		const now = new Date();
		let diff = targetDate.getTime() - now.getTime();
		const el = document.getElementById(elementId);
		if (!el) {
			// nothing to update, stop the timer for this element
			if (countdownIntervals[elementId]) {
				clearInterval(countdownIntervals[elementId]);
				delete countdownIntervals[elementId];
			}
			return;
		}

		if (diff <= 0) {
			el.textContent = "Time's up!";
			if (countdownIntervals[elementId]) {
				clearInterval(countdownIntervals[elementId]);
				delete countdownIntervals[elementId];
			}
			return;
		}

		// compute days, hours, minutes, seconds
		const days = Math.floor(diff / (1000 * 60 * 60 * 24));
		diff -= days * 1000 * 60 * 60 * 24;
		const hours = Math.floor(diff / (1000 * 60 * 60));
		diff -= hours * 1000 * 60 * 60;
		const minutes = Math.floor(diff / (1000 * 60));
		diff -= minutes * 1000 * 60;
		const seconds = Math.floor(diff / 1000);

		// format: days, HH:MM:SS
		el.textContent = `${days} Days, ${formatTimePart(hours)}:${formatTimePart(minutes)}:${formatTimePart(seconds)}`;
	}

	// run immediately then every second and store the interval
	update();
	countdownIntervals[elementId] = setInterval(update, 1000);
}

// expose startCountdown to global scope for easy testing/customization
window.startCountdown = startCountdown;

// start default countdown (to Saturday 07 March 2026) for #dateTime
startCountdown();

// create a second countdown for element id "dateTime2" ending 27 March 2026
startCountdown('2026-03-27T00:00:00', 'dateTime2');

function updateProperty(){

	const body = document.body;
	if (!body) return;

	if (window.innerWidth > 500) {
		// example style when wide
		body.style.backgroundAttachment= "scroll";
	} else {
		// reset to default / stylesheet-defined value when smaller
		body.style.backgroundAttachment = 'fixed';
	}
}

// Listen for window resize and update initially
window.addEventListener('resize', updateProperty);
updateProperty();
function onStart(){

    
}
let homeIcon = document.getElementById('homeIcon');
let infoIcon = document.getElementById('infoIcon');
let contactIcon = document.getElementById('contactIcon');


    

function updateOnOff1(){
    document.body.style.backgroundImage="linear-gradient(rgba(0, 0, 0, 0.49)), url(images/background1.jpg)";
    document.getElementById('mainPage').hidden = false;
    document.getElementById('editorPage').hidden=true;
    document.getElementById('infoPage').hidden = true;
    document.getElementById('contactPage').hidden = true;

}
function updateOnOff2(){
    document.body.style.backgroundImage="none";
    document.body.style.backgroundColor="black";
    document.getElementById('contactPage').hidden = true;
    document.getElementById('editorPage').hidden=true;
    document.getElementById('mainPage').hidden = true;
    document.getElementById('infoPage').hidden = false;

}
function updateOnOff3(){
    document.body.style.backgroundImage="linear-gradient(rgba(0, 0, 0, 0.49)), url(images/background1.jpg)";
    document.getElementById('contactPage').hidden = false;
    document.getElementById('mainPage').hidden = true;
    document.getElementById('infoPage').hidden = true;
    document.getElementById('editorPage').hidden=true;
    
}
function updateOnOff4(){
    document.body.style.backgroundImage="linear-gradient(rgba(0, 0, 0, 0.49)), url(images/background1.jpg)";
    document.getElementById('contactPage').hidden = true;
    document.getElementById('editorPage').hidden=false;
    document.getElementById('mainPage').hidden = true;
    document.getElementById('infoPage').hidden = true;
}


const upload = document.getElementById("upload")
const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

// store uploaded image and crop params so we can redraw base when overlay changes
let uploadedImage = null;
let uploadedCrop = null;

// offscreen high-resolution buffer (1000x1000) — used so we can crop to 1000px
const buffer = document.createElement('canvas');
buffer.width = 1000;
buffer.height = 1000;
const bctx = buffer.getContext('2d');




// overlay image used on top of uploaded image; we'll swap its src when radios change
const overlay = new Image();

// a second, fixed top overlay that always draws above the selectable overlay
const topOverlay = new Image();
// default top overlay file (place this image in images/)
topOverlay.src = 'images/mainOverlay2.PNG';

// when top overlay loads, redraw if we have a base image
topOverlay.onload = function(){
	if (uploadedImage) redrawBaseAndOverlay();
}

function drawOverlay(){
	if (!buffer || !bctx) return;
	if (!overlay.complete) return;
	// draw selectable overlay to cover the whole high-res buffer
	bctx.drawImage(overlay, 0, 0, buffer.width, buffer.height);
	// draw the fixed top overlay above it (if available)
	if (topOverlay.complete) bctx.drawImage(topOverlay, 0, 0, buffer.width, buffer.height);
	// copy high-res buffer down to visible canvas (scale to visible canvas size)
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.drawImage(buffer, 0, 0, buffer.width, buffer.height, 0, 0, canvas.width, canvas.height);
}

// redraw the uploaded (base) image then overlay (used when switching overlays)
function redrawBaseAndOverlay(){
	if (!uploadedImage) return;
	// clear buffer
	bctx.clearRect(0, 0, buffer.width, buffer.height);
	// redraw the cropped base image into the high-res buffer (1000x1000)
	const { sx, sy, size } = uploadedCrop;
	bctx.drawImage(uploadedImage, sx, sy, size, size, 0, 0, buffer.width, buffer.height);
	// draw overlay on top into buffer if ready
	if (overlay.complete) bctx.drawImage(overlay, 0, 0, buffer.width, buffer.height);
	// draw the fixed top overlay on top of the selectable overlay if ready
	if (topOverlay.complete) bctx.drawImage(topOverlay, 0, 0, buffer.width, buffer.height);
	// copy high-res buffer down to visible canvas (scale to visible canvas size)
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.drawImage(buffer, 0, 0, buffer.width, buffer.height, 0, 0, canvas.width, canvas.height);
}

function setOverlayByValue(value){
	// value expected like 'groovist' -> images/overlay_groovist.PNG
	overlay.src = `images/${value}.PNG`;
	// If already loaded (cached), redraw base+overlay so the new overlay replaces the previous one
	if (overlay.complete){
		if (uploadedImage) redrawBaseAndOverlay();
		else drawOverlay();
	}
}

// when overlay image finishes loading, redraw base+overlay so switching overlays replaces the prior one
overlay.onload = function(){
	if (uploadedImage) redrawBaseAndOverlay();
	else drawOverlay();
}

upload.addEventListener("change", function(e){

const file = e.target.files[0]

if(!file) return

const reader = new FileReader()

reader.onload = function(event){

const img = new Image()

img.onload = function(){

	// Calculate center crop
	let size = Math.min(img.width, img.height)
	let sx = (img.width - size)/2
	let sy = (img.height - size)/2

	// Store uploaded image and crop for later redraws
	uploadedImage = img;
	uploadedCrop = { sx, sy, size };

	// Draw cropped image into the high-res buffer (1000x1000)
	bctx.clearRect(0, 0, buffer.width, buffer.height);
	bctx.drawImage(img, sx, sy, size, size, 0, 0, buffer.width, buffer.height);

	// Draw overlay into buffer if ready
	if (overlay.complete) bctx.drawImage(overlay, 0, 0, buffer.width, buffer.height);
	// draw the fixed top overlay as well if available
	if (topOverlay.complete) bctx.drawImage(topOverlay, 0, 0, buffer.width, buffer.height);

	// Finally copy high-res buffer into visible canvas (scaled)
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.drawImage(buffer, 0, 0, buffer.width, buffer.height, 0, 0, canvas.width, canvas.height);

}

img.src = event.target.result

}

reader.readAsDataURL(file)

})

document.getElementById("download").addEventListener("click", function(){

const link = document.createElement("a")
link.download = "edited-image.png"
// download the high-res 1000x1000 buffer if available, otherwise fallback to visible canvas
link.href = buffer ? buffer.toDataURL() : canvas.toDataURL()
link.click()

})

// wire radios that choose the overlay
const overlayRadios = document.querySelectorAll('input[name="overlayChoice"]');
overlayRadios.forEach(r => r.addEventListener('change', function(){
	if (this.checked) setOverlayByValue(this.value);
}));

// set initial overlay based on checked radio (default to groovist)
const initial = document.querySelector('input[name="overlayChoice"]:checked');
setOverlayByValue(initial ? initial.value : 'groovist');