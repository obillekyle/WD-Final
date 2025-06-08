import { createIcon } from "/@components/!util.js";
import { Avatars, Session } from "../blueprint.js";
import { newElement, q$ } from "../utils.js";

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

		user.role === "admin" &&
			document.head.append(
				newElement("style", {
					text: `[admin-hidden] { display: none; }`,
				}),
			);
	} else {
		location.href = `/index.html?redirect=${btoa(location.href)}`;
	}
}

update();
