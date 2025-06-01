import "./functions.js";
import "/@components/index.js";

import { WNavigation } from "/@components/navigation.js";
import { ripple } from "./events/ripple.js";
import { bindAttrs, newElement, q$ } from "./utils.js";

window.onpointerdown = (event) => {
	const target = event.target;
	if (!(target instanceof HTMLElement)) return;

	if (target.matches(".ripple")) {
		ripple(event, target);
	}
};

/**
 * Navigation Items
 * @typedef {Object} NavItem
 * @prop {string} icon
 * @prop {string} href
 * @prop {string} match
 * @prop {string} text
 * @prop {boolean} [desktop]
 * @prop {boolean} [mobile]
 */

/** @type {NavItem[]} */
const navItems = [
	{
		icon: "material-symbols:home-outline",
		href: "/dashboard.html",
		match: "/dashboard",
		text: "Home",
	},
	{
		icon: "material-symbols:id-card-outline",
		href: "/data.html",
		match: "/(data|section|subject|faculty|room)",
		text: "Data",
		mobile: true,
	},
	{
		icon: "mdi:teach",
		href: "/faculty/index.html",
		match: "/faculty",
		text: "Faculty",
		desktop: true,
	},
	{
		icon: "material-symbols:book-ribbon-outline",
		href: "/subject/index.html",
		match: "/subject",
		text: "Subjects",
		desktop: true,
	},
	{
		icon: "material-symbols:group-outline",
		href: "/section/index.html",
		match: "/section",
		text: "Sections",
		desktop: true,
	},
	{
		icon: "material-symbols:meeting-room-outline",
		href: "/room/index.html",
		match: "/room",
		text: "Rooms",
		desktop: true,
	},
	{
		icon: "material-symbols:calendar-month-outline",
		href: "/schedule/index.html",
		match: "/schedule",
		text: "Schedule",
	},
];

function navigationFactory() {
	const nav = q$("w-navigation", null, WNavigation);

	if (!nav) return;

	const appLogo = newElement("img", {
		src: "/@assets/logo.webp",
		id: "nav-logo",
		alt: "Logo",
	});

	const navList = newElement("w-navigation-list", {
		append: navItems.map((item) => newElement("w-navigation-item", item)),
	});

	const account = newElement("div", { class: "account" });

	bindAttrs(nav, { replace: [appLogo, navList, account] });
}

navigationFactory();
