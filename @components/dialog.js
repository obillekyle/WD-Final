import { newElement } from "../@script/utils.js";
import { Setup } from "./!mixins.js";
import { createIcon, takeAttribute } from "./!util.js";

export class WDialog extends Setup {
	setup() {
		super.setup();

		const icon = takeAttribute(this, "icon");
		const title = takeAttribute(this, "title");
		const closeable = this.hasAttribute("closeable");

		const content = newElement("div", {
			content: "",
			append: [
				createIcon(icon, ["top-icon"]),
				newElement("div", { header: "", text: title }),
				newElement("div", { body: "", append: this.nodes }),
				newElement("div", { actions: "", append: this.slots.actions }),
			],
		});

		setTimeout(() => this.setAttribute("open", ""), 20);

		this.replaceChildren(content);
		this.width = this.width;

		for (const button of this.slots.actions) {
			if (button instanceof HTMLElement)
				if (button.matches('[type="close"]'))
					button.addEventListener("click", () => this.close());
		}

		if (closeable) {
			this.addEventListener("click", (event) => {
				if (event.target === this) this.close();
			});

			this.addEventListener("keydown", (event) => {
				if (event.key === "Escape") this.close();
			});
		}
	}

	close() {
		this.removeAttribute("open");
		this.addEventListener("transitionend", () => this.remove(), { once: true });
	}

	get width() {
		return this.getAttribute("width") || "auto";
	}

	set width(value) {
		this.setAttribute("width", value);

		value === "auto"
			? this.style.removeProperty("--width")
			: this.style.setProperty("--width", `${value}px`);
	}

	get isOpen() {
		return this.hasAttribute("open");
	}

	open() {
		document.body.append(this);
		setTimeout(() => this.setAttribute("open", ""), 20);
	}
}

customElements.define("w-dialog", WDialog);

/**
 * @typedef {{
 * 	icon: string,
 * 	title: string,
 * 	closeable: boolean,
 *  width: number | string
 * 	content: string | Node | (string | Node)[],
 * 	actions: (string | Node)[],
 * 	[key: string]: any
 * }} DialogOptions
 */

/** @param {Partial<DialogOptions>} options */
export function openDialog({
	icon,
	title,
	closeable,
	content,
	actions,
	...other
} = {}) {
	document.body.append(
		newElement("w-dialog", {
			...other,
			icon,
			title,
			closeable,
			append: [
				...(Array.isArray(content) ? content : [content]),
				newElement("template", { name: "actions", append: actions }),
			],
		}),
	);
}
