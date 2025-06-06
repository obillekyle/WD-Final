import { openDialog } from "/@components/dialog.js";
import { WTable } from "/@components/table.js";
import { Subject } from "/@script/blueprint.js";
import { assert, debounce, expose, newElement, q$ } from "../@script/utils.js";
import "/@script/page/account-setup.js";

const table = q$("w-table", null, WTable);
assert(table, "Table not found");

table.page = 1;
table.columns = {
	name: "Subject Name",
	id: "Subject Code",
	program: "Program",
	units: "Credit Units",
};

function getTableData() {
	return Object.entries(Subject.data).map(([id, data]) => ({
		id: id.toUpperCase(),
		name: data.title,
		program: data.program,
		units: data.units,
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
	openDialog({
		icon: "material-symbols:delete-outline",
		title: "Delete Subjects",
		content: "Are you sure you want to delete the selected subjects?",
		actions: [
			newElement("w-button", {
				text: "Cancel",
				type: "close",
				variant: "outlined",
			}),
			newElement("w-button", {
				text: "Delete",
				class: "error",
				type: "close",
				onclick: () => {
					for (const id of table.selected) {
						delete Subject.data[id];
					}
					table.data = getTableData();
					table.refresh();
				},
			}),
		],
	});
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
