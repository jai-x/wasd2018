"use strict";

// Schedule management extension
module.exports = (nodecg) => {
	const schedule = nodecg.Replicant("schedule");

	// Move an element at `index` in `delta` places
	const move = (index, delta) => {
		const newIndex = index + delta;	
		if (newIndex < 0 || newIndex > schedule.value.entries.length) {
			nodecg.log.error("Attempted to move schedule entry out of array bounds");
			return;
		}

		// Simple swap
		const tmp = schedule.value.entries[index];
		schedule.value.entries[index] = schedule.value.entries[newIndex];
		schedule.value.entries[newIndex] = tmp;
	};

	// Delete schedule entry at given index
	nodecg.listenFor("scheduleDelete", (index) => {
		schedule.value.entries.splice(index, 1);
	});

	// Set the edit index
	nodecg.listenFor("scheduleEdit", (index) => {
		schedule.value.edit = index;;
	});

	// Set the edit index to edit a new entry
	nodecg.listenFor("scheduleEditNew", () => {
		if (schedule.value.entries.length == 0) {
			schedule.value.edit = 0
		} else {
			schedule.value.edit = schedule.value.entries.length;
		}
	});

	// Set the current index
	nodecg.listenFor("scheduleCurrent", (index) => {
		schedule.value.current = index;
	});

	// Move the run at the given index forward one
	nodecg.listenFor("scheduleMoveForward", (index) => {
		move(index, 1);
	});

	// Move the run at the given index back one
	nodecg.listenFor("scheduleMoveBack", (index) => {
		move(index, -1);
	});

	// Advance the schedule
	nodecg.listenFor("scheduleCurrentForward", () => {
		if (schedule.value.current < schedule.value.entries.length) {
			schedule.value.current++;
		}
	});

	// Push the schedule back
	nodecg.listenFor("scheduleCurrentBack", () => {
		if (schedule.value.current > 0) {
			schedule.value.current--;
		}
	});

	nodecg.log.info("schedule extension loaded");

	/* test value
	schedule.value.entries[0] = {
		game:          "Rise of the Tomb Raider",
		gameYear:      "2015",
		gamePlatform:  "PC",
		category:      "Any% Glitched",
		estimate:      "1:00:00",
		runner1:       "zed0"
	};*/
};
