import { newElement } from "/@script/utils.js";
import { Setup } from "./!mixins.js";

export class WProgress extends Setup {
	progress = newElement("div", ["progress"]);

	static get observedAttributes() {
		return ["value"];
	}

	setup() {
		super.setup();

		this.replaceChildren(this.progress);
	}

	get value() {
		return Number(this.getAttribute("value") || 0);
	}

	set value(value) {
		this.setAttribute("value", String(value));
	}

	attributeChangedCallback(name) {
		if (name) this.style.setProperty("--value", String(this.value));
	}
}

customElements.define("w-progress", WProgress);
