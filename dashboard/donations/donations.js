"use strict";

const total = nodecg.Replicant("total");

class Donations {
	view() {
		if (!total.value) {
			return m("p", "Loading");
		}

		const totalStr = String(total.value.symbol + total.value.amount);
		return m("#total", totalStr);
	}
};

m.mount(document.body, Donations);

total.on("change", () => {
	m.redraw();
});
