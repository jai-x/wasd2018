"use strict";

/* Nodecg context */
const nodecg = require("./util/nodecg-api-context").get();

/* Replicants */
const twitter = nodecg.Replicant("twitter");

/* Libraries */
const twit = require("twit");
const util = require("util");

const MAX_TWEETS = 20;

/* Functions */
// Add the new tweet to the front of the pending tweets array
const newTweet = (tweet) => {
	// Removed last tweet when array reaches max size
	if (twitter.value.pending.length == 20) {
		twitter.value.pending.pop();
	}

	// Don't add retweets
	if(tweet.retweeted_status) {
		return;
	}

	// Add the new tweet to the front
	twitter.value.pending.unshift({
		handle: "@" + tweet.user.screen_name,
		text: tweet.text
	});
};

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

	// Add to replicant on evey incoming tweet
	stream.on("tweet", (tweet) => newTweet(tweet));
};

init();
