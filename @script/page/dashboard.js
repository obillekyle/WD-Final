import { Room, Schedule, Section, Session } from "../blueprint.js";
import { timeRows } from "../constants.js";
import { faculties, rooms, sections, subjects } from "../data.js";
import { NAME } from "../enums.js";
import { animateCounter, assert, newElement, q$ } from "../utils.js";
import "/@script/page/account-setup.js";

const user = Session.currentUser;

assert(user, "User must be logged in");

const tRooms = q$("#total-rooms");
const tFaculty = q$("#total-faculty");
const tSubjects = q$("#total-subjects");
const tSections = q$("#total-sections");

const schedulesNow = Schedule.ongoing;

if (tRooms) animateCounter(tRooms, Object.keys(rooms).length);
if (tFaculty) animateCounter(tFaculty, Object.keys(faculties).length);
if (tSubjects) animateCounter(tSubjects, Object.keys(subjects).length);
if (tSections) animateCounter(tSections, Object.keys(sections).length);

const tClasses = q$("#total-classes");
if (tClasses) animateCounter(tClasses, schedulesNow.length);

const classSchedules = q$("#class-schedules");
const occupiedRooms = q$("#occupied-rooms");
const header = q$("w-header");

if (header) header.textContent = user.formatName(NAME.FULLNAME);

for (const { start, end, room, section } of schedulesNow) {
	classSchedules?.append(
		newElement("div", {
			class: "flex gap-auto",
			append: [
				newElement("span", { text: `${timeRows[start]} - ${timeRows[end]}` }),
				newElement("span", { text: Room.get(room).name }),
			],
			onclick: () => {
				location.href = `./schedule.html?type=room&id=${room}`;
			},
		}),
	);

	occupiedRooms?.append(
		newElement("div", {
			class: "room ripple",
			append: [
				newElement("span", { text: Room.get(room).name }),
				newElement("span", { text: Section.get(section)._name }),
			],
			onclick: () => {
				location.href = `./schedule/index.html?type=room&id=${room}`;
			},
		}),
	);
}
