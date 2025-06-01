import { createIcon } from "/@components/!util.js";
import { profiles } from "../data.js";
import { getUser } from "../login.js";
import { q$ } from "../utils.js";

export function update() {
	const user = getUser();
	const accountIcon = q$(".account");
	if (user && accountIcon) {
		const image = profiles[user.id];

		if (image) accountIcon.style.backgroundImage = `url(${image})`;
		else accountIcon.textContent = user.fname[0].toUpperCase();

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
