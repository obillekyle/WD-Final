import { newElement } from "/@script/utils.js";
import { createIcon } from "./!util.js";

function getTextFromAttribute(attribute) {
	if (typeof attribute === "string") return attribute;
	const value = [];
	let div = null;

	for (const [key, val] of Object.entries(attribute)) {
		switch (key) {
			case "append":
			case "prepend":
				for (const v of val) {
					if (typeof v === "string") value.push(v);
					if (v instanceof Node) value.push(v.textContent);
				}
				break;
			case "text":
				value.push(val);
				break;
			case "html":
				div ??= document.createElement("div");
				div.innerHTML = val;

				value.push(div.textContent);
				break;

			default:
				value.push(val);
				break;
		}
	}

	return value.join(" ");
}

// Refactor
export class WTable extends HTMLElement {
	/** @type {any[]} */
	#data = this.#reactive([]);

	#disabled = this.#reactive([]);
	#selected = this.#reactive([]);
	/** @type {Record<string, string>} */
	#columns = this.#reactive({});
	/** @type {Record<string, string>} */
	#dataText = {};

	#sortKey = "";
	#sortOrder = "asc";
	#pageSize = 10;
	#currentPage = 1;
	#search = "";
	#searchKey = "";

	#reactive(object) {
		return new Proxy(object, {
			get: (target, property) => target[property],
			set: (target, property, value) => {
				target[property] = value;
				this.#render();
				this.#generateDataText();
				return true;
			},
		});
	}

	getFilteredData() {
		const d = this.#dataText;
		const data = this.data;

		if (this.#sortKey) {
			data.sort((a, b) => {
				const valA = d[a.id];
				const valB = d[b.id];

				const valANumber = Number(valA);
				const valBNumber = Number(valB);

				if (!Number.isNaN(valANumber) && !Number.isNaN(valBNumber)) {
					return this.#sortOrder === "asc"
						? valANumber - valBNumber
						: valBNumber - valANumber;
				}

				const strA = String(valA).toLowerCase();
				const strB = String(valB).toLowerCase();

				if (strA < strB) return this.#sortOrder === "asc" ? -1 : 1;
				if (strA > strB) return this.#sortOrder === "asc" ? 1 : -1;
				return 0;
			});
		}

		return data
			.filter(({ id }) => {
				if (!this.#search) return true;
				const search = String(this.#search).toLowerCase();
				return String(d[id]).toLowerCase().includes(search);
			})
			.filter(
				(_, index) =>
					index >= (this.#currentPage - 1) * this.#pageSize &&
					index < this.#currentPage * this.#pageSize,
			);
	}

	connectedCallback() {}

	#timeout;
	#render() {
		clearTimeout(this.#timeout);
		this.#timeout = setTimeout(() => {
			const noCheckbox = this.hasAttribute("no-checkbox");
			this.innerHTML = "";

			const filteredData = this.getFilteredData();

			const head = newElement("div", {
				header: "",
				append: [
					noCheckbox
						? ""
						: newElement("w-checkbox", {
								disabled: filteredData.length === 0,
								checked: this.selected.length > 0,
								indeterminate:
									this.selected.length > 0 &&
									filteredData.length !== this.selected.length,
								onchange: (event) => {
									this.selected = event.target.checked
										? filteredData
												.filter((item) => !this.#disabled.includes(item.id))
												.map((item) => item.id)
										: [];
								},
							}),
					...Object.entries(this.#columns).map(([key, value]) => {
						return newElement("div", {
							text: value,
							append: [
								createIcon("material-symbols:arrow-upward-alt", {
									noobserver: "",
									shown: key === this.#sortKey,
									asc: this.#sortOrder === "asc",
								}),
							],
							onclick: () => this.sort(key),
						});
					}),
				],
			});
			const body = newElement("div", {
				body: "",
				append: filteredData.map((item) => {
					return newElement("div", {
						row: "",
						disabled: this.#disabled.includes(item.id),
						append: [
							noCheckbox
								? ""
								: newElement("w-checkbox", {
										checked: this.selected.includes(item.id),
										onchange: (event) => {
											if (event.target.checked) this.selected.push(item.id);
											else
												this.selected = this.selected.filter(
													(id) => id !== item.id,
												);
										},
									}),
							...Object.entries(this.#columns).map(([key]) => {
								const newItem =
									typeof item[key] === "object"
										? item[key]
										: { text: String(item[key]) };

								return newElement("div", newItem);
							}),
						],
					});
				}),
				style: `--table-rows: ${this.#pageSize}`,
			});

			const table = newElement("div", {
				table: "",
				append: [head, body],
			});

			const pagination = newElement("div", {
				pagination: "",
				append: [
					newElement("div", {
						text: `Page ${this.#currentPage} of ${this.maxPage()}`,
					}),
					newElement("div", {
						append: [
							newElement("w-button-icon", {
								icon: "material-symbols:keyboard-arrow-left",
								onclick: () => {
									this.page -= 1;
								},
							}),
							newElement("w-button-icon", {
								icon: "material-symbols:keyboard-arrow-right",
								onclick: () => {
									this.page += 1;
								},
							}),
						],
					}),
				],
			});
			this.append(table, pagination);
		});
	}

	get data() {
		return [...this.#data];
	}

	#timeout2;
	#generateDataText() {
		clearTimeout(this.#timeout2);
		this.#timeout2 = setTimeout(() => {
			this.#dataText = {};
			for (const item of this.#data) {
				this.#dataText[item.id] = getTextFromAttribute(item);
			}
		});
	}

	set data(data) {
		this.selected = [];
		this.#data = this.#reactive(data);
		this.#generateDataText();
		this.#render();
	}

	get disabled() {
		return [...this.#disabled];
	}

	set disabled(value) {
		this.#disabled = this.#reactive(value);
		this.#render();
	}

	get columns() {
		return this.#columns;
	}

	maxPage() {
		return Math.max(1, Math.ceil(this.#data.length / this.#pageSize));
	}

	set columns(columns) {
		this.#columns = this.#reactive(columns);
		this.#render();
	}

	get selected() {
		return this.#selected;
	}

	set selected(selected) {
		this.#selected = new Proxy(selected, {
			get: (target, prop) => {
				if (typeof prop !== "string") return Reflect.get(target, prop);
				return target[prop];
			},
			set: (target, prop, value) => {
				if (typeof prop !== "string") return Reflect.set(target, prop, value);
				target[prop] = value;
				this.dispatchEvent(new CustomEvent("selected", { detail: target }));
				this.dispatchEvent(new Event("change"));
				this.#render();
				return true;
			},
		});

		this.dispatchEvent(new CustomEvent("selected", { detail: this.#selected }));
		this.dispatchEvent(new Event("change"));
		this.#render();
	}

	get page() {
		return this.#currentPage;
	}

	set page(page) {
		this.#currentPage = Math.min(Math.max(page, 1), this.maxPage());
		this.#render();
	}

	get pageSize() {
		return this.#pageSize;
	}

	set pageSize(pageSize) {
		this.#pageSize = pageSize;
		this.#render();
	}

	/**
	 * @param {string} key
	 * @param {'asc' | 'desc'} [order]
	 */
	sort(key, order) {
		this.#sortOrder = order
			? order
			: this.#sortKey === key && this.#sortOrder === "asc"
				? "desc"
				: "asc";
		this.#sortKey = key;
		this.#generateDataText();
		this.#render();
	}

	search(value, key) {
		this.#search = value;
		this.#searchKey = key;
		this.#render();
	}

	refresh() {
		this.#render();
	}
}

customElements.define("w-table", WTable);
