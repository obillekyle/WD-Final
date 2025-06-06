import { WTable } from "/@components/table.js";
import { Section } from "/@script/blueprint.js";
import { assert, debounce, expose, newElement, q$ } from "/@script/utils.js";
import "/@script/page/account-setup.js";

const table = q$("w-table", null, WTable);
assert(table, "Table not found");

table.page = 1;
table.columns = {
	name: "Section",
	program: "Program",
	year: "Year",
	section: "Section",
};

function getTableData() {
	return Object.entries(Section.data).map(([id, data]) => ({
		id,
		name: data._name,
		program: data.program,
		year: data.year,
		section: data.section,
	}));
}

table.data = getTableData();

table.sort("name", "asc");

function search(value) {
	table?.search(value, "name");
}

function onSearch(event) {
	debounce(search.bind(null, event.target.value), 300);
}

const deleteIcon = q$("#delete");
const editIcon = q$("#edit");
const refreshIcon = q$("#refresh");

refreshIcon?.addEventListener("click", () => table.refresh());
deleteIcon?.addEventListener("click", () => {
	document.body.appendChild(
		newElement("w-dialog", {
			icon: "material-symbols:delete-outline",
			title: "Delete Sections",
			html: "Are you sure you want to delete the selected sections?<br>This action cannot be undone.",
			append: [
				newElement("slot", {
					name: "actions",
					append: [
						newElement("w-button", {
							text: "Cancel",
							type: "close",
							variant: "outlined",
						}),
						newElement("w-button", {
							text: "Delete",
							class: "error",
							onclick: (event) => {
								for (const id of table.selected) {
									delete Section.data[id];
								}
								table.data = getTableData();
								table.refresh();
								event.target.closest("w-dialog").close();
							},
						}),
					],
				}),
			],
		}),
	);
});

editIcon?.addEventListener("click", () => {
	const ids = table.selected;
	location.href = `./edit.html?ids=${JSON.stringify(ids)}`;
});

table.onchange = () => {
	deleteIcon?.toggleAttribute("disabled", !table.selected.length);
	editIcon?.toggleAttribute("disabled", !table.selected.length);
};

expose("search", onSearch);
