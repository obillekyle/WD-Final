import { openDialog } from "/@components/dialog.js";
import { WInput } from "/@components/input.js";
import { WDropdown } from "/@components/select.js";
import { WTable } from "/@components/table.js";
import { Program, Section } from "/@script/blueprint.js";
import { assert, debounce, newElement, q$ } from "/@script/utils.js";
import "/@script/page/account-setup.js";

const params = new URLSearchParams(window.location.search);
const ids = JSON.parse(params.get("ids") || "[]");

/** @type {Record<string, Section>} */
const inputs = Object.fromEntries(
	ids.map((id) => [id, Section.get(id)]).filter(([id]) => id in Section.data),
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
	name: "Name",
	program: "Program",
	year: "Year",
	section: "Section",
};

const yearItems = [
	{ value: "1", label: "First Year" },
	{ value: "2", label: "Second Year" },
	{ value: "3", label: "Third Year" },
	{ value: "4", label: "Fourth Year" },
];

function renderTable() {
	assert(table, "Table not found");
	table.data = Object.entries(inputs).map(([id, data]) => ({
		id,
		name: data._name,
		program: data.program,
		year: data.year,
		section: data.section,
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
		const { program, section, year } = input;

		const form = newElement("form", { id: `form-${index}` });
		const divider = newElement("w-input-divider", {
			text: `Section ${index.toUpperCase()}`,
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
			required: true,
			label: "Section",
			placeholder: "A",
			value: section,
			onchange: () => {
				input.section = sectionInput.value;
			},
		});

		form.append(divider, programs, yearInput, sectionInput);
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
			Section.data[index] = input;
		}

		openDialog({
			icon: "material-symbols:info-outline",
			title: "Success",
			content: "Sections edited successfully.",
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
