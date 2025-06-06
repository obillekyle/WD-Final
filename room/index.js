import { openDialog } from "/@components/dialog.js";
import { WTable } from "/@components/table.js";
import { assert, debounce, expose, newElement, q$ } from "../@script/utils.js";

import "/@script/page/account-setup.js";
import { Room } from "/@script/blueprint.js";

const table = q$("w-table", null, WTable);
assert(table, "Table not found");

table.page = 1;
table.columns = {
	name: "Room Name",
	id: "Room Code",
	type: "Room Type",
	available: "Availability",
};

function getTableData() {
	return Object.entries(Room.data).map(([id, data]) => ({
		id,
		name: data.name,
		type: data.type,
		available: data.available ? "Available" : "Unavailable",
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
		title: "Delete Rooms",
		content:
			"Are you sure you want to delete the selected rooms?<br>This action cannot be undone.",
		actions: [
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
						delete Room.data[id];
					}
					table.data = getTableData();
					table.refresh();
					event.target.closest("w-dialog").close();
				},
			}),
		],
	});
});

table.onchange = () => {
	deleteIcon?.toggleAttribute("disabled", !table.selected.length);
	editIcon?.toggleAttribute("disabled", !table.selected.length);
};

editIcon?.addEventListener("click", () => {
	location.href = `./edit.html?ids=${JSON.stringify(table.selected)}`;
});

expose("search", onSearch);
