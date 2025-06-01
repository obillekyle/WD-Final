import { bindAttrs, newElement } from "/@script/utils.js";
import { Setup } from "./!mixins.js";
import { createIcon, getInputAttributes, takeAttribute } from "./!util.js";

class WBaseInput extends Setup {
	/** @type {HTMLInputElement} */
	input = newElement("input", {}, HTMLInputElement);

	render() {}

	setup() {
		super.setup();
		this.input = bindAttrs(this.input, getInputAttributes(this));

		this.innerHTML = "";
		this.addEventListener("click", () => this.input.focus());
		this.role = this.getAttribute("role") || "textbox";

		this.render();
	}

	get value() {
		return this.input.value;
	}

	set value(value) {
		this.input.value = value;
		this.dispatchEvent(new Event("input"));
		this.dispatchEvent(new Event("change"));
	}

	set disabled(value) {
		this.input.disabled = value;
		this.toggleAttribute("aria-disabled", value);
	}

	get type() {
		return this.input.type;
	}

	set type(value) {
		this.input.type = value;
	}

	get disabled() {
		return this.input.disabled;
	}

	get checked() {
		return this.input.checked;
	}
}

export class WInput extends WBaseInput {
	render() {
		const icon1 = createIcon(takeAttribute(this, "icon"));
		const icon2 = createIcon(takeAttribute(this, "right-icon"));
		const prefix = takeAttribute(this, "prefix");
		const suffix = takeAttribute(this, "suffix");
		const label = takeAttribute(this, "label");

		const content = newElement("div");
		const iPrefix = prefix ? newElement("span", { html: prefix }) : "";
		const iSuffix = suffix ? newElement("span", { html: suffix }) : "";
		const iLabel = newElement("span", {
			label: "",
			append: label ? [label] : this.nodes,
		});

		content.append(iLabel, iPrefix, this.input, iSuffix);
		this.replaceChildren(icon1, content, icon2);
	}
}

export class WInputPass extends WBaseInput {
	visible = createIcon("material-symbols:visibility-outline", {
		onclick: () => this.toggleShow(),
		eye: "",
	});

	render() {
		const icon1 = createIcon(takeAttribute(this, "icon"));
		const label = takeAttribute(this, "label");

		const content = newElement("div", {
			append: [
				newElement("span", { label: "", append: label ? [label] : this.nodes }),
				this.input,
			],
		});

		this.type = "password";
		this.append(icon1, content, this.visible);
	}

	toggleShow() {
		switch (this.type) {
			case "password":
				this.type = "text";
				this.visible.setAttribute(
					"icon",
					"material-symbols:visibility-off-outline",
				);
				break;
			case "text":
				this.type = "password";
				this.visible.setAttribute(
					"icon",
					"material-symbols:visibility-outline",
				);
				break;
		}
	}
}

export class WInputDivider extends HTMLElement {}

customElements.define("w-input", WInput);
customElements.define("w-input-pass", WInputPass);
customElements.define("w-input-divider", WInputDivider);

export default WInput;
