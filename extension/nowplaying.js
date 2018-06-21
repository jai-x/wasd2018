"use strict";

/* Nodecg context */
const nodecg = require("./util/nodecg-api-context").get(); 
/* Replicants */
const nowplaying = nodecg.Replicant("nowplaying");

/* Libraries */
const fs = require("fs");

/* Functions */
const die = (msg) => {
	nodecg.log.error(msg);
	nodecg.log.error("nowplaying replicant will not be updated this session");
};

const watch = (file) => {
	nodecg.log.info("nowplaying extension watching file:", file);

	fs.watch(file, (evt, filename) => {
		if (evt == "change") {
			// Read file contents
			const val = fs.readFileSync(file, "utf8");
			nodecg.log.debug("nowplaying file contents changed:", file);
			nodecg.log.debug("nowplaying contents:", val);
			// Assign file contents to replicant
			nowplaying.value = val;
		}

		if (evt == "error") {
			nodecg.log.error("Unexpected error when watching nowplaying file:", evt);
		}
	});
};

const init = () => {
	const f = nodecg.bundleConfig.nowPlayingFile;
	if (!f) {
		die("No filepath provided for nowplaying");
		return;
	}

	fs.access(f, fs.constants.F_OK | fs.constants.R_OK, (err) => {
		if (err) {
			nodecg.log.debug(err);
			die("Filepath for nowplaying does not exist or can't be read");
			return;
		} else {
			watch(f);
		}
	});
};

/* Setup */
init();
