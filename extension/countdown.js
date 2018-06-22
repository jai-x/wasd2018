"use strict";

/* Nodecg context */
const nodecg = require("./util/nodecg-api-context").get();

/* Replicants */
const countdown = nodecg.Replicant("countdown");

/* Libraries */
const timeUtils = require("./util/time");

let instance;

/* Functions */
// Start the countdown of duration given by the timestring
const start = (timeString) => {
	if (countdown.value.running) {
		return;
	}

	if (instance) {
		instance.stop();
		instance.removeAllListeners();
	}

	countdown.value.running = true;

	const ms = timeUtils.timeStringtoMs(timeString);
	instance = new timeUtils.CountdownTimer(ms);

	instance.on("tick", (ms) => countdown.value.time = timeUtils.msToTimeString(ms));
	instance.on("done", () => countdown.value.running = false);
};

const stop = () => {
	if (!countdown.value.running) {
		return;
	};

	countdown.value.running = false;

	if (instance) {
		instance.stop();
	}
};

/* Nodecg listeners */
nodecg.listenFor("startCountdown", start);
nodecg.listenFor("stopCountdown", stop);
