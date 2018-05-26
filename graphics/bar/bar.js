"use strict";

// Elements
const totalSym = document.getElementById("total-sym");

// Replicant
const total = nodecg.Replicant("total");

total.on("change", (newVal, oldVal) => {
	totalSym.textContent = newVal.symbol;

	// Animate total incrementing
	anime({
		targets: "#total-num",
		textContent: newVal.amount,
		round: 1,
		duration: 2500,
		easing: "easeOutExpo"
	});
});
