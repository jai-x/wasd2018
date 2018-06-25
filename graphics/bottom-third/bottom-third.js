"use strict";

const interview = nodecg.Replicant("interview");

const makeTwitchIcon = () => {
	const icon = document.createElement("div");
	icon.classList.add("icon");
	icon.classList.add("twitch");
	return icon;
};

const makeDivText = (text, cls) => {
	const node = document.createElement("div");
	const txt = document.createTextNode(text);
	if (cls) {
		node.classList.add(cls);
	}
	node.appendChild(txt);
	return node;
};

const makeDivWithClass = (cls) => {
	const div = document.createElement("div");
	div.classList.add(cls);
	return div;
};

interview.on("change", (newVal, oldVal) => {
	const container = document.getElementById("bottom-third");
	container.innerHTML = null;

	for(const person of newVal) {
		const banner = makeDivWithClass("banner");
		banner.appendChild(makeDivText(person.name, "shadow"));
		// Only add twitch div if a twitch name is present
		if (person.twitch) {
			const twitch = makeDivWithClass("twitch");
			twitch.appendChild(makeTwitchIcon());
			twitch.appendChild(makeDivText(person.twitch));
			banner.appendChild(twitch);
		}
		container.appendChild(banner);
	}
});

const bottomThirdAnim = new class {
	constructor() {
		this.anim = anime({
			targets: "#bottom-third",
			translateY: [
				{value: 390, duration:   0},
				{value:   0, duration: 700},
				{value: 390, duration: 700},
			],
			easing: "easeOutCubic",
			autoplay: false
		});
	};

	show() {
		this.anim.reset();
		this.anim.update = (anim) => {
			if (Math.round(anim.progress) == 50) {
				anim.pause();
			}
		};
		this.anim.play();
	};

	hide() {
		this.anim.update = null;
		this.anim.play();
	};
};

nodecg.listenFor("bottom-third-show", () => bottomThirdAnim.show());
nodecg.listenFor("bottom-third-hide", () => bottomThirdAnim.hide());
