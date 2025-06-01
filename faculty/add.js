import { openDialog } from "/@components/dialog.js";
import { WDropdown } from "/@components/select.js";
import { faculties, getFacultyName, programs } from "/@script/data.js";
import { getFacultyCard } from "/@script/mgmt/faculty.js";
import { debounce, newElement, q$ } from "/@script/utils.js";

import "/@script/page/account-setup.js";

const department = q$("#department", null, WDropdown);

if (department) {
	department.options = Object.entries(programs).map(([id, data]) => ({
		value: id,
		label: data.name,
	}));
}

const saveBtn = q$("#save");
const preview = q$(".preview");
const form = q$("form", null, HTMLFormElement);

preview?.append(getFacultyCard(faculties));
saveBtn?.addEventListener("click", addFaculty);
form?.addEventListener("input", () => debounce(updatePreview, 500));

function updatePreview() {
	const formData = new FormData(form);

	preview?.replaceChildren(getFacultyCard(Object.fromEntries(formData)));
}

function addFaculty() {
	if (form?.checkValidity()) {
		const formData = new FormData(form);
		const data = Object.fromEntries(formData);
		const newId = Math.max(...Object.keys(faculties).map(Number)) + 1;

		/** @type {import('@script/data.js').Faculty} */
		const newFaculty = {
			title: String(data.title || ""),
			fname: String(data.fname),
			lname: String(data.lname),
			mname: String(data.mname || ""),
			suffix: String(data.suffix || ""),
			email: String(data.email),
			department: String(data.department || ""),
			status: Number(data.status),
			shift: Number(data.shift),
			contact: String(data.contact || ""),
		};

		faculties[newId] = newFaculty;

		openDialog({
			icon: "material-symbols:check",
			title: "Faculty added successfully",
			content: `The faculty ${getFacultyName(newId)} has been added successfully`,
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
