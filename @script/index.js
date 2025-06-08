import "./functions.js";
import "/@components/index.js";

import { WNavigation } from "/@components/navigation.js";
import { Session } from "./blueprint.js";
import { ROLES } from "./enums.js";
import { ripple } from "./events/ripple.js";
import { bindAttrs, html, newElement, q$ } from "./utils.js";

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

const user = Session.currentUser;

/** @type {NavItem[]} */
const navItems =
	user?.role === ROLES.ADMIN
		? [
				{
					icon: "material-symbols:home-outline",
					href: "/dashboard.html",
					match: "/dashboard",
					text: "Home",
				},
				{
					icon: "material-symbols:calendar-month-outline",
					href: "/schedule/index.html",
					match: "/schedule",
					text: "Schedule",
				},
			]
		: [
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

function footerFactory() {
	const container = q$("w-content", null);
	if (!container || container.querySelector("#login-form")) return;

	const footer = newElement("footer");

	const bp = newElement("w-breakpoint", {
		container: true,
		html: html`
			<div column>
				<img logo src="/@assets/logo.webp" alt="Logo" />
				<span title>School Scheduling System</span>
				<span>A Scheduling System that manages faculty members' schedule effectively and efficiently</span>
				<span>BSIS 1A SY. 24-25</span>
			</div>
			<div column>
				<w-link 
					href="tel:0448026716"
					icon="material-symbols:call-outline"
				>
					<span>(044) 802 6716</span>
				</w-link>			
				<w-link href="tel:0448026716" icon=" ">
					<span>(044) 802 6716</span>
				</w-link>
				<w-link href="mailto:communications@bpc.edu.ph" icon="mdi:at">
					<span>communications@bpc.edu.ph</span>
				</w-link>
				<w-link 
					target="_blank" 
					icon="material-symbols:location-on-outline"
					href="https://maps.app.goo.gl/EcMmAgYDD355aLMq5" 
				>
					<span>110a MacArthur Hwy, Malolos, Bulacan 3000</span>
				</w-link>
			</div>
		`,
	});

	footer.replaceChildren(bp);
	container.append(footer);
}

footerFactory();
navigationFactory();
