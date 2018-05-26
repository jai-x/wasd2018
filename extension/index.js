"use strict";

// Load each extension and supply it with the `nodecg` context
module.exports = (nodecg) => {
	// schedule management
	try {
		require("./schedule")(nodecg);
	} catch (e) {
		nodecg.log.error("Failed to load schedule extension:", e.stack);
		process.exit(1);
	}

	// stopwatch - used for run timers
	try {
		require("./stopwatch")(nodecg);
	} catch (e) {
		nodecg.log.error("Failed to load stopwatch extension:", e.stack);
		process.exit(1);
	}

	// JustGiving api integration
	try {
		require("./justgiving")(nodecg);
	} catch (e) {
		nodecg.log.error("Failed to load justgiving extension:", e.stack);
		process.exit(1);
	}
};
