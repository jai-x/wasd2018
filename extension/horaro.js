"use strict";

// Libraries
const rq = require("request-promise-native");
const url = require("url");
const util = require("util");

// Horaro URI constants
const HORARO_DOMAIN = "horaro.org";
const HORARO_API = "https://horaro.org/-/api/v1/events/%s/schedules/%s";

// Transform a regular schedule page link to an API link
const linkToApiUrl = (link) => {
	const path = url.parse(link).pathname.split("/").filter(Boolean);
	if (path.length != 2) {
		return null;
	}
	return util.format(HORARO_API, path[0], path[1]);
};

module.exports = (nodecg) => {
	// Horaro replciant
	const horaro = nodecg.Replicant("horaro");

	// Replicant helper functions
	const message = (stat, msg) => horaro.value = {status: stat, message: msg};
	const fetchMsg = (msg) => message("fetching", msg);
	const doneMsg = (msg) => message("ready", msg);

	// On link submit
	nodecg.listenFor("horaroImportLink", link => {
		fetchMsg("Importing");

		// Ensure link is for horaro page
		if (url.parse(link).hostname != HORARO_DOMAIN) {
			doneMsg("Not a " + HORARO_DOMAIN + " link");
			return;
		}

		// Try to get a the api link for the page
		const apiUrl = linkToApiUrl(link);
		if (!apiUrl) {
			doneMsg("Error parsing supplied link");
			return;
		}

		// Perform the request for the JSON data
		/*
		rq({
			method: "GET",
			uri: apiUrl,
			json: true
		});
		*/

		nodecg.log.info(apiUrl);

		doneMsg("Schedule imported");
	});

	// Prevent bad state on startup
	doneMsg("Ready");
};
