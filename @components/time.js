import { newElement } from "/@script/utils.js";

export class WClock extends HTMLElement {
	#interval;

	elements = {
		hours: newElement("span", ["hours"]),
		separator: newElement("span", ["separator"]),
		minutes: newElement("span", ["minutes"]),
		ampm: newElement("span", ["ampm"]),
	};

	connectedCallback() {
		this.#interval = setInterval(() => {
			const now = new Date();
			this.elements.hours.textContent = String(now.getHours());
			this.elements.minutes.textContent = String(now.getMinutes());
			this.elements.ampm.textContent = now.getHours() >= 12 ? "PM" : "AM";
		}, 500);

		this.append(
			this.elements.hours,
			this.elements.separator,
			this.elements.minutes,
			this.elements.ampm,
		);
	}

	disconnectedCallback() {
		clearInterval(this.#interval);
	}
}

customElements.define("w-clock", WClock);
