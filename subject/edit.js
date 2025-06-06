import { openDialog } from "/@components/dialog.js";
import { WInput } from "/@components/input.js";
import { WDropdown } from "/@components/select.js";
import { WTable } from "/@components/table.js";
import { Program, Subject } from "/@script/blueprint.js";
import { assert, debounce, newElement, q$ } from "/@script/utils.js";

import "/@script/page/account-setup.js";

const params = new URLSearchParams(location.search);
const ids = JSON.parse((params.get("ids") || "").toLowerCase());

/** @type {Record<string, Subject>} */
const inputs = Object.fromEntries(
	ids
		.map((id) => [id, { ...Subject.get(id) }])
		.filter(([id]) => id in Subject.data),
);

if (!ids.length || !Object.keys(inputs).length) {
	openDialog({
		icon: "material-symbols:warning",
		title: "No provided subjects",
		content: "No subjects were provided to edit.",
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
const dropdownItems = Object.entries(Program.data).map(([id, data]) => ({
	value: id,
	label: data.name,
}));

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

table.data = Object.entries(inputs).map(([id, data]) => ({
	id: id.toUpperCase(),
	title: data.title,
	program: data.program,
	units: data.units,
}));

function renderTable() {
	assert(table, "Table not found");
	table.data = Object.entries(inputs).map(([id, data]) => ({
		id: id.toUpperCase(),
		title: data.title,
		program: data.program,
		units: data.units,
	}));
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
		const { program, title, units } = input;

		const form = newElement("form", { id: `form-${index}` });
		const divider = newElement("w-input-divider", {
			text: `Subject ${index.toUpperCase()}`,
		});

		const programs = newElement(
			"w-dropdown",
			{
				name: "program",
				label: "Program",
				icon: "mingcute:department-line",
				required: true,
				placeholder: "Select Program",
				value: program,
			},
			WDropdown,
		);

		programs.options = dropdownItems;
		programs.onchange = () => {
			input.program = programs.value;
		};

		const unitsInput = newElement(
			"w-input",
			{
				label: "Units",
				type: "number",
				icon: "material-symbols:star-outline",
				name: "units",
				required: true,
				min: 1,
				max: 3,
				value: units,
				onchange: () => {
					input.units = Number(unitsInput.value || 0);
				},
			},
			WInput,
		);

		const titleInput = newElement(
			"w-input",
			{
				label: "Program Title",
				icon: "mdi:card-text-outline",
				name: "title",
				required: true,
				value: title,
				onchange: () => {
					input.title = titleInput.value;
				},
			},
			WInput,
		);

		form.append(divider, titleInput, programs, unitsInput);
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
			Subject.data[index.toLowerCase()] = new Subject({
				id: index,
				...input,
			});
		}

		openDialog({
			icon: "material-symbols:info-outline",
			title: "Success",
			content: "Subjects edited successfully.",
			actions: [
				newElement("w-button", {
					text: "Close",
					type: "close",
					variant: "outlined",
					onclick: "../subject.html",
				}),
			],
		});
	}
}
