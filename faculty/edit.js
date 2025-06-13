import { openDialog } from "/@components/dialog.js";
import { WDropdown } from "/@components/select.js";
import { Faculty, Program } from "/@script/blueprint.js";
import { getFacultyCard } from "/@script/mgmt/faculty.js";
import { debounce, newElement, q$ } from "/@script/utils.js";
import "/@script/page/account-setup.js";

const department = q$("#department", null, WDropdown);
const params = new URLSearchParams(window.location.search);

const id = params.get("id") || "";
const faculty = Faculty.get(id);

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
				href: "./index.html",
			}),
		],
	});
}

if (form) {
	Object.entries(faculty).forEach(([key, value]) => {
		if (form[key]) form[key].value = value;
	});
}

if (department) {
	department.options = Object.entries(Program.data).map(([id, data]) => ({
		value: id,
		label: data.name,
	}));
}

preview?.append(getFacultyCard(faculty));
saveBtn?.addEventListener("click", editFaculty);
form?.addEventListener("input", () => debounce(updatePreview, 500));

function updatePreview() {
	const formData = new FormData(form);

	preview?.replaceChildren(
		getFacultyCard(new Faculty(Object.fromEntries(formData))),
	);
}

updatePreview();

function editFaculty() {
	if (form?.checkValidity()) {
		const formData = new FormData(form);
		const data = Object.fromEntries(formData);

		const newFaculty = new Faculty({
			id,
			...data,
		});

		Faculty.data[id] = newFaculty;

		openDialog({
			icon: "material-symbols:check",
			title: "Faculty edited successfully",
			content: `The faculty ${newFaculty.formatName()} has been edited successfully`,
			actions: [
				newElement("w-button", {
					text: "Close",
					type: "close",
					href: "./index.html",
				}),
			],
		});
		return;
	}

	form?.reportValidity();
}
