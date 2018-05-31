"use strict";

// Replicant
const schedule = nodecg.Replicant("schedule");

schedule.on("change", (newVal, oldVal) => {
	const n = newVal.current + 1;
	const nextRun = newVal.entries[n];
});




// Helper functions
const randFloat = (min, max) => (Math.random() * (max - min) + min).toFixed(1);
const randInt = (min, max) => anime.random(min, max);
const plusOrMinus = () => Math.random() < 0.5 ? -1 : 1;
const deviation = (min, max) => randInt(min, max) * plusOrMinus();

// Generate random background elements, add them to the document and return
// an array of the elements
const generateBG = () => {
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
			e.classList.add("bg", bgClasses[randInt(0, bgClasses.length - 1)]);
			e.style.left = (xSpacing * x) + offset + deviation(10, 100) + "px";
			e.style.top = (ySpacing * y) + offset + deviation(10, 60) + "px";
			frag.appendChild(e);
			elementArr.push(e);
		}
	}

	document.getElementById("break").appendChild(frag);
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
generateBG().forEach(animateBG);
