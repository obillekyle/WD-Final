import { WTable } from "/@components/table.js";
import { getRoomName, rooms } from "/@script/data.js";
import { isLoggedIn } from "/@script/login.js";
import { assert, debounce, expose, newElement, q$ } from "../@script/utils.js";

import "/@script/page/account-setup.js";
import { openDialog } from "/@components/dialog.js";

if (!isLoggedIn) {
	location.href = `./index.html?redirect=${btoa(location.href)}`;
}

const table = q$("w-table", null, WTable);
assert(table, "Table not found");

table.page = 1;
table.columns = {
	name: "Room Name",
	id: "Room Code",
	type: "Room Type",
	available: "Availability",
};

function getRoomType(type) {
	if (type === "regular") return "Regular";
	if (type === "comlab") return "ComLab";
	if (type === "hrslab") return "HRS Lab";
	return "Unknown";
}

function getTableData() {
	return Object.entries(rooms).map(([id, data]) => ({
		id,
		name: getRoomName(id),
		type: getRoomType(data.type),
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
						delete rooms[id];
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

expose("search", onSearch);
