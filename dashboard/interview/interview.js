"use strict";

const interview = nodecg.Replicant("interview");

class InterviewPerson {
	view(vnode) {
		const person = vnode.attrs.person;
		const remove = vnode.attrs.removeCallback;
		const change = vnode.attrs.changeCallback;
		return m(".wasd-row columns is-mobile", [
			m(".column", [
				m("label.label", "Name"),
				m(".control", [
					m("input.input[type=text]", {
						value: person.name,
						oninput: () => {
							m.withAttr("value", (val) => person.name = val);
							change();
						}
					})
				]),
			]),
			m(".column", [
				m("label.label", "Twitch"),
				m(".control", [
					m("input.input[type=text]", {
						value: person.twitch,
						oninput: () => {
							m.withAttr("value", (val) => person.twitch = val);
							change();
						},
					})
				])
			]),
			m(".column is-narrow",
				m("button.button", {onclick: remove} ,"Remove")
			)
		]);
	};
};

class InterviewApp {
	oninit() {
		interview.on("change", () => {
			this.currentPeople = _.cloneDeep(interview.value.people);
			this.modified = false;
			m.redraw();
		});
	};

	view() {
		if (!interview.value) {
			return m(".wasd-row", "Loading...");
		}

		this.modified ? m("p", "Unsaved Changes") : null;

		return [
			...this.currentPeople.map((person, index) => m(InterviewPerson, {
				person: person,
				// callback will remove person from array at its index
				removeCallback: () => {
					this.currentPeople.splice(index, 1);
					this.modified = true;
				},
				changeCallback: () => { this.modified = true; }
			})),
			m(".wasd-row", [
				// Add empty object for new person
				m("button.button", {
					onclick: () => {
						this.currentPeople.push({});
					}
				} ,"Add person"),
				// Clone current state and assign to replicant
				m("button.button", {
					onclick: () => {
						interview.value.people = _.cloneDeep(this.currentPeople);
						this.modified = false;;
					}
				} ,"Apply"),
				this.modified ? m("p", "Unsaved Changes") : null
			]),
		];
	};
};

m.mount(document.body, InterviewApp);
