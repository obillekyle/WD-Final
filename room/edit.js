import { openDialog } from "/@components/dialog.js";
import { WInput } from "/@components/input.js";
import { WTable } from "/@components/table.js";
import { Room } from "/@script/blueprint.js";
import { ROOMTYPE } from "/@script/enums.js";
import {
	assert,
	debounce,
	newElement,
	q$,
	switchCase,
} from "/@script/utils.js";

import "/@script/page/account-setup.js";
import { WSwitch } from "/@components/switch.js";

const params = new URLSearchParams(location.search);
const ids = JSON.parse(params.get("ids") || "[]");

/** @type {Record<string, Room>} */
const inputs = Object.fromEntries(
	ids.map((id) => [id, { ...Room.get(id) }]).filter(([id]) => id in Room.data),
);

console.log(
	inputs,
	ids.map((id) => [id, { ...Room.get(id) }]),
	ids.filter((id) => id in Room.data),
);

if (!ids.length || !Object.keys(inputs).length) {
	openDialog({
		icon: "material-symbols:warning",
		title: "No provided rooms",
		content: "No rooms were provided to edit.",
		actions: [
			newElement("w-button", {
				text: "Close",
				type: "close",
				href: "./index.html",
			}),
		],
	});
}

const saveBtn = q$("#save");
const inputsContainer = q$("#inputs");
const table = q$("w-table", null, WTable);

saveBtn?.addEventListener("click", saveChanges);
assert(table, "Table not found");

// render table

table.page = 1;
table.columns = {
	name: "Room Name",
	id: "Room ID",
	type: "Room Type",
	available: "Availability",
};

function getData() {
	return Object.entries(inputs).map(([id, data]) => ({
		id: id.toUpperCase(),
		name: data.name,
		type: switchCase(String(data.type), [
			[ROOMTYPE.COMLAB, "Computer Lab"],
			[ROOMTYPE.HRSLAB, "HRS Lab"],
			[ROOMTYPE.REGULAR, "Regular Room"],
			[switchCase.DEFAULT, "Unknown"],
		]),
		available: data.available ? "Available" : "Unavailable",
	}));
}

table.data = getData();

function renderTable() {
	assert(table, "Table not found");
	table.data = getData();
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

	Object.entries(inputs).forEach(([index, input]) => {
		const { name, available, type } = input;

		const form = newElement("form", { id: `form-${index}` });
		const divider = newElement("w-input-divider", {
			text: `Room id ${index} (${type})`,
		});

		const nameInput = newElement("w-input", {
			$: WInput,
			name: "name",
			label: "Room Name",
			icon: "material-symbols:meeting-room-outline",
			required: true,
			value: name,
			onchange: () => {
				input.name = nameInput.value;
			},
		});

		const checkbox = newElement("w-switch", {
			$: WSwitch,
			name: "available",
			checked: available,
			onchange: () => {
				input.available = checkbox.checked;
			},
		});

		const availableInput = newElement("div", {
			class: "flex gap-auto align-center",
			append: ["Available", checkbox],
		});

		form.append(divider, nameInput, availableInput);
		inputsContainer.append(form);
	});
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
	}

	if (valid) {
		for (const [index, input] of Object.entries(inputs)) {
			Room.data[index] = new Room({
				id: index,
				name: input.name,
				type: input.type,
				available: input.available,
			});
		}

		openDialog({
			icon: "material-symbols:info-outline",
			title: "Success",
			content: "Rooms edited successfully.",
			actions: [
				newElement("w-button", {
					text: "Close",
					type: "close",
					variant: "outlined",
					onclick: "./index.html",
				}),
			],
		});
	}
}
