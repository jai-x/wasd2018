"use strict";

const total     = nodecg.Replicant("total");
const schedule  = nodecg.Replicant("schedule");
const donations = nodecg.Replicant("donations");
const stopwatch = nodecg.Replicant("stopwatch");

class TotalApp {
	view() {
		if (!total.value) {
			return m(".wasd-row", "Loading...");
		}

		return m(".wasd-col", [
			m("div", "Total Raised"),
			m("#donation-total", total.value.symbol + total.value.amount)
		]);
	}
};

class NowRunningApp {
	view() {
		if (!schedule.value) {
			return m(".wasd-row", "Loading...");
		}
		const run = schedule.value.entries[schedule.value.current];

		return m(".wasd-col", [
			m("#run-game", run.game),
			m("#run-category", run.category),
			m("#run-runners", run.formattedNames)
		])
	};
};

class TimerApp {
	view() {
		if (!stopwatch.value) {
			return m(".wasd-row", "Loading...");
		}
		return m(".wasd-col", [
			m("#run-timer", stopwatch.value.time),
			m("div", stopwatch.value.displayState)
		]);
	};
};

class UnreadDonation {
	view(vnode) {
		// The donation
		const d = vnode.attrs;

		return m(".donation box", [
			m(".columns is-mobile", [
				m(".donation-monies column is-2", [
					m(".donation-currency-code", d.currencyCode),
					m(".donation-amount", d.amount)
				]),
				m(".donation-content column", [
					m(".donation-name", d.name),
					m(".donation-message", d.message)
				]),
				m(".donation-control column is-1", 
					m("button.button is-primary", {
						title: "Mark as read",
						onclick: () => nodecg.sendMessage("donationRead", d.key)
					}, m(".wasd-icon tick"))
				)
			])
		]);
	};
};

class DonationsApp {
	view() {
		if (!donations.value) {
			return m(".wasd-row", "Loading...");
		}
	
		const unread = Object.values(donations.value).map((d) => {
			if (!d.read) {
				return m(UnreadDonation, d);
			}
		});

		if (unread.length == 0) {
			return m(".wasd-row", "No unread donations...");
		}

		return unread;
	}
};

class HostApp {
	view() {
		return m(".container", 
			m(".columns", [
				m(".column is-one-third",[
					m(TotalApp),
					m("hr"),
					m(NowRunningApp),
					m("hr"),
					m(TimerApp)
				]),
				m(".column", [
					m(DonationsApp)
				])
			]),
		);
	};
};

m.mount(document.body, HostApp);

total.on("change", m.redraw);
schedule.on("change", m.redraw);
donations.on("change", m.redraw);
stopwatch.on("change", m.redraw);
