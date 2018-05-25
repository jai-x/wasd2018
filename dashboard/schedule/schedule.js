"use strict";

let init = false;
const schedule = nodecg.Replicant("schedule");

class RunEntry {
	view(vnode) {

	}
}

class RunRow {
	view(vnode) {
		return m("tr", [
			m("td", vnode.attrs.run.game),
			m("td", vnode.attrs.run.gameYear),
			m("td", vnode.attrs.run.gamePlatform),
			m("td", vnode.attrs.run.category),
			m("td", vnode.attrs.run.estimate),
			m("td", vnode.attrs.run.runner1),
			m("td", [
				// edit
				m("button", {
					class: "orange",
					"nodecg-dialog": "edit",
					onclick: () => { nodecg.sendMessage("scheduleEdit", vnode.attrs.index)}
				}, m("i", {class: "icon-options"})),
				// delete
				m("button", {
					class: "red",
					onclick: () => { nodecg.sendMessage("scheduleDelete", vnode.attrs.index)}
				}, m("i", {class: "icon-trash"})),
				// up
				m("button", {
					disabled: vnode.attrs.first,
					onclick: () => { nodecg.sendMessage("scheduleMoveBack", vnode.attrs.index)}
				}, m("i", {class: "icon-arrow-up"})),
				// down
				m("button", {
					disabled: vnode.attrs.last,
					onclick: () => { nodecg.sendMessage("scheduleMoveForward", vnode.attrs.index)}
				}, m("i", {class: "icon-arrow-down"})),
			])
		]);
	}
};

class ScheduleTable {
	view() {
		if (schedule.value.entries.length == 0) {
			return m(".row", "Schedule empty");
		}

		return m("table", [
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
				return m(RunRow, {run: run, index: index, first: first, last: last});
			}),
		]);
	}
}

class App {
	view() {
		return [
			m(ScheduleTable),
			m(".row", [
				m("button", {
					onclick: () => { nodecg.sendMessage("scheduleEditNew"); },
					id: "add-run",
					"nodecg-dialog": "edit"
				}, "Add new run")
			])
		];
	}
}

schedule.on("change", () => {
	// mount component on replicant load
	if (!init) {
		m.mount(document.body, App);
		init = true;
	}
	// update component on new data
	m.redraw();
});
