"use strict";

/* Nodecg context */
const nodecg = require("./util/nodecg-api-context").get();

/* Replicants */
const total     = nodecg.Replicant("total");
const donations = nodecg.Replicant("donations");

/* Libraries */
const request = require("request");
const util    = require("util");
const clone   = require("clone");

let FAILED_REQUESTS = 0;

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
		this.detailsEndpoint   = "/%s/v1/fundraising/pages/%s";  // <= to fetch total
		this.donationsEndpoint = "/%s/v1/fundraising/pages/%s/donations";
	};

	detailsUrl() {
		return util.format(
			this.env + this.detailsEndpoint,
			this.appId,
			this.pageShortName
		);
	};

	donationsUrl() {
		return util.format(
			this.env + this.donationsEndpoint,
			this.appId,
			this.pageShortName
		);
	};
};

const fetchTotal = (context, interval) => {
	const url = context.detailsUrl();
	nodecg.log.debug("Fetching JustGiving donation total with url:", url);

	// Web request options
	const options = {
		method: "GET",
		timeout: 5000,
		uri: url,
		json: true,
		headers: { "Accept": "application/json" }
	};

	// Perform request
	request(options, (err, resp, data) => {
		// Check if successful
		if (err || resp.statusCode != 200) {
			nodecg.log.error("JustGiving donation total failed reqest:", err.code);
			nodecg.log.error("JustGiving number of failed requests:", ++FAILED_REQUESTS);
			nodecg.log.debug( util.inspect(err) );
		} else {
			// Create object of donation total from the rest of the data
			const out = { symbol: data.currencySymbol, amount: parseInt(data.totalRaisedOnline, 10) };
			nodecg.log.debug("Fetched JustGiving donation total:", util.inspect(out));
			// Assign to replicant to update
			total.value = out;
		}
		// Go again!
		setTimeout(fetchTotal, interval, context, interval);
	});
};

const fetchDonations = (context, interval) => {
	const url = context.donationsUrl();
	nodecg.log.debug("Fetching JustGiving donations info with url:", url);

	// Web request options
	const options = {
		method: "GET",
		timeout: 5000,
		uri: url,
		json: true,
		headers: { "Accept": "application/json" }
	};

	// Perform request
	request(options, (err, resp, data) => {
		// Check if successful
		if (err || resp.statusCode != 200) {
			nodecg.log.error("JustGiving donations info failed reqest:", err.code);
			nodecg.log.error("JustGiving number of failed requests:", ++FAILED_REQUESTS);
			nodecg.log.debug( util.inspect(err) );
		} else {
			nodecg.log.debug("Fetched JustGiving donations info");
			// Clone of donations replicant to check against
			let currentDonations = clone(donations.value);

			// Make array of incoming donations and update
			const newDonations = Array.from(data.donations);
			newDonations.forEach((d) => {
				// skip if already existing in local copy
				if (currentDonations[d.id]) {
					return;
				}
				// Add donation object using key of donation id
				currentDonations[d.id] = {
					key:          d.id,
					currencyCode: d.donorLocalCurrencyCode,
					amount:       Number(d.donorLocalAmount).toFixed(2),
					name:         d.donorDisplayName,
					message:      d.message,
					read:         false
				};
			});
			// Assign updated donations to replicant to update
			donations.value = currentDonations;
		}
		// Go again!
		setTimeout(fetchDonations, interval, context, interval);
	});
};

const init = () => {
	const conf = nodecg.bundleConfig.justgiving;

	nodecg.log.debug("JustGiving API AppID:", conf.appId);
	nodecg.log.info("JustGiving fetching from page:", conf.pageShortName);
	nodecg.log.info("JustGiving using environment:", conf.live ? "LIVE" : "STAGING");
	nodecg.log.info("JustGiving update interval (ms):", conf.updateInterval);

	// Create API context 
	const context = new JustGivingAPIContext(conf.live, conf.appId, conf.pageShortName);

	// Kick off the process
	fetchTotal(context, conf.updateInterval);
	fetchDonations(context, conf.updateInterval);

	nodecg.listenFor("donationRead", (id) => {
		if (donations.value[id]) {
			nodecg.log.debug("Marking donation as read, ID:", id);
			donations.value[id].read = true;
		}
	});
};

init();
