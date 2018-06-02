"use strict";

const extensions = [
	"schedule",
	"stopwatch",
	"justgiving",
];

// Load each extension and supply it with the `nodecg` context
module.exports = (nodecg) => {
	extensions.forEach(ext => {
		try {
			require("./" + ext)(nodecg);
		} catch (e) {
			nodecg.log.error("Failed to load " + ext + " extension:", e.stack);
			process.exit(1);
		}
		nodecg.log.info("Loaded extension:", ext);
	});
};
