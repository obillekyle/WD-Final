import { newElement } from "/@script/utils.js";
import { Interactive } from "./!mixins.js";
import { createIcon, takeAttribute } from "./!util.js";

export class WLink extends Interactive {
	setup() {
		super.setup();

		const container = newElement("div", ["container"]);
		const icon1 = createIcon(takeAttribute(this, "icon"));
		const icon2 = createIcon(
			takeAttribute(this, "right-icon") || this.target === "_blank"
				? "material-symbols:arrow-outward"
				: null,
		);

		container.append(...this.nodes);

		this.replaceChildren(icon1, container, icon2);
		this.root = container;
	}
}

customElements.define("w-link", WLink);
