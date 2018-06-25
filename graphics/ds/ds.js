"use strict";

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
