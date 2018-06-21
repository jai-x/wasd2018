"use strict";

const EventEmitter = require("events");
const msToObj      = require("parse-ms");
const unitToMs     = require("milliseconds");

/*
 * Timestring can be in the format
 * SS
 * MM:SS
 * HH:MM:SS */

module.exports = {
	timeStringtoMs: (timeString) => {
		if (typeof timeString != "string") {
			throw new TypeError("Expected a string");
		}

		const parts = timeString.split(":").map((part) => part.trim());

		// y tho
		if (parts.length == 0) {
			return 0;
		}

		// Only seconds
		if (parts.length == 1) {
			return unitToMs.seconds(Number(parts[0]));
		}

		// Minutes and seconds
		if (parts.length == 2) {
			let ms = 0;
			ms += unitToMs.minutes(Number(parts[0]));
			ms += unitToMs.seconds(Number(parts[1]));
			return ms;
		}

		// Hours, minutes, and seconds
		if (parts.length == 3) {
			let ms = 0;
			ms += unitToMs.hours(Number(parts[0]));
			ms += unitToMs.minutes(Number(parts[1]))
			ms += unitToMs.seconds(Number(parts[2]));
			return ms;
		}

		// 0w0
		throw new Error("Unexpected timeString format:", timeString);
	},

	msToTimeString: (ms) => {
		const timeObj = msToObj(ms);
		const hrs = (timeObj.hours == 0) ? null : String(timeObj.hours).padStart(2, "0");
		const min = String(timeObj.minutes).padStart(2, "0");
		const sec = String(timeObj.seconds).padStart(2, "0");
		return new Array(hrs, min, sec).filter(Boolean).join(":");
	},

	// Each tick returns ms left until end
	CountdownTimer: class CountdownTimer extends EventEmitter {
		constructor(durationMs) {
			if (typeof durationMs != "number") {
				throw new TypeError("Expected number");
			}
			super();
			const endTimeMs = Date.now() + durationMs;
			this._ticker = setInterval(() => {
				const currentTimeMs = Date.now();
				const remainingMs   = Math.max(endTimeMs - currentTimeMs, 0);
				this.emit("tick", remainingMs);
				if (remainingMs <= 0) {
					this.stop();
				}
			}, 100);
		};
	
		stop() {
			clearInterval(this._ticker);
			this.emit("done");
		};
	},
};
