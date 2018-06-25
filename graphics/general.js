"use strict";

// Information elements
const gameTitle    = document.getElementById("game-title");
const runCategory  = document.getElementById("run-category");
const gamePlatform = document.getElementById("game-platform");
const gameYear     = document.getElementById("game-year");
const runEstimate  = document.getElementById("run-estimate");
const runners      = document.getElementById("runners");

// Timer element
const timer = document.getElementById("timer");

// Replicants
const schedule  = nodecg.Replicant("schedule");
const stopwatch = nodecg.Replicant("stopwatch");

schedule.on("change", (newVal, oldVal) => {
	const run = newVal.entries[newVal.current];

	if (!run) {
		console.log("Current run is empty");
	}

	gameTitle.textContent    = run.game;
	runCategory.textContent  = run.category;
	gamePlatform.textContent = run.gamePlatform;
	gameYear.textContent     = run.gameYear;
	runEstimate.textContent  = run.estimate;
	runners.textContent      = run.formattedNames;
});

// flash timer to mark start of timing
const flashTimer = () => {
	anime({
		// See graphics-base.css for color definitions
		targets: "#timer",
		backgroundColor: [
			{value: "#3D53FF"}, // UWCS Blue
			{value: "#E4E8FF"}  // UWCS White Blue
		],
		color: [
			{value: "#FFFFFF"},
			{value: "#000000"}
		],
		direction: "alternate",
		duration: 1000,
		easing: "easeInOutSine"
	});
};

stopwatch.on("change", (newVal, oldVal) => {
	timer.textContent = newVal.time;

	// oldVal may be undefined if this is the first update of the Replicant
	if (!oldVal) {
		return;
	}

	// transition "reset" -> "running" = flash
	if (oldVal.displayState == "reset" && newVal.displayState == "running") {
		flashTimer();
	}
});


