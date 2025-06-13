import { clickWithSpaceAndEnter } from "./!util.js";

export class Setup extends HTMLElement {
	#connected = 0;

	/** @type {HTMLElement} */
	root = this;

	/** @type {Record<string, Node[]>} */
	#slots = new Proxy(Object.create({}), {
		get: (target, name) => {
			target[name] ??= [];
			return target[name];
		},
		set: (target, name, value) => {
			target[name] = value;
			return true;
		},
	});

	get nodes() {
		return this.#slots.default;
	}

	get slots() {
		return this.#slots;
	}

	append = this.root.append.bind(this.root);
	replaceChildren = this.root.replaceChildren.bind(this.root);
	appendChild = this.root.appendChild.bind(this.root);
	replaceChild = this.root.replaceChild.bind(this.root);
	removeChild = this.root.removeChild.bind(this.root);

	setup() {}

	connectedCallback() {
		if (this.#connected++) return;

		for (const node of this.childNodes) {
			if (node.nodeName === "TEMPLATE") {
				const t = /** @type {HTMLTemplateElement} */ (node);
				const slotName = t.getAttribute("name") || "default";
				this.#slots[slotName].push(...t.content.childNodes);
			} else {
				this.nodes.push(node);
			}
		}

		this.innerHTML = "";
		this.setup();
	}
}

export class Interactive extends Setup {
	handle;

	setup() {
		super.setup();

		this.disabled = this.hasAttribute("disabled");

		this.addEventListener("keyup", clickWithSpaceAndEnter.bind(this));
		this.addEventListener("click", () => {
			if (this.disabled) return;

			if (this.type) {
				switch (this.type) {
					case "submit":
						this.closest("form")?.requestSubmit();
						break;
					case "reset":
						this.closest("form")?.reset();
						break;
					case "close":
						/** @type {import('./dialog.js').WDialog} */ (
							this.closest("w-dialog")
						)?.close();
						break;
					default:
						break;
				}
			}

			if (this.download) {
				const link = document.createElement("a");
				link.href = this.href;
				link.download = this.download;
				link.click();
				return;
			}

			if (this.href) window.open(this.href, this.target, this.rel);
		});
	}

	get href() {
		return this.getAttribute("href") || "";
	}

	get target() {
		return this.getAttribute("target") || "_self";
	}

	get rel() {
		return this.getAttribute("rel") || "noopener noreferrer";
	}

	get download() {
		return this.getAttribute("download") || "";
	}

	get type() {
		return this.getAttribute("type") || "";
	}

	set href(value) {
		this.setAttribute("href", value || "");
	}

	set target(value) {
		this.setAttribute("target", value || "");
	}

	set rel(value) {
		this.setAttribute("rel", value || "");
	}

	set download(value) {
		this.setAttribute("download", value || "");
	}

	set type(value) {
		this.setAttribute("type", value || "");
	}

	get disabled() {
		return this.hasAttribute("disabled");
	}

	set disabled(value) {
		this.toggleAttribute("disabled", value);
		this.tabIndex = value ? -1 : 0;
		this.setAttribute("aria-disabled", value.toString());
	}
}
