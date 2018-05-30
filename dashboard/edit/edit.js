"use strict";

// Inputs
const gameTitle     = document.getElementById("game-title");
const gameYear      = document.getElementById("game-year");
const gamePlatform  = document.getElementById("game-platform");
const runCategory   = document.getElementById("run-category");
const runEstimate   = document.getElementById("run-estimate");
const runner1       = document.getElementById("runner1");
const runner1Twitch = document.getElementById("runner1-twitch");
const runner2       = document.getElementById("runner2");
const runner2Twitch = document.getElementById("runner2-twitch");
const runner3       = document.getElementById("runner3");
const runner3Twitch = document.getElementById("runner3-twitch");
const runner4       = document.getElementById("runner4");
const runner4Twitch = document.getElementById("runner4-twitch");

// Replicant
const schedule = nodecg.Replicant("schedule");

const formatNames = (...names) => {
	const nameArr = Array.from(names).filter(Boolean);

	if (nameArr.length == 1) {
		return nameArr[0];
	}

	if (nameArr.length == 2) {
		return nameArr[0] + " & " + nameArr[1];
	}

	if (nameArr.length > 2) {
		return nameArr[0] + ", " + formatNames(...nameArr.slice(1));
	}
};

// Update the inputs with the values of the given run
const pushRun = (run) => {
	// Using || "" to coerce undefined or null values to empty string
	gameTitle.value     = run.game          || "";
	gameYear.value      = run.gameYear      || "";
	gamePlatform.value  = run.gamePlatform  || "";
	runCategory.value   = run.category      || "";
	runEstimate.value   = run.estimate      || "";
	runner1.value       = run.runner1       || "";
	runner1Twitch.value = run.runner1Twitch || "";
	runner2.value       = run.runner2       || "";
	runner2Twitch.value = run.runner2Twitch || "";
	runner3.value       = run.runner3       || "";
	runner3Twitch.value = run.runner3Twitch || "";
	runner4.value       = run.runner4       || "";
	runner4Twitch.value = run.runner4Twitch || "";
};

// Return a run from the values of the inputs
const pullRun = () => {
	return {
		game:           gameTitle.value,
		gameYear:       gameYear.value,
		gamePlatform:   gamePlatform.value,
		category:       runCategory.value,
		estimate:       runEstimate.value,
		runner1:        runner1.value,
		runner1Twitch:  runner1Twitch.value,
		runner2:        runner2.value,
		runner2Twitch:  runner2Twitch.value,
		runner3:        runner3.value,
		runner3Twitch:  runner3Twitch.value,
		runner4:        runner4.value,
		runner4Twitch:  runner4Twitch.value,
		formattedNames: formatNames(runner1.value, runner2.value, runner3.value, runner4.value)
	};
};

const update = (sched) => {
	const e = sched.edit;
	let run = sched.entries[e];
	if (!run) {
		console.log("Editing empty run");
		run = {};
	}
	pushRun(run);
};

schedule.on("change", (newVal, oldVal) => {
	update(newVal);
});


document.addEventListener("dialog-confirmed", () => {
	const e = schedule.value.edit;
	schedule.value.entries[e] = pullRun();
});

