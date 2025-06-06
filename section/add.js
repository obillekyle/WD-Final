import { openDialog } from "/@components/dialog.js";
import { WInput } from "/@components/input.js";
import { WDropdown } from "/@components/select.js";
import { WTable } from "/@components/table.js";
import { assert, debounce, newElement, q$ } from "../@script/utils.js";

import "/@script/page/account-setup.js";
import { Program, Section } from "/@script/blueprint.js";

const inputs = [new Section()];

const saveBtn = q$("#save");
const inputsContainer = q$("#inputs");
const table = q$("w-table", null, WTable);
const dropdownItems = Object.entries(Program.data).map(([id, data]) => ({
	value: id,
	label: data.name,
}));

const yearItems = [
	{ value: "1", label: "First Year" },
	{ value: "2", label: "Second Year" },
	{ value: "3", label: "Third Year" },
	{ value: "4", label: "Fourth Year" },
];

saveBtn?.addEventListener("click", saveChanges);
assert(table, "Table not found");
// render table

table.page = 1;
table.columns = {
	program: "Program",
	section: "Section",
	year: "Year",
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
		const { program, section, year } = input;

		const form = newElement("form", { id: `form-${index}` });
		const divider = newElement("w-input-divider", {
			append: [
				newElement("span", {
					text: `Section ${index + 1}`,
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

		const programs = newElement("w-dropdown", {
			$: WDropdown,
			name: "program",
			label: "Program",
			icon: "mingcute:department-line",
			required: true,
			value: program,
		});

		const yearInput = newElement("w-dropdown", {
			$: WDropdown,
			name: "program",
			label: "Year",
			icon: "mdi:graduation-cap-outline",
			required: true,
			value: year,
		});

		yearInput.options = yearItems;
		programs.options = dropdownItems;

		programs.onchange = () => {
			input.program = programs.value;
		};

		yearInput.onchange = () => {
			input.year = Number(yearInput.value);
		};

		const sectionInput = newElement("w-input", {
			$: WInput,
			name: "section",
			icon: "material-symbols:star-outline",
			label: "Section",
			required: true,
			placeholder: "A",
			value: section,
			onchange: () => {
				input.section = sectionInput.value;
			},
		});

		form.append(divider, programs, yearInput, sectionInput);
		inputsContainer.append(form);
	});

	inputsContainer.append(
		newElement("w-button", {
			text: "Add Section",
			type: "button",
			class: "ml-auto",
			variant: "outlined",
			onclick: () => {
				inputs.push(new Section());
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
	}

	if (valid) {
		let maxId = Section.nextId;

		for (const input of inputs) {
			Section.data[maxId++] = new Section(input);
		}

		openDialog({
			icon: "material-symbols:info-outline",
			title: "Success",
			content: "Sections added successfully.",
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
