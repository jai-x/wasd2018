"use strict";

// Elements
const totalSym = document.getElementById("total-sym");

// Replicant
const total = nodecg.Replicant("total");
const schedule = nodecg.Replicant("schedule");

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

schedule.on("change", (newVal, oldVal) => {
	const next = newVal.current + 1;
	// copy the next three runs ahead from the upcoming run
	nextRuns.nextThree = newVal.entries.slice(next, next+3);
});

// Manage and animate the label
const label = new class {
	constructor() {
		this.anim = anime({
			targets: "#label",
			translateX: [-200, -20],
			duration: 700,
			easing: "easeOutCubic",
			autoplay: false
		});
	};

	show(advance) {
		this.anim.reset();
		this.anim.play();
		if (advance) {
			this.anim.complete = () => nextRuns.show(advance);
		}
	};

	hide(advance) {
		this.anim.reverse();
		this.anim.play();
		if (advance) {
			this.anim.complete = () => cta.show(advance);
		}
	};
};

// Manage an aimate the next runs
const nextRuns = new class {
	constructor() {
		// copy of the next three runs from the schedule
		this.nextThree = new Array();
		// element to place child run elements inside of
		this.container = document.getElementById("runs");
	};

	// Return formatted html string of the run elements
	elementHTML(game, info) {
		return `
		<div class="run">
    	  <div class="run-bg">
    	    <div class="run-text">
    	      <div class="run-game">${game}</div>
    	      <div class="run-info">${info}</div>
    	    </div>
    	  </div>
    	</div>`;
	};

	// Create and append each run element to the page and bind animations
	build() {
		// Remove existing run elements
		this.container.innerHTML = null;
		// Build and append new run elements from data
		this.nextThree.forEach((run) => {
			const info = run.category + " by " + run.formattedNames;
			const html = this.elementHTML(run.game, info);
			this.container.innerHTML += html;
		});
		// Bind animations to run elements
		this.anim = anime({
			targets: ".run",
			translateX: [
				{value: 1500, duration: 0},
				{value: 0, duration: 1500},
				{value: -1500, duration: 1500, delay: 15000},
			],
			delay: (el, i) => { return 50 * (i + 1); },
			easing: "easeOutCubic",
			autoplay: false,
		});
	};

	show(advance) {
		this.build();
		this.anim.reset();
		this.anim.play();
		if (advance) {
			this.anim.complete = () => label.hide(advance);
		}
	};
};

// Manage and animate the call to action
const cta = new class {
	constructor() {
		this.anim = anime.timeline({autoplay: false})
			.add({
				targets: "#cta",
				translateY: [
					{value: 96,   duration: 0},
					{value: 0,    duration: 500},
					{value: -96,  duration: 500, delay: 10000},
					{value: -192, duration: 500, delay: 10000},
					{value: -288, duration: 500, delay: 10000},
				],
				easing: "easeOutCubic",
			})
			.add({
				targets: ".wasd-word",
				opacity: [1, 0],
				duration: 500,
				offset: 5500,
				easing: "linear"
			})
			.add({
				targets: "#wasd-a",
				translateX: 200,
				duration: 500,
				offset: 5500,
				easing: "easeOutCubic"
			})
			.add({
				targets: "#wasd-w",
				translateX: 393,
				duration: 500,
				offset: 5500,
				easing: "easeOutCubic"
			})
			.add({
				targets: "#wasd-d",
				translateX: -270,
				duration: 500,
				offset: 5500,
				easing: "easeOutCubic"
			})
			.add({
				targets: "#wasd-year",
				translateX: -390,
				duration: 500,
				offset: 5500,
				easing: "easeOutCubic"
			});
	};

	show(advance) {
		this.anim.reset();
		this.anim.play();
		if (advance) {
			this.anim.complete = () => label.show(advance);
		}
	};
};

// GO! GO! GO! Disable in dev
//cta.show(true);
