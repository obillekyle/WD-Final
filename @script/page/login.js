import { openDialog } from "/@components/dialog.js";
import WInput from "/@components/input.js";
import { isLoggedIn, login } from "/@script/login.js";
import { expose, newElement, q$ } from "/@script/utils.js";

const params = new URLSearchParams(window.location.search);
const redirect = atob(params.get("redirect") || btoa("./dashboard.html"));

if (isLoggedIn()) window.location.href = redirect;

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

	if (login(username, password)) {
		window.location.href = redirect;
		return true;
	}

	userInput.input.setCustomValidity("Invalid username or password.");
	passInput.input.setCustomValidity("Invalid username or password.");
}

expose("onSubmit", onSubmit);
