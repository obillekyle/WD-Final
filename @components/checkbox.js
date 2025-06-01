import { ripple } from "/@script/events/ripple.js";
import { bindAttrs, newElement } from "/@script/utils.js";
import { Setup } from "./!mixins.js";
import {
	clickWithSpaceAndEnter,
	createIcon,
	getInputAttributes,
	takeAttribute,
} from "./!util.js";

export class WBaseCheckbox extends Setup {
	content = newElement("div");
	input = newElement("input", {}, HTMLInputElement);
	indicator = newElement("div", { indicator: "" });

	iActive = createIcon("mdi:checkbox-marked", ["checked", "noobserver"]);
	iInactive = createIcon("mdi:checkbox-blank-outline", [
		"unchecked",
		"noobserver",
	]);

	setup() {
		super.setup();

		this.innerHTML = "";
		this.role = this.getAttribute("role") || "checkbox";
		this.disabled = this.hasAttribute("disabled");

		const label = takeAttribute(this, "label");
		this.content.append(...(label ? [label] : this.nodes));

		this.input = bindAttrs(this.input, {
			...getInputAttributes(this),
			type: "checkbox",
		});

		this.append(this.input, this.indicator, this.content);
		this.indicator.append(this.iInactive, this.iActive);

		this.addEventListener("click", () => this.input.click());
		this.addEventListener("pointerdown", (e) => ripple(e, this.indicator));
		this.input.addEventListener("keyup", (event) =>
			clickWithSpaceAndEnter(event, this.indicator),
		);
	}

	get checked() {
		return this.input.checked;
	}

	set checked(value) {
		this.input.checked = value;
	}

	set disabled(value) {
		this.input.disabled = value;
		this.toggleAttribute("aria-disabled", value);
		this.indicator.tabIndex = value ? -1 : 0;
	}

	get disabled() {
		return this.input.disabled;
	}
}

export class WCheckbox extends WBaseCheckbox {
	setup() {
		super.setup();

		const indeterminate = this.hasAttribute("indeterminate");
		indeterminate && this.iActive.setAttribute("icon", "mdi:minus-box");
	}
}

export class WRadio extends WBaseCheckbox {
	connectedCallback() {
		this.iActive.setAttribute("icon", "mdi:radiobox-marked");
		this.iInactive.setAttribute("icon", "mdi:circle-outline");

		this.input = bindAttrs(this.input, { type: "radio" });
	}
}

customElements.define("w-checkbox", WCheckbox);
customElements.define("w-radio", WRadio);

export default WCheckbox;
