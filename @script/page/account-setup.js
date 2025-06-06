import { createIcon } from "/@components/!util.js";
import { Avatars, Session } from "../blueprint.js";
import { q$ } from "../utils.js";

export function update() {
	const user = Session.currentUser;
	const accountIcon = q$(".account");

	if (user && accountIcon) {
		accountIcon.style.backgroundImage = `url(${Avatars.get(user._id)})`;

		accountIcon.append(
			createIcon("material-symbols:settings-outline", ["cog"]),
		);
		accountIcon.addEventListener("click", () => {
			location.href = "/account.html";
		});
	} else {
		location.href = `/index.html?redirect=${btoa(location.href)}`;
	}
}

update();
