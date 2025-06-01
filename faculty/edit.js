import { openDialog } from "/@components/dialog.js";
import { WDropdown } from "/@components/select.js";
import { faculties, getFacultyName, programs } from "/@script/data.js";
import { getFacultyCard } from "/@script/mgmt/faculty.js";
import { debounce, newElement, q$ } from "/@script/utils.js";
import "/@script/page/account-setup.js";

const department = q$("#department", null, WDropdown);
const params = new URLSearchParams(window.location.search);

const id = params.get("id") || "";
const faculty = faculties[id];

const saveBtn = q$("#save");
const preview = q$(".preview");
const form = q$("form", null, HTMLFormElement);

if (!faculty) {
	openDialog({
		icon: "material-symbols:warning",
		title: "Faculty not found",
		content: "The faculty you are trying to edit does not exist.",
		actions: [
			newElement("w-button", {
				text: "Close",
				type: "close",
				href: "../faculty.html",
			}),
		],
	});
}

if (form) {
	Object.entries(faculty).forEach(([key, value]) => {
		form[key].value = value;
	});
}

if (department) {
	department.options = Object.entries(programs).map(([id, data]) => ({
		value: id,
		label: data.name,
	}));
}

preview?.append(getFacultyCard(faculties));
saveBtn?.addEventListener("click", editFaculty);
form?.addEventListener("input", () => debounce(updatePreview, 500));

function updatePreview() {
	const formData = new FormData(form);

	preview?.replaceChildren(getFacultyCard(Object.fromEntries(formData)));
}

updatePreview();

function editFaculty() {
	if (form?.checkValidity()) {
		const formData = new FormData(form);
		const data = Object.fromEntries(formData);

		/** @type {import('@script/data').Faculty} */
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

		faculties[id] = newFaculty;

		openDialog({
			icon: "material-symbols:check",
			title: "Faculty edited successfully",
			content: `The faculty ${getFacultyName(id)} has been edited successfully`,
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
