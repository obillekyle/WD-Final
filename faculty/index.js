import { openDialog } from "/@components/dialog.js";
import { WTable } from "/@components/table.js";
import { faculties, getFacultyName } from "/@script/data.js";
import { SHIFTS, STATUS } from "/@script/enums.js";
import {
	assert,
	debounce,
	expose,
	newElement,
	q$,
	switchCase,
} from "/@script/utils.js";
import "/@script/page/account-setup.js";

const table = q$("w-table", null, WTable);
const searchInput = q$("#search", null, HTMLInputElement);
assert(table, "Table not found");

table.page = 1;
table.columns = {
	name: "Name",
	department: "Department",
	shift: "Preferred Shift",
	status: "Employment",
};

function getTableData() {
	return Object.entries(faculties).map(([id, data]) => ({
		id,
		name: getFacultyName(id),
		email: data.email,
		department: data.department,
		shift: switchCase(data.shift, [
			[SHIFTS.BOTH, "AM/PM"],
			[SHIFTS.AM, "AM"],
			[SHIFTS.PM, "PM"],
		]),
		status: switchCase(data.status, [
			[STATUS.FULL_TIME, "Full Time"],
			[STATUS.PART_TIME, "Part Time"],
		]),
	}));
}

table.data = getTableData();

table.sort("name", "asc");

function search() {
	const value = searchInput?.value;
	table?.search(value, "name");
}

function onSearch() {
	debounce(search, 300);
}

const deleteIcon = q$("#delete");
const editIcon = q$("#edit");
const refreshIcon = q$("#refresh");

refreshIcon?.addEventListener("click", () => table.refresh());
deleteIcon?.addEventListener("click", () => {
	openDialog({
		icon: "material-symbols:warning-outline",
		title: "Delete Faculty",
		content: "Are you sure you want to delete the selected faculties?",
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
						delete faculties[id];
					}
					table.data = getTableData();
					table.refresh();
				},
			}),
		],
	});
});

editIcon?.addEventListener("click", () => {
	const id = table.selected[0];
	location.href = `./faculty/edit.html?id=${id}`;
});

table.onchange = () => {
	deleteIcon?.toggleAttribute("disabled", !table.selected.length);
	editIcon?.toggleAttribute("disabled", table.selected.length !== 1);
};

expose("search", onSearch);
