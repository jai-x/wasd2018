"use strict";

const showLabel = anime({
	targets: "#label",
	easing: "easeOutCubic",
	translateX: [-140, -35],
	duration: 500,
	autoplay: false
});

const next = anime.timeline({autoplay: false})
	.add({
		targets: "#next",
		easing: "easeOutCubic",
		translateX: [-1000, 120],
		duration: 1000
	})
	.add({
		duration: 3000
	})
	.add({
		targets: "#next-game",
		easing: "easeOutCubic",
		translateY: -50,
		duration: 500
	})
	.add({
		targets: "#next-info",
		easing: "easeOutCubic",
		translateY: 50,
		duration: 500,
		offset: "-=500",
	});

const cta = anime.timeline({autoplay: false})
	// Slide up to full WASD
	.add({
		targets: "#cta",
		easing: "easeOutCubic",
		translateY: [72, 0],
		duration: 500,
	})
	// Pause
	.add({
		duration: 6000
	})
	// Fade words to acronym
	.add({
		targets: ".wasd-word",
		easing: "linear",
		duration: 500,
		opacity: [1, 0],
	})
	// Move W in
	.add({
		targets: "#wasd-w",
		easing: "easeOutCubic",
		duration: 500,
		translateX: 315,
	})
	// Move A in
	.add({
		targets: "#wasd-a",
		easing: "easeOutCubic",
		duration: 500,
		translateX: 160,
		offset: "-=500",
	})
	// Move D in
	.add({
		targets: "#wasd-d",
		easing: "easeOutCubic",
		duration: 500,
		translateX: -215,
		offset: "-=500",
	})
	// Move 2018 in
	.add({
		targets: "#wasd-year",
		easing: "easeOutCubic",
		duration: 500,
		translateX: -315,
		offset: "-=500",
	})
	// Pause on acronym
	.add({
		duration: 6000
	})
	// Slide up to raising money
	.add({
		targets: "#cta",
		easing: "easeOutCubic",
		duration: 500,
		translateY: -72
	})
	// Pause on raising money
	.add({
		duration: 6000
	})
	// Slide up to donate link
	.add({
		targets: "#cta",
		easing: "easeOutCubic",
		duration: 500,
		translateY: -144
	})
	// Pause on donate link
	.add({
		duration: 6000
	})
	// Slide out
	.add({
		targets: "#cta",
		easing: "easeOutCubic",
		duration: 500,
		translateY: -214,
	});

const sleep = (ms) => {
	return new Promise(resolve => setTimeout(resolve, ms + 10));
};

const main = async () => {
	cta.restart();
	await sleep(cta.duration);

	showLabel.play();
	await sleep(showLabel.duration);

	next.restart();
	await sleep(next.duration);

	next.restart();
	await sleep(next.duration);

	next.restart();
	await sleep(next.duration);

	showLabel.play();
	showLabel.reverse();
	await sleep(showLabel.duration);
	showLabel.reset();

	main();
};
