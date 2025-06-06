import { Faculty, Room, Schedule, Section } from "../blueprint.js";
import { newElement, q$ } from "../utils.js";
import "/@script/page/account-setup.js";

const occupiedRooms = q$("#occupied");

for (const schedule of Schedule.ongoing) {
	occupiedRooms?.append(
		newElement("div", {
			class: "room ripple",
			append: [
				newElement("span", { text: Room.get(schedule.room) }),
				newElement("span", { text: Section.get(schedule.section) }),
				newElement("span", { text: Faculty.getName(schedule.faculty) }),
			],
			onclick: () => {
				location.href = `./schedule/index.html?type=room&id=${schedule.room}`;
			},
		}),
	);
}
