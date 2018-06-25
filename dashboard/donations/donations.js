"use strict";

const total     = nodecg.Replicant("total");
const donations = nodecg.Replicant("donations");

class TotalDisplay {
	view() {
		if (!total.value) {
			return m("p", "Loading...");
		}

		return m("#total-display", total.value.symbol + total.value.amount);
	};
};

class UnreadDonation {
	view(vnode) {
		return m(".donation box", [
			m(".columns is-mobile", [
				m(".donation-monies column is-2", [
					m(".donation-currency-code", vnode.attrs.currencyCode),
					m(".donation-amount", vnode.attrs.amount)
				]),
				m(".donation-content column", [
					m(".donation-name", vnode.attrs.name),
					m(".donation-message", vnode.attrs.message)
				])
			])
		]);
	};
};

class UnreadDonations {
	view() {
		if (!donations.value) {
			return m("p", "Loading...");
		}

		const unread = Object.values(donations.value).map((d) => {
			if (!d.read) {
				return m(UnreadDonation, d);
		});

		if (unread.length == 0) {
			return m("p", {style: "text-align: center"}, "No unread donations.");
		}

		return m("#unread-donations", unread);
	};
};

class App {
	view() {
		return [ m(TotalDisplay), m(UnreadDonations) ];
	};
};

m.mount(document.body, App);

total.on("change", m.redraw);
donations.on("change", m.redraw);

