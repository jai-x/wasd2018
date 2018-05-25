"use strict";

let init = false;
const stopwatch = nodecg.Replicant("stopwatch");

stopwatch.on("change", () => {
	// mount component on replicant load
	if (!init) {
		m.mount(document.body, Timer);
		init = true;
	}
	// update component on new data
	m.redraw();
});

const start = () => nodecg.sendMessage("startStopwatch");
const pause = () => nodecg.sendMessage("pauseStopwatch");
const reset = () => nodecg.sendMessage("resetStopwatch");

const displayColor = () => {
	const state = stopwatch.value.displayState;

	if (state == "running")
		return "light-green";

	if (state == "paused")
		return "orange";

	return "";
};

class Timer {
	view() {
		return [
			// display
			m("span", {
				id: "timer-display",
				class: displayColor()
			}, stopwatch.value.time),
			m("div",[
				// start
				m("button", {
					class: "green",
					onclick: start,
					disabled: (stopwatch.value.displayState == "running")
				}, "start"),
				// pause
				m("button", {
					class: "orange",
					onclick: pause,
					disabled: (stopwatch.value.displayState != "running")
				}, "pause"),
				// reset
				m("button", {
					class: "red",
					onclick: reset,
					disabled: (stopwatch.value.displayState != "paused")
				}, "reset")
			]),
		];
	};
};
