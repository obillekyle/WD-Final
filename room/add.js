import { openDialog } from "/@components/dialog.js";
import { WInput } from "/@components/input.js";
import { WDropdown } from "/@components/select.js";
import { rooms } from "../@script/data.js";
import { assert, debounce, newElement, q$ } from "../@script/utils.js";

import "/@script/page/account-setup.js";
import WCheckbox from "/@components/checkbox.js";
import { WTable } from "/@components/table.js";

/** @type {(import('../@script/data.js').Room & {id: string})[]} */

const inputs = [
	{
		id: "",
		available: true,
		type: "",
		name: "",
	},
];

const saveBtn = q$("#save");
const inputsContainer = q$("#inputs");
const table = q$("w-table", null, WTable);
const dropdownItems = [
	{ value: "comlab", label: "Computer Lab" },
	{ value: "hrslab", label: "HRS Lab" },
	{ value: "regular", label: "Regular Room" },
];

saveBtn?.addEventListener("click", saveChanges);

assert(table, "Table not found");

// render table

table.page = 1;
table.columns = {
	title: "Subject Name",
	id: "Subject Code",
	program: "Program",
	units: "Credit Units",
};

table.data = inputs;

function renderTable() {
	assert(table, "Table not found");
	table.data = inputs;
	table.refresh();
}

inputsContainer?.addEventListener("input", () => {
	debounce(renderTable, 500);
});

renderTable();

function renderInputs() {
	if (!inputsContainer) {
		return;
	}

	inputsContainer.innerHTML = "";

	inputs.forEach((input, index) => {
		const { name, available, type, id } = input;

		const form = newElement("form", { id: `form-${index}` });
		const divider = newElement("w-input-divider", {
			append: [
				newElement("span", {
					text: `Room ${index + 1}`,
				}),
				newElement("iconify-icon", {
					icon: "material-symbols:remove",
					onclick: () => {
						inputs.splice(index, 1);
						renderInputs();
					},
				}),
			],
		});

		const idInput = newElement(
			"w-input",
			{
				label: "Room ID (unique)",
				icon: "material-symbols:key-outline",
				name: "id",
				required: true,
				pattern: "^[A-Z0-9]+$",
				title: "Unique and contains CASE letters and numbers",
				placeholder: "A123",
				value: id,
				onchange: () => {
					input.id = idInput.value;
				},
			},
			WInput,
		);

		const nameInput = newElement("w-input", {
			$: WInput,
			label: "Room Name",
			icon: "material-symbols:key-outline",
			name: "name",
			placeholder: "My Room",
			required: true,
			value: name,
			onchange: () => {
				input.id = idInput.value;
			},
		});

		const typeInput = newElement("w-dropdown", {
			$: WDropdown,
			name: "type",
			label: "Room Type",
			icon: "material-symbols:star-outline",
			required: true,
			value: type,
		});

		typeInput.options = dropdownItems;
		typeInput.onchange = () => {
			input.type = typeInput.value;
		};

		const checkbox = newElement("w-checkbox", {
			$: WCheckbox,
			label: "Available",
			name: "available",
			checked: available,
			onchange: () => {
				input.available = checkbox.checked;
			},
		});

		const availableInput = newElement("div", {
			class: "flex gap-auto",
			append: ["Available", checkbox],
		});

		form.append(divider, idInput, nameInput, typeInput, availableInput);
		inputsContainer.append(form);
	});

	inputsContainer.append(
		newElement("w-button", {
			text: "Add Subject",
			type: "button",
			class: "ml-auto",
			variant: "outlined",
			onclick: () => {
				inputs.push({
					id: "",
					available: true,
					type: "",
					name: "",
				});
				renderInputs();
			},
		}),
	);

	renderTable();
}

renderInputs();

function saveChanges() {
	const forms = document.querySelectorAll("form");

	let valid = true;

	for (const form of forms) {
		if (!form.reportValidity()) {
			valid = false;
			break;
		}

		if (form.code.value in rooms) {
			valid = false;
			form.code.setCustomValidity("Subject code already exists");
			form.reportValidity();
			break;
		}
	}

	if (valid) {
		for (const input of inputs) {
			rooms[input.id] = {
				name: input.name,
				available: input.available,
				type: input.type,
			};
		}

		openDialog({
			icon: "material-symbols:info-outline",
			title: "Success",
			content: "Rooms added successfully.",
			actions: [
				newElement("w-button", {
					text: "Close",
					type: "close",
					variant: "outlined",
					href: "./index.html",
				}),
			],
		});
	}
}
