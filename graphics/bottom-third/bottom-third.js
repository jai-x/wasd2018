"use strict";

const interview = nodecg.Replicant("interview");

interview.on("change", (newVal, oldVal) => {
	const container = document.getElementById('bottom-third-container');
	container.innerHTML = null;

	for(const person of newVal) {
		const banner = document.createElement('div');
		banner.classList.add('banner');
		banner.appendChild(document.createTextNode(person.name));
		container.appendChild(banner);
	}
});
