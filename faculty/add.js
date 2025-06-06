import { openDialog } from "/@components/dialog.js";
import { WDropdown } from "/@components/select.js";
import { Faculty, Program } from "/@script/blueprint.js";
import { getFacultyCard } from "/@script/mgmt/faculty.js";
import { debounce, newElement, q$ } from "/@script/utils.js";

import "/@script/page/account-setup.js";

const department = q$("#department", null, WDropdown);

if (department) {
	department.options = Object.entries(Program.data).map(([id, data]) => ({
		value: id,
		label: data.name,
	}));
}

const saveBtn = q$("#save");
const preview = q$(".preview");
const form = q$("form", null, HTMLFormElement);

preview?.append(getFacultyCard());
saveBtn?.addEventListener("click", addFaculty);
form?.addEventListener("input", () => debounce(updatePreview, 500));

function updatePreview() {
	const formData = new FormData(form);

	preview?.replaceChildren(
		getFacultyCard(new Faculty(Object.fromEntries(formData))),
	);
}

function addFaculty() {
	if (form?.checkValidity()) {
		const formData = new FormData(form);
		const data = Object.fromEntries(formData);
		const newId = Faculty.nextId;

		const newFaculty = new Faculty({
			id: newId,
			...data,
		});

		Faculty.data[newId] = newFaculty;

		openDialog({
			icon: "material-symbols:check",
			title: "Faculty added successfully",
			content: `The faculty ${newFaculty.formatName()} has been added successfully`,
			actions: [
				newElement("w-button", {
					text: "Close",
					type: "close",
					href: "../faculty.html",
				}),
			],
		});

		return;
	}

	form?.reportValidity();
}
