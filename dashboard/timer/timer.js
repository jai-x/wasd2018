"use strict";

/* Replicants */
const stopwatch = nodecg.Replicant("stopwatch");

class Stopwatch {
	view() {
		if (!stopwatch.value) {
			return m(".wasd-row", "Loading...");
		}

		const time = stopwatch.value.time;
		const state = stopwatch.value.displayState;

		return [
			m(".wasd-row", m("." + state + "#stopwatch-display", time)),
			m(".wasd-row", [
				m("button.button is-success stopwatch-button", {
					onclick: this.start,
					disabled: (state == "running")
				}, "START"),
				m("button.button is-warning stopwatch-button", {
					onclick: this.pause,
					disabled: (state != "running")
				}, "PAUSE"),
				m("button.button is-danger stopwatch-button", {
					onclick: this.reset,
					disabled: (state != "paused")
				}, "RESET")
			]),
		];
	};

	start() { nodecg.sendMessage("startStopwatch"); };
	pause() { nodecg.sendMessage("pauseStopwatch"); };
	reset() { nodecg.sendMessage("resetStopwatch"); };
};

m.mount(document.body, Stopwatch);
stopwatch.on("change", m.redraw);
