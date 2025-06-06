import { bindAttrs, newElement } from "/@script/utils.js";
import { Setup } from "./!mixins.js";
import { createIcon, getInputAttributes, takeAttribute } from "./!util.js";

export class WSwitch extends Setup {
	input = newElement("input", {}, HTMLInputElement);

	setup() {
		const indicator = newElement("div", ["thumb"]);
		const iconActive = createIcon(takeAttribute(this, "icon-active"), [
			"checked",
			"noobserver",
		]);
		const iconInactive = createIcon(takeAttribute(this, "icon-inactive"), [
			"unchecked",
			"noobserver",
		]);

		this.input = bindAttrs(this.input, {
			...getInputAttributes(this),
			type: "checkbox",
		});

		indicator.append(iconInactive, iconActive);
		this.replaceChildren(this.input, indicator);
		this.addEventListener("click", () => this.input.click());
	}

	get checked() {
		return this.input.checked;
	}

	set checked(value) {
		this.input.checked = Boolean(value);
	}
}

customElements.define("w-switch", WSwitch);
