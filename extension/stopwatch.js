"use strict";

/* Nodecg context */
const nodecg = require("./util/nodecg-api-context").get();

/* Replicants */
const stopwatchRep = nodecg.Replicant("stopwatch");

/* Libraries */
const lsCore = require("livesplit-core");

// livesplit-core library constants
const LS_STOPWATCH_PHASE = {
	NotRunning: 0,
	Running:    1,
	Ended:      2,
	Paused:     3
};

/* Functions */
// zero-pad a string to max 2 characters
const padInt = (num) => {
	let str = num.toString();
	while(str.length < 2) {
		str = '0' + str;
	}
	return str;
};

// convert seconds (integer) to a time string
const secondsToTimeString = (seconds) => {
	const secs = padInt( Math.floor(seconds % 60)          );
	const mins = padInt( Math.floor((seconds / 60) % 60)   );
	const hour = padInt( Math.floor((seconds / 3600) % 24) );
	return hour + ":" + mins + ":" + secs;
};

// push stopwatch updates to replicant stopwatchRep
const update = () => {
	const seconds = stopwatch.currentTime().gameTime().totalSeconds();
	stopwatchRep.value.time = secondsToTimeString(seconds);
};

// schedule updates to display
const tick = () => {
	// don't run if no gameTime available
	if (!stopwatch.currentTime().gameTime())
		return;
	update();
};

// start or unpause stopwatch
const start = () => {
	if (stopwatch.currentPhase() == LS_STOPWATCH_PHASE.NotRunning) {
		stopwatch.start();
		// game time must be set after stopwatch has been started
		stopwatchInitGameTime(0);
	} else {
		stopwatch.resume();
	}
	stopwatchRep.value.displayState = "running";
	update();
};

// pause stopwatch
const pause = () => {
	// dont pause if not running
	if (stopwatch.currentPhase() == LS_STOPWATCH_PHASE.NotRunning)
		return;

	stopwatch.pause();
	stopwatchRep.value.displayState = "paused";
	update();
};

// reset stopwatch
const reset = () => {
	// don't reset while running
	if (stopwatch.currentPhase() == LS_STOPWATCH_PHASE.Running)
		return;

	stopwatch.pause();
	stopwatch.reset(true);
	stopwatchRep.value.displayState = "reset";
	update();
}

// set the stopwatch game time to the given value int ms
const stopwatchInitGameTime = (ms) => {
	lsCore.TimeSpan.fromSeconds(0).with(t => stopwatch.setLoadingTimes(t));
	stopwatch.initializeGameTime();
	lsCore.TimeSpan.fromSeconds((ms/1000)).with(t => stopwatch.setGameTime(t));
};

/* Setup */
// create a run with a single segment `finish`
const lsRun = lsCore.Run.new();
lsRun.pushSegment(lsCore.Segment.new("finish"));

// create a stopwatch and add the sigment
const stopwatch = lsCore.Timer.new(lsRun);

// update replicant @ 10hz
setInterval(tick, 100);

// prevent invalid state on startip
reset();

/* Nodecg listeners */
nodecg.listenFor("startStopwatch", start);
nodecg.listenFor("pauseStopwatch", pause);
nodecg.listenFor("resetStopwatch", reset);
