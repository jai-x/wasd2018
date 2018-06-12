"use strict";

const schedule = nodecg.Replicant("schedule");

class RunRow {
	view(vnode) {
		const run    = vnode.attrs.run;
		const active = vnode.attrs.active;
		const first  = vnode.attrs.first;
		const last   = vnode.attrs.last;
		const index  = vnode.attrs.index;

		// This is some ugly as fuck code
		return m("tr" + (active ? ".is-selected" : ""), [
			m("td", run.game),
			m("td", run.gameYear),
			m("td", run.estimate),
			m("td", run.category),
			m("td", run.formattedNames),
			m("td", [
				// Edit
				m("button.button is-warning", {
					"nodecg-dialog": "edit",
					onclick: () => nodecg.sendMessage("scheduleEdit", index)
				}, m(".wasd-icon edit")),
				// Delete
				m("button.button is-danger", {
					onclick: () => nodecg.sendMessage("scheduleDelete", index)
				}, m(".wasd-icon delete")),
				// Up
				m("button.button is-info", {
					disabled: first,
					onclick: () => nodecg.sendMessage("scheduleMoveBack", index)
				}, m(".wasd-icon arrow-up")),
				// Down
				m("button.button is-info", {
					disabled: last,
					onclick: () => nodecg.sendMessage("scheduleMoveForward", index)
				}, m(".wasd-icon arrow-down"))
			])
		]);
	};
};

class ScheduleTable {
	view(vnode) {
		const runs = vnode.attrs.runs;
		const current = vnode.attrs.current;

		if (runs.length == 0) {
			return m(".wasd-row", "Schedule empty");
		}

		const runRows = runs.map((run, i) => {
			const first  = (i == 0);
			const last   = (i == runs.length - 1);
			const active = (i == current);
			return m(RunRow, {run: run, first: first, last: last, active: active, index: i});
		});

		return m("table.table is-fullwidth", [
			m("thead", m("tr", [
				m("th#run-game",      "Game Title"),
				m("th#run-game-year", "Release Year"),
				m("th#run-estimate",  "Run Estimate"),
				m("th#run-category",  "Run Category"),
				m("th#run-runners",   "Runners"),
				m("th#run-controls",  "Controls"),
			])),
			m("tbody", runRows)
		]);
	};
};

class ScheduleApp {
	view() {
		if (!schedule.value) {
			return m(".wasd-row", "Loading...");
		}

		const runs = schedule.value.entries;
		const current = schedule.value.current;

		return [
			m(ScheduleTable, {runs: runs, current: current}),
			m(".wasd-row", [
				// Move back
				m("button.button", {
					onclick: () => nodecg.sendMessage("scheduleCurrentBack")
				}, "Move to Previous Run"),
				// new run
				m("button.button", {
					"nodecg-dialog": "edit",
					onclick: () => nodecg.sendMessage("scheduleEditNew")
				} ,"Add New Run"),
				// Move forward
				m("button.button", {
					onclick: () => nodecg.sendMessage("scheduleCurrentForward")
				}, "Move to Upcoming Run"),
			])
		];
	};
};

m.mount(document.body, ScheduleApp);
schedule.on("change", m.redraw);
