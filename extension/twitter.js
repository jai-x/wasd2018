"use strict";

/* Nodecg context */
const nodecg = require("./util/nodecg-api-context").get();

/* Replicants */
//const total = nodecg.Replicant("total");

/* Libraries */
const twit = require("twit");
const util = require("util");

/* Functions */

/* Setup */
const init = () => {
	const conf = nodecg.bundleConfig.twitter;

	// Check config for hashtag
	if (!conf.hashtag) {
		throw new Error("Twitter config requires `hashtag`");
	}

	// Create twitter API object, will throw error if incorrect config
	const T = new twit({
		consumer_key: conf.consumerKey,
		consumer_secret: conf.consumerSecret,
		access_token: conf.accessToken,
		access_token_secret: conf.accessTokenSecret
	});

	// Open a twitter stream for tweets containing the specified hashtag
	const stream = T.stream("statuses/filter", { track: conf.hashtag });

	stream.on("tweet", (tweet) => {
		// Log for now
		nodecg.log.info(tweet.text);
	});
};

init();
