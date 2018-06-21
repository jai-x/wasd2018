"use strict";

const extensions = [
	"schedule",
	"stopwatch",
	//"nowplaying",
	"countdown",
	//"justgiving",
	//"twitter"
];

const nodecgApiContext = require("./util/nodecg-api-context");

module.exports = (nodecg) => {
	// Store a reference to the nodecg api, such that other modeules using it
	// dont have to wrap their entire body in `module.exports` block. Must be
	// set first before loading any other modules.
	nodecgApiContext.set(nodecg);

	// Load each extension one by one in the array above
	extensions.forEach((ext) => {
		require("./" + ext);
		nodecg.log.info("Loaded extension:", ext);
	});
};
