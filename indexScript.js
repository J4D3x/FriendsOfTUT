


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

/**
 * Load images with data-src inside `container` by swapping data-src -> src.
 * Use this to avoid loading images that are inside hidden sections until shown.
 */
function loadDeferredIn(container){
	if (!container) return;
	const imgs = container.querySelectorAll('img[data-src]');
	imgs.forEach(img => {
		if (!img.getAttribute('src')) img.setAttribute('src', img.dataset.src);
		// ensure lazy attribute exists for further optimization
		if (!img.loading) img.loading = 'lazy';
	});
}

// Ensure we also load deferred content when showing other pages
function _showMainPage(){
	document.getElementById('mainPage').hidden = false;
	loadDeferredIn(document.getElementById('mainPage'));
}

function _showInfoPage(){
	document.getElementById('infoPage').hidden = false;
	loadDeferredIn(document.getElementById('infoPage'));
}

function _showContactPage(){
	document.getElementById('contactPage').hidden = false;
	loadDeferredIn(document.getElementById('contactPage'));
}

// update other page toggle functions to use the deferred loader
// (keep names for external callers)
function updateOnOff1(){
	document.body.style.backgroundImage="linear-gradient(rgba(0, 0, 0, 0.49)), url(images/background1.jpg)";
	document.getElementById('mainPage').hidden = false;
	document.getElementById('editorPage').hidden=true;
	document.getElementById('infoPage').hidden = true;
	document.getElementById('contactPage').hidden = true;
	loadDeferredIn(document.getElementById('mainPage'));
}
function updateOnOff2(){
	document.body.style.backgroundImage="none";
	document.body.style.backgroundColor="black";
	document.getElementById('contactPage').hidden = true;
	document.getElementById('editorPage').hidden=true;
	document.getElementById('mainPage').hidden = true;
	document.getElementById('infoPage').hidden = false;
	loadDeferredIn(document.getElementById('infoPage'));
}
function updateOnOff3(){
	document.body.style.backgroundImage="linear-gradient(rgba(0, 0, 0, 0.49)), url(images/background1.jpg)";
	document.getElementById('contactPage').hidden = false;
	document.getElementById('mainPage').hidden = true;
	document.getElementById('infoPage').hidden = true;
	document.getElementById('editorPage').hidden=true;
	loadDeferredIn(document.getElementById('contactPage'));
}
function updateOnOff4(){
	document.body.style.backgroundImage="linear-gradient(rgba(0, 0, 0, 0.49)), url(images/background1.jpg)";
	document.getElementById('contactPage').hidden = true;
	document.getElementById('editorPage').hidden=false;
	document.getElementById('mainPage').hidden = true;
	document.getElementById('infoPage').hidden = true;

	// load any deferred images inside the editor section
	loadDeferredIn(document.getElementById('editorPage'));

	// dynamically import the editor module so heavy editor code only loads when needed
	import('./editorModule.js')
		.then(mod => mod.initEditor())
		.catch(err => console.error('Failed to load editor module:', err));
}