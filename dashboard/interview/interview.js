"use strict";

const interview = nodecg.Replicant("interview");

function clonePeople(people) {
	return people.map(person => Object.assign({}, person));
}

class InterviewPerson {
	view(vnode) {
		const person = vnode.attrs.person;
		const remove = vnode.attrs.removeCallback;
		return m(".wasd-row", [
			m(".column", [
				m("label.label", "Name"),
				m(".control", [
					m("input.input[type=text]", {
						value: person.name,
						oninput: m.withAttr("value", function(value) {person.name = value}),
					})
				]),
			]),
			m(".column", [
				m("label.label", "Twitch"),
				m(".control", [
					m("input.input[type=text]", {
						value: person.twitch,
						oninput: m.withAttr("value", function(value) {person.twitch = value}),
					})
				])
			]),
			m("button.button", {onclick: remove} ,"Remove"),
		])
	}
}

class InterviewApp {
	oninit() {
		interview.on("change", (event) => {
			this.currentPeople = clonePeople(interview.value.people);
			m.redraw(event);
		});
	}

	view() {
		if (!interview.value) {
			return m(".wasd-row", "Loading...");
		}

		return [
			...this.currentPeople.map((person, index) => m(InterviewPerson, {
				person: person,
				removeCallback: () => {
					this.currentPeople.splice(index, 1);
				}
			})),
			m(".wasd-row", [
				m("button.button", {
					onclick: () => {
						this.currentPeople.push({});
					}
				} ,"Add person"),
				m("button.button", {
					onclick: () => {
						interview.value.people = clonePeople(this.currentPeople);
					}
				} ,"Apply"),
			])
		];
	};
};

m.mount(document.body, InterviewApp);
