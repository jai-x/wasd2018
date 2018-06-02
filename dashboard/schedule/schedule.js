"use strict";

const schedule = nodecg.Replicant("schedule");

class RunRow {
	view(vnode) {
		const run = vnode.attrs.run;
		const index = vnode.attrs.index;

		// Set the row with the current index with the `.current` css class
		const cls = (schedule.value.current == index) ? ".current" : "";

		return m("tr" + cls, [
			m("td", run.game),
			m("td", run.gameYear),
			m("td", run.gamePlatform),
			m("td", run.category),
			m("td", run.estimate),
			m("td", run.formattedNames),
			m("td", [
				// edit
				m("button", {
					class: "orange",
					"nodecg-dialog": "edit",
					onclick: () => {
						nodecg.sendMessage("scheduleEdit", index);
					}
				}, m("i", {class: "icon-options"})),
				// delete
				m("button", {
					class: "red",
					onclick: () => {
						nodecg.sendMessage("scheduleDelete", index);
					}
				}, m("i", {class: "icon-trash"})),
				// up
				m("button", {
					disabled: vnode.attrs.first,
					onclick: () => {
						nodecg.sendMessage("scheduleMoveBack", index);
					}
				}, m("i", {class: "icon-arrow-up"})),
				// down
				m("button", {
					disabled: vnode.attrs.last,
					onclick: () => {
						nodecg.sendMessage("scheduleMoveForward", index);
					}
				}, m("i", {class: "icon-arrow-down"})),
			])
		]);
	}
};

class ScheduleTable {
	view() {
		if (!schedule.value) {
			return m(".row", "Waiting for Schedule data");
		}

		if (schedule.value.entries.length == 0) {
			return m(".row", "Schedule empty");
		}

		return m(".row",
			m("table", [
				m("tr", [
					m("th", {class: "table-20"}, "Game"),
					m("th", {class: "table-10"}, "Release Year"),
					m("th", {class: "table-10"}, "Platform"),
					m("th", {class: "table-15"}, "Run Category"),
					m("th", {class: "table-10"}, "Estimate"),
					m("th", {class: "table-15"}, "Runners"),
					m("th", {class: "table-20"}, "Actions"),
				]),
				schedule.value.entries.map((run, index) => {
					const first = (index == 0);
					const last = (index == (schedule.value.entries.length - 1));
					// Pass data readable with `vnode.attrs` in `RunRow`
					return m(RunRow, {run, index, first, last});
				}),
			])
		);
	}
}

class ScheduleButtons {
	view() {
		if (!schedule.value) {
			return m(".row", "Waiting for Schedule data");
		}

		const last = schedule.value.entries.length - 1;
		const first = 0;
		const current = schedule.value.current;

		return m(".row", [
			m("button", {
				disabled: (current == first),
				onclick: () => nodecg.sendMessage("scheduleCurrentBack"),
			}, "Previous Run"),
			m("button", {
				onclick: () => nodecg.sendMessage("scheduleEditNew"),
				id: "add-run",
				"nodecg-dialog": "edit"
			}, "Add new run"),
			m("button", {
				disabled: (current == last),
				onclick: () => nodecg.sendMessage("scheduleCurrentForward"),
			}, "Next Run"),
		]);
	}
}

class ScheduleManager {
	view() {
		return [
			m(ScheduleTable),
			m(ScheduleButtons),
		];
	}
}

m.mount(document.body, ScheduleManager);

schedule.on("change", () => {
	// update component on new data
	m.redraw();
});
