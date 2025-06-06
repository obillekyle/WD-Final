import { openDialog } from "/@components/dialog.js";
import { WInput } from "/@components/input.js";
import { expose, newElement, q$ } from "/@script/utils.js";
import { Session } from "../blueprint.js";

const params = new URLSearchParams(location.search);
const redirect = atob(params.get("redirect") || btoa("./dashboard.html"));

if (Session.loggedIn()) location.href = redirect;

const form = q$("#login-form", null, HTMLFormElement);
if (form) {
	form.onsubmit = onSubmit;
	form.onkeyup = (event) => event.key === "Enter" && form.requestSubmit();
}

function onSubmit(event) {
	event.preventDefault();

	const userInput = q$("#username", null, WInput);
	const passInput = q$("#password", null, WInput);

	if (!userInput || !passInput) {
		openDialog({
			icon: "material-symbols:dangerous-outline",
			title: "Internal error",
			content: "Login form not found.",
			actions: [
				newElement("w-button", {
					text: "Refresh",
					onclick: () => location.reload(),
				}),
			],
		});

		return;
	}

	const username = userInput?.value;
	const password = passInput?.value;

	if (Session.login(username, password)) {
		location.href = redirect;
		return true;
	}

	userInput.input.setCustomValidity("Invalid username or password.");
	passInput.input.setCustomValidity("Invalid username or password.");
}

expose("onSubmit", onSubmit);
