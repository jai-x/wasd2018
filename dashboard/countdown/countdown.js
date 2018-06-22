"use strict";

const countdown = nodecg.Replicant("countdown");

class CountdownApp {
	constructor() {
		this.timeInput = "15:00";
	}

	view() {
		if (!countdown.value) {
			return m(".wasd-row", "Loading...");
		}

		if (countdown.value.running) {
			return [
				m(".wasd-row#countdown-display", countdown.value.time),
				m(".wasd-row",
					m("button.button", {
						onclick: () => nodecg.sendMessage("stopCountdown")
					}, "Stop")
				),
			];
		} else {
			return [
				m(".wasd-row",
					m("input.input#countdown-edit", {
						value: this.timeInput,
						oninput: m.withAttr("value", (v) => this.timeInput = v),
					})
				),
				m(".wasd-row",
					m("button.button", {
						onclick: () => nodecg.sendMessage("startCountdown", this.timeInput)
					}, "Start")
				)
			]
		}
	};
};

m.mount(document.body, CountdownApp);
countdown.on("change", m.redraw);
