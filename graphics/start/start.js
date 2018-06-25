"use strict";

// Replicants
const nowplaying = nodecg.Replicant("nowplaying");
const countdown  = nodecg.Replicant("countdown");

countdown.on("change", (newVal, oldVal) => {
	document.getElementById("countdown").textContent = newVal.time;
});

// Update the nowplaying text
nowplaying.on("change", (newVal, oldVal) => {
	const npText = document.getElementById("np-text");
	npText.textContent = newVal;
});

// Helper functions
const randFloat = (min, max) => (Math.random() * (max - min) + min).toFixed(1);
const randInt = (min, max) => anime.random(min, max);
const plusOrMinus = () => Math.random() < 0.5 ? -1 : 1;
const deviation = (min, max) => randInt(min, max) * plusOrMinus();

// Generate random background elements, add them to the document and return
// an array of the elements
const generateBG = (parentId) => {
	const bgClasses = ["cross", "rectangle", "oval", "triangle", "dot"];

	const maxWidth = 1920;
	const maxHeight = 982;
	const offset = 50;

	const bgElemRows = 6;
	const bgElemCols = 9;

	const frag = document.createDocumentFragment();
	const elementArr = new Array();

	const xSpacing = Math.round(maxWidth / bgElemCols);
	const ySpacing = Math.round(maxHeight / bgElemRows);

	for (let x = 0; x < bgElemCols; x++) {
		for (let y = 0; y < bgElemRows; y++) {
			const e = document.createElement("div");
			e.classList.add("floaty", bgClasses[randInt(0, bgClasses.length - 1)]);
			e.style.left = (xSpacing * x) + offset + deviation(10, 100) + "px";
			e.style.top = (ySpacing * y) + offset + deviation(10, 60) + "px";
			frag.appendChild(e);
			elementArr.push(e);
		}
	}

	document.getElementById(parentId).appendChild(frag);
	return elementArr;
};

// Animation function for a given background element
const animateBG = (element) => {
	anime({
		targets: element,
		translateY: deviation(10, 200),
		translateX: [deviation(0, 10), deviation(0, 10)],
		scale: [randFloat(0.5, 1.1), randFloat(0.5, 1.1)],
		opacity: [randFloat(0.2, 0.6), randFloat(0.2, 0.6)],
		duration: 15000,
		direction: "alternate",
		offset: randInt(0, 10000),
		loop: true,
		easing: "easeInOutSine",
	});
};

// Run the generate function and then apply the animation for each element
generateBG("floaties").forEach(animateBG);

// How long each sponsor group should show
const SPONSOR_SHOW = 30000;

// Animate the sponsors
anime.timeline({loop: true})
	.add({
		targets: "#sponsor-group-1",
		opacity: [0, 1],
		duration: 500,
		easing: "linear"
	})
	.add({
		delay: SPONSOR_SHOW,
		targets: "#sponsor-group-1",
		opacity: [1, 0],
		duration: 500,
		easing: "linear"
	})
	.add({
		targets: "#sponsor-group-2",
		opacity: [0, 1],
		duration: 500,
		easing: "linear"
	})
	.add({
		delay: SPONSOR_SHOW,
		targets: "#sponsor-group-2",
		opacity: [1, 0],
		duration: 500,
		easing: "linear"
	});
