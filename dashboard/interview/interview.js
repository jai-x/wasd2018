"use strict";

const interview = nodecg.Replicant("interview");

let localCopy = new Array();
let modified  = new Boolean();


/* For some weird reason, using `m.withAttr` only works if the function
 * is the only statement in the `oninput` callback.
 * This means:
 *    oninput: () => {
 *        m.withAttr("value", callback);
 *        someOtherStatements;
 *    },
 * does not work, even when not using an arrow function. Therefore state change
 * logic has been moved to these functions.
 */

const setName   = (v, i) => { localCopy[i].name   = v; modified = true; }
const setTwitch = (v, i) => { localCopy[i].twitch = v; modified = true; }

class InterviewPerson {
	view(vnode) {
		const i = vnode.attrs.index;

		return m(".wasd-row columns is-mobile", [
			m(".column", [
				m("label.label", "Name"),
				m(".control", [ m("input.input[type=text]", {
						required: true,
						value: localCopy[i].name,
						oninput: m.withAttr("value", (v) => setName(v, i))
					})
				]),
			]),
			m(".column", [
				m("label.label", "Twitch"),
				m(".control", [
					m("input.input[type=text]", {
						value: localCopy[i].twitch,
						oninput: m.withAttr("value", (v) => setTwitch(v, i))
					})
				])
			]),
			m(".column is-narrow",
				m("button.button", {
					onclick: () => {
						localCopy.splice(i, 1);
						modified = true;
					}
				} ,"Remove")
			)
		]);
	};
};

class InterviewApp {
	view() {
		if (!interview.value) {
			return m(".wasd-row", "Loading...");
		}

		return [
			// Names input
			...localCopy.map((person, index) => m(InterviewPerson, {index: index})),

			// Bottom row control
			m(".wasd-row", [
				m("button.button", {
					onclick: () => nodecg.sendMessage("bottom-third-show")
				} ,"Show"),

				m("button.button", {
					onclick: () => nodecg.sendMessage("bottom-third-hide")
				} ,"Hide"),

				// Add empty object for new person
				m("button.button", {
					onclick: () => localCopy.push(new Object())
				} ,"Add person"),

				// Clone current state and assign to replicant
				m("button.button", {
					onclick: () => interview.value = clone(localCopy)
				} ,"Save"),

				// Indicate any unsaved changes
				modified ? m("p", "Unsaved Changes") : null
			]),
		];
	};
};

m.mount(document.body, InterviewApp);
interview.on("change", (newVal, oldVal) => {
	localCopy = clone(newVal);
	modified = false;
	m.redraw();
});
