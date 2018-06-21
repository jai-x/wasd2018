"use strict";

/* Nodecg context */
const nodecg = require("./util/nodecg-api-context").get();

/* Replicants */
const countdown = nodecg.Replicant("countdown");

/* Libraries */
const timeUtils = require("./util/time");

let countdownInstance;

/* Functions */
const start = (timeString) => {
	if (countdownInstance) {
		countdownInstance.stop();
		countdownInstance.removeAllListeners();
	}

	const ms = timeUtils.timeStringtoMs(timeString);
	countdownInstance = new timeUtils.CountdownTimer(ms);
	countdownInstance.on("tick", (ms) => {
		nodecg.log.debug("Tick:", timeUtils.msToTimeString(ms));
	});
	countdownInstance.on("done", () => nodecg.log.debug("Done"));
};

const stop = () => {
	if (countdownInstance) {
		countdownInstance.stop();
	}
};

/* Nodecg listeners */
nodecg.listenFor("startCountdown", start);
nodecg.listenFor("stopCountdown", stop);
