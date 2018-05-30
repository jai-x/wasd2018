"use strict";

// Constants
const maxWidth = 1920;
const maxHeight = 982;
const maxBGElements = 50;
const bgClasses = ["cross", "rectangle", "oval", "triangle"];

// Replicant
const schedule = nodecg.Replicant("schedule");

schedule.on("change", (newVal, oldVal) => {
	const n = newVal.current + 1;
	const nextRun = newVal.entries[n];
});

const plusOrMinus = () => Math.random() < 0.5 ? -1 : 1;

const generateBG = () => {
	const frag = document.createDocumentFragment();
	const elementArr = new Array();
	for(let i = 0; i < maxBGElements; i++) {
		const e = document.createElement("div");
		e.classList.add("bg", bgClasses[anime.random(0, bgClasses.length)]);
		e.style.left = anime.random(0, maxWidth) + "px";
		e.style.top = anime.random(0, maxHeight) + "px";
		frag.appendChild(e);
		elementArr.push(e);
	}
	document.getElementById("layout").appendChild(frag);
	return elementArr;
};

const animateBG = (el, i) => {
	anime({
		targets: el,
		translateX: anime.random(10, 300) * plusOrMinus(),
		translateY: anime.random(10, 200) * plusOrMinus(),
		duration: 15000,
		direction: "alternate",
		offset: 500 * i,
		loop: true,
		easing: "easeInOutSine",
	});
};

generateBG().forEach(animateBG);
