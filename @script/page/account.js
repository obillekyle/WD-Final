import { createIcon } from "/@components/!util.js";
import { openDialog } from "/@components/dialog.js";
import { accounts, getUserFullname, getUserImage, profiles } from "../data.js";
import { NAME, ROLES } from "../enums.js";
import { getUser, logout } from "../login.js";
import {
	as,
	expose,
	newElement,
	openFilePicker,
	prepareImage,
	q$,
	switchCase,
} from "../utils.js";
import { update } from "./account-setup.js";

const profile = q$("#profile");
const account = q$("#account-info");

function updateProfile() {
	if (profile && account) {
		const user = getUser();

		if (user) {
			profile.style.backgroundImage = `url(${getUserImage(user.id)})`;
			profile.addEventListener("click", () => handleUpload(user));

			account.innerHTML = "";

			account.append(
				newElement("div", {
					name: "",
					text: getUserFullname(user.id, NAME.FULLNAME),
					append: [
						createIcon("material-symbols:drive-file-rename-outline-outline", {
							edit: "",
							onclick: () => openDetailEditor(),
						}),
					],
				}),
				newElement("div", { mail: "", text: user.email }),
				newElement("w-chip", {
					rounded: true,
					variant: "outlined",
					icon: switchCase(user.role, [
						[ROLES.MIS, "mdi:user-key-outline"],
						[ROLES.VPAA, "ri:suitcase-line"],
						[ROLES.ADMIN, "material-symbols:person-outline"],
					]),
					text: user.role.toUpperCase(),
				}),
			);
		}
	}
}

expose("logout", () => {
	logout();
	window.location.href = "./index.html";
});

async function handleUpload(user) {
	const file = await openFilePicker("image/*");

	if (!file) {
		openDialog({
			icon: "material-symbols:info-outline",
			title: "Error",
			content: "No file selected.",
			actions: [
				newElement("w-button", {
					text: "Okay",
					type: "close",
					variant: "outlined",
				}),
			],
		});
		return;
	}

	const imgString = await prepareImage(file);

	if (!imgString) {
		openDialog({
			icon: "material-symbols:info-outline",
			title: "Error",
			content: "Failed to prepare image.",
			actions: [
				newElement("w-button", {
					text: "Close",
					type: "close",
					variant: "outlined",
				}),
			],
		});

		return;
	}

	profile?.style.setProperty("background-image", `url(${imgString})`);
	profiles[user.id] = imgString;
	update();
}

updateProfile();

function submit(event) {
	event.preventDefault();
	const user = getUser();

	if (!user) {
		openDialog({
			icon: "material-symbols:dangerous-outline",
			title: "Error",
			content: "User is not logged in.",
			actions: [
				newElement("w-button", {
					text: "Reload Window",
					variant: "outlined",
					onclick: () => location.reload(),
				}),
			],
		});

		return;
	}

	const form = as(event.target, HTMLFormElement);

	const data = new FormData(form);
	const values = Object.fromEntries(data.entries());

	accounts[user.id] = Object.assign(accounts[user.id], values);

	updateProfile();

	document.body.append(
		newElement("w-dialog", {
			icon: "material-symbols:info-outline",
			title: "Success",
			text: "Profile updated successfully.",
			append: [
				newElement("slot", {
					name: "actions",
					append: [
						newElement("w-button", {
							text: "Close",
							type: "close",
							variant: "outlined",
							onclick: () =>
								/** @type {any} */ (form.closest("w-dialog")).close(),
						}),
					],
				}),
			],
		}),
	);
}

function openDetailEditor() {
	const user = getUser();

	if (!user) return;

	const form = newElement("form", {
		$: HTMLFormElement,
		onsubmit: submit,
		class: "flex-col gap-md",
		append: [
			newElement("w-input", {
				label: "Title",
				icon: "material-symbols:badge-outline",
				name: "title",
				type: "text",
				value: user.title,
			}),
			newElement("w-input", {
				label: "First Name",
				icon: "material-symbols:person-outline",
				name: "fname",
				type: "text",
				value: user.fname,
				required: true,
			}),
			newElement("w-input", {
				icon: " ",
				label: "Last Name",
				name: "lname",
				type: "text",
				value: user.lname,
			}),
			newElement("w-input", {
				icon: " ",
				label: "Middle Name",
				name: "mname",
				type: "text",
				value: user.mname,
			}),
			newElement("w-input", {
				icon: "mdi:at",
				label: "Email",
				name: "email",
				type: "email",
				value: user.email,
			}),
		],
	});

	openDialog({
		title: "Update Profile",

		width: 600,

		content: form,
		actions: [
			newElement("w-button", {
				text: "Cancel",
				type: "close",
				variant: "outlined",
			}),
			newElement("w-button", {
				text: "Update",
				onclick: () => form.requestSubmit(),
			}),
		],
	});
}
