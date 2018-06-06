"use strict";

const twitter = nodecg.Replicant("twitter");

class TweetApproved {
	view(vnode) {
		const t = vnode.attrs.tweet;
		return m(".tweet", [
			m(".tweet-content", [
				m(".tweet-handle", t.handle),
				m(".tweet-text", t.text),
			]),
			m(".tweet-controls",[
				m("button.red", {
					title: "Un-Approve Tweet"
				}, m("img.icon", {src: "../img/cross-icon.svg"})),
				m("button.green", {
					title: "Display Tweet on stream"
				}, m("img.icon", {src: "../img/play-icon.svg"})),
			]),
		]);
	}
};

class Approved {
	view(vnode) {
		const tweets = vnode.attrs.tweets;
		const inner = new Array();
		inner.push( m(".title", "Approved Tweets") );
		if (tweets.length == 0) {
			inner.push( m("p", "No approved tweets yet") );
		} else {
			tweets.forEach((tweet) => {
				inner.push( m(TweetApproved, {tweet: tweet}) );
			});
		}
		return m(".tweet-conatiner", inner);
	}
};

class TweetPending {
	view(vnode) {
		const t = vnode.attrs.tweet;
		return m(".tweet", [
			m(".tweet-content", [
				m(".tweet-handle", t.handle),
				m(".tweet-text", t.text),
			]),
			m(".tweet-controls",[
				m("button.red", {
					title: "Reject Tweet"
				}, m("img.icon", {src: "../img/cross-icon.svg"})),
				m("button.green", {
					title: "Approve Tweet"
				}, m("img.icon", {src: "../img/tick-icon.svg"})),
			]),
		]);
	}
};

class Pending {
	view(vnode) {
		const tweets = vnode.attrs.tweets;
		const inner = new Array();
		inner.push( m(".title", "Pending Approval") );
		if (tweets.length == 0) {
			inner.push( m("p", "No new tweets") );
		} else {
			tweets.forEach((tweet) => {
				inner.push( m(TweetPending, {tweet: tweet}) );
			});
		}
		return m(".tweet-conatiner", inner);
	}
};

class Top {
	view(vnode) {
		const h = vnode.attrs.hashtag;
		return m("#hashtag", [
			"Showing tweets for ",
			m("b", h)
		]);
	}
};

class Twitter {
	view(vnode) {
		if (!twitter.value) {
			return m("p", "Loading");
		}

		return [
			m(Top,      { hashtag: twitter.value.hashtag }),
			m(Approved, { tweets: twitter.value.approved }),
			m(Pending,  { tweets: twitter.value.pending  })
		];
	}
};

m.mount(document.body, Twitter);
twitter.on("change", m.redraw);
