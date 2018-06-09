"use strict";

/* Nodecg context */
const nodecg = require("./util/nodecg-api-context").get();

/* Replicants */
const total = nodecg.Replicant("total");

/* Libraries */
const request = require("request-promise-native");
const util    = require("util");

class JustGivingAPIContext {
	constructor(live, appId, pageShortName) {
		if (!appId || !pageShortName) {
			throw new Error("JustGiving config requires `appId` & `pageShortName`");
		}

		// API environments
		const STAGING = "https://api.staging.justgiving.com";
		const LIVE    = "https://api.justgiving.com";
		
		this.env               = live ? LIVE : STAGING;
		this.appId             = appId;
		this.pageShortName     = pageShortName;
		this.failedRequests    = 0;
		this.detailsEndpoint   = "/%s/v1/fundraising/pages/%s";  // <= to fetch total
		this.donationsEndpoint = "/%s/v1/fundraising/pages/%s/donations";
	};

	// Return fundraising total from API
	fundraisingTotal() {
		// Create URL for this request
		const url = util.format(this.env + this.detailsEndpoint, this.appId, this.pageShortName);
		nodecg.log.debug("Fetching donation total with url:", url);
		// Web request options
		const options = {
			method: "GET",
			timeout: 5000,
			uri: url,
			json: true,
			headers: { "Accept": "application/json" }
		};
		// Perform request and return promise
		return request(options);
	};

	// Return list of last 25 donations
	fundraisingDonations() {
		// Create URL for this request
		const url = util.format(this.env + this.donationsEndpoint, this.appId, this.pageShortName);
		nodecg.log.debug("Fetching JustGiving page donations with url:", url);
		// Web request options
		const options = {
			method: "GET",
			timeout: 5000,
			uri: url,
			json: true,
			headers: { "Accept": "application/json" }
		};
		// Perform request and return promise
		return request(options);
	};
};

const fetchTotal = (context) => {
	context.fundraisingTotal()
		.then((data) => {
			const monies = Math.round(Number(data.totalRaisedOnline));
			const out = { symbol: data.currencySymbol, amount: monies };
			nodecg.log.debug("Fetched JustGiving donation total:", util.inspect(out));
			total.value = out;
		})
		.catch((data) => {
			nodecg.log.error("JustGiving donation total failed reqest!");
			nodecg.log.error("JustGiving number of failed requests:", ++context.failedRequests);
			nodecg.log.debug(JSON.stringify(data, null, 2));
		});
};

const fetchDonations = (context) => {

};

const init = () => {
	const conf = nodecg.bundleConfig.justgiving;

	nodecg.log.debug("JustGiving API AppID:", conf.appId);
	nodecg.log.info("JustGiving fetching from page:", conf.pageShortName);
	nodecg.log.info("JustGiving using environment:", conf.live ? "LIVE" : "STAGING");
	nodecg.log.info("JustGiving update interval (ms):", conf.updateInterval);

	// Create API context 
	const context = new JustGivingAPIContext(conf.live, conf.appId, conf.pageShortName);

	// Fetch donation total
	setInterval(fetchTotal, conf.updateInterval, context);
	// Fetch donations with messages
	setInterval(fetchDonations, conf.updateInterval, context);
}

init();
