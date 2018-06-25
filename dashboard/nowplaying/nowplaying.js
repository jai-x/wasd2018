"use strict";

const nowplaying = nodecg.Replicant("nowplaying");

class NPApp {
	view() {
		let txt = nowplaying.value;

		if (!txt) {
			txt = "Loading..."
		}

		return m(".wasd-row#np", txt);
	};
};

m.mount(document.body, NPApp);
nowplaying.on("change", m.redraw);
