"use strict";

/* Nodecg context */
const nodecg = require("./util/nodecg-api-context").get();

/* Replicants */
const total = nodecg.Replicant("total");

/* Libraries */
const request = require("request-promise-native");
const util    = require("util");

// API environments
const SANDBOX = "https://api.sandbox.justgiving.com";
const LIVE    = "https://api.justgiving.com";

// API Endpoints to use
const PAGE_DETAILS   = "/%s/v1/fundraising/pages/%s";  // <= to fetch total
const PAGE_DONATIONS = "/%s/v1/fundraising/pages/%s/donations";

/* Functions */
// Construct api url from parameters
const constructUrl = (env, endpoint, appId, pageShortName) => {
	return util.format(env + endpoint, appId, pageShortName);
};

// Update the `total` replicant by performing request to API
const updateTotal = (env, appId, pageShortName) => {
	const url = constructUrl(env, PAGE_DETAILS, appId, pageShortName)
	nodecg.log.debug("Fetching page details with url:", url);

	const options = {
		method: "GET",
		timeout: 5000,
		uri: url,
		json: true,
		headers: {
			"Accept": "application/json"
		}
	};

	request(options)
		.then((data) => {
			const monies = data.totalRaisedOffline + data.totalRaisedOnline;
			total.value = {
				symbol: data.currencySymbol,
				amount: Math.round(monies)
			};
		})
		.catch((data) => {
			nodecg.log.warn("Unable to fetch JustGiving donation total!");
			nodecg.log.warn(JSON.stringify(data, null, 2));
		});
};

const updateDonations = (env, appId, pageShortName) => {
	const url = constructUrl(env, PAGE_DONATIONS, appId, pageShortName);
	nodecg.log.debug("Fetching page donations with url:", url);

	const options = {
		method: "GET",
		timeout: 5000,
		uri: url,
		json: true,
		headers: {
			"Accept": "application/json"
		}
	};

	request(options)
		.then((data) => {
			// TODO
		})
		.catch((data) => {
			// TODO
		});
};

const init = () => {
	// Get values from conf
	const env = nodecg.bundleConfig.justgiving.live ? LIVE : SANDBOX;
	const appId = nodecg.bundleConfig.justgiving.appId;
	const pageShortName = nodecg.bundleConfig.justgiving.pageShortName;


	if (!appId) {
		nodecg.log.warn("appId not supplied in config");
		nodecg.log.warn("JustGiving extension will not run");
		return;
	}

	if (!pageShortName) {
		nodecg.log.warn("pageShortName not supplied in config");
		nodecg.log.warn("JustGiving extension will not run");
		return;
	}
}

//init();
