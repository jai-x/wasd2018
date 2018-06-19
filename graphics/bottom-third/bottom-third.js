"use strict";

const interview = nodecg.Replicant("interview");

const makeTwitchIcon = () => {
	const icon = document.createElement("img");
	icon.setAttribute("src", "../img/twitch-icon.svg");
	icon.classList.add("twitch-icon");
	return icon;
};

const makeDivText = (text) => {
	const node = document.createElement("div");
	const txt = document.createTextNode(text);
	node.appendChild(txt);
	return node;
};

const makeDivWithClass = (cls) => {
	const div = document.createElement("div");
	div.classList.add(cls);
	return div;
};

interview.on("change", (newVal, oldVal) => {
	const container = document.getElementById("bottom-third-container");
	container.innerHTML = null;

	for(const person of newVal) {
		const banner = makeDivWithClass("banner");
		banner.appendChild(makeDivText(person.name));
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
