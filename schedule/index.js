import { WDropdown } from "/@components/select.js";
import { timeRows } from "/@script/constants.js";
import { NAME, ROLES, WEEKDAYS } from "/@script/enums.js";
import {
	as,
	assert,
	bindAttrs,
	newElement,
	q$,
	qAll$,
	replaceElement,
	throttle,
	toCapitalized,
} from "/@script/utils.js";
import "/@script/page/account-setup.js";
import { openDialog } from "/@components/dialog.js";
import {
	Faculty,
	Room,
	Schedule,
	Section,
	Session,
	Subject,
} from "/@script/blueprint.js";

const TYPE = Object.freeze({
	ROOM: "room",
	FACULTY: "faculty",
	SECTION: "section",
});

const user = Session.currentUser;

if (!user) {
	openDialog({
		title: "Internal Error",
		content: "You must be logged in to view this page.",
		actions: [
			newElement("w-button", {
				text: "OK",
				onclick: () => location.reload(),
			}),
		],
	});

	assert(user);
}

// get search params
const params = new URLSearchParams(window.location.search);
let type = params.get("type") || TYPE.ROOM;
let id = params.get("id") || "";

// define static data
const colors = ["red", "orange", "yellow", "green", "blue", "indigo", "violet"];
let column = 0;
let cellStart = -1;
let cellEnd = -1;
let initialStart = -1;

let dragging = false;
let startClick = 0;

// load dropdowns
const facultyInput = q$("#facultyInput", null, WDropdown);
const roomInput = q$("#roomInput", null, WDropdown);
const subjectInput = q$("#subjectInput", null, WDropdown);
const sectionInput = q$("#sectionInput", null, WDropdown);
const dayInput = q$("#dayInput", null, WDropdown);
const startInput = q$("#startInput", null, WDropdown);
const endInput = q$("#endInput", null, WDropdown);

assert(
	facultyInput &&
		roomInput &&
		subjectInput &&
		sectionInput &&
		dayInput &&
		startInput &&
		endInput,
	"Dropdown not found",
);

/**
 * @template T
 * @template {keyof T} K
 * @param {Record<string, T>} data
 * @param {K} key
 * @param {T[K] extends (...args: infer U) => any ? U : never} [args]
 */
function mapper(data, key, args = /** @type {any} */ ([])) {
	return Object.entries(data).map(([id, value]) => ({
		value: id,
		label: typeof value[key] === "function" ? value[key](...args) : value[key],
	}));
}

facultyInput.options = mapper(Faculty.data, "formatName", [NAME.FULLNAME]);
roomInput.options = mapper(Room.data, "name");
subjectInput.options = mapper(Subject.data, "title");
sectionInput.options = mapper(Section.data, "_name");
dayInput.options = Object.entries(WEEKDAYS).map(([id, value]) => ({
	value: String(value),
	label: id[0].toUpperCase() + id.slice(1).toLowerCase(),
}));

const timeOptions = Object.entries(timeRows).map(([id, value]) => ({
	value: id,
	label: value,
}));

startInput.options = timeOptions;
endInput.options = timeOptions;

// load clickable chip & update table
updateChips();

function updateChips() {
	const chips = q$("#scheduleChips");

	chips &&
		bindAttrs(chips, {
			html: "",
			append: [
				newElement("w-chip", {
					text: "Room",
					icon: "material-symbols:meeting-room-outline",
					variant: type === TYPE.ROOM ? "filled" : "outlined",
					onclick: () => {
						type = TYPE.ROOM;
						id = "";
						updateChips();
					},
				}),
				newElement("w-chip", {
					text: "Faculty",
					icon: "mdi:teach",
					variant: type === TYPE.FACULTY ? "filled" : "outlined",
					onclick: () => {
						type = TYPE.FACULTY;
						id = "";
						updateChips();
					},
				}),
				newElement("w-chip", {
					text: "Section",
					icon: "material-symbols:group-outline",
					variant: type === TYPE.SECTION ? "filled" : "outlined",
					onclick: () => {
						type = TYPE.SECTION;
						id = "";
						updateChips();
					},
				}),
			],
		});

	/** @type {WDropdown | null} */
	let dropdown = null;

	switch (type) {
		case TYPE.ROOM:
			{
				const box = q$("#scheduleInput");

				if (box) {
					dropdown = replaceElement(
						box,
						newElement("w-dropdown", {
							$: WDropdown,
							id: "scheduleInput",
							label: "Rooms",
							icon: "material-symbols:meeting-room-outline",
						}),
					);

					dropdown.options = Object.entries(Room.data).map(([key, room]) => ({
						value: key,
						label: room.name,
						checked: key === id,
					}));
				}
			}
			break;
		case TYPE.FACULTY:
			{
				const box = q$("#scheduleInput");

				if (box) {
					dropdown = replaceElement(
						box,
						newElement("w-dropdown", {
							$: WDropdown,
							id: "scheduleInput",
							label: "Faculties",
							icon: "material-symbols:group-outline",
						}),
					);

					dropdown.options = Object.entries(Faculty.data).map(
						([key, faculty]) => ({
							value: key,
							label: faculty.formatName(NAME.FULLNAME),
							checked: key === id,
						}),
					);
				}
			}
			break;
		case TYPE.SECTION:
			{
				const box = q$("#scheduleInput");

				if (box) {
					dropdown = replaceElement(
						box,
						newElement("w-dropdown", {
							$: WDropdown,
							id: "scheduleInput",
							label: "Sections",
							icon: "material-symbols:group-outline",
						}),
					);

					dropdown.options = Object.entries(Section.data).map(
						([key, section]) => ({
							value: key,
							label: section._name,
							checked: key === id,
						}),
					);
				}
			}
			break;
	}

	if (dropdown) {
		dropdown.onchange = () => {
			id = dropdown?.value || "";
			updateTable();
		};

		dropdown.value = id;
	}

	updateTable();
}

// define functions
function resetTable() {
	const table = q$(".sched-table tbody");

	if (!table) return;
	table.innerHTML = "";

	timeRows.forEach((time, index) => {
		const row = newElement("tr", {
			append: [
				newElement("td", { class: "time", textContent: time }),
				newElement("td", { "data-column": 0, "data-row": index }),
				newElement("td", { "data-column": 1, "data-row": index }),
				newElement("td", { "data-column": 2, "data-row": index }),
				newElement("td", { "data-column": 3, "data-row": index }),
				newElement("td", { "data-column": 4, "data-row": index }),
				newElement("td", { "data-column": 5, "data-row": index }),
			],
		});
		table.appendChild(row);
	});
}

function updateTable() {
	resetTable();

	initialStart = -1;
	cellStart = -1;
	cellEnd = -1;

	switch (type) {
		case TYPE.ROOM:
			updateRoomTable(id);
			break;
		case TYPE.FACULTY:
			updateFacultyTable(id);
			break;
		case TYPE.SECTION:
			updateSectionTable(id);
			break;
	}

	history.pushState(null, "", `?type=${type}&id=${id}`);
}

function updateRoomTable(id) {
	resetTable();

	q$("#tableInfo")?.replaceChildren(
		newElement("div", { text: "Bulacan Polytechnic College" }),
		newElement("div", { text: `Room Schedule - ${Room.get(id).name}` }),
		newElement("div", { text: "School Year 2024-2025" }),
	);

	const table = q$(".sched-table tbody", null, HTMLTableElement);
	const roomData = Schedule.onRoom(id);

	if (!table) return;

	for (const [key, entry] of Object.entries(roomData)) {
		const colIndex = entry.day;
		if (colIndex === undefined) return;

		for (let i = entry.start; i < entry.end; i++) {
			const row = table.children[i];
			const cell = q$(`td[data-column="${colIndex}"]`, row);

			if (i === entry.start && cell) {
				bindAttrs(cell, {
					append: [
						newElement("div", { text: entry.subject.toUpperCase() }),
						newElement("div", { text: Faculty.getName(entry.faculty) }),
						newElement("div", { text: Section.get(entry.section)._name }),
					],
				});

				cell.setAttribute("schedule", entry._id);
				cell.setAttribute("rowspan", String(entry.end - entry.start));
				cell.classList.add(colors[Number(key) % colors.length]);
				continue;
			}

			cell?.remove();
		}
	}
}

function updateFacultyTable(id) {
	resetTable();

	q$("#tableInfo")?.replaceChildren(
		newElement("div", { text: "Bulacan Polytechnic College" }),
		newElement("div", { text: `Faculty Schedule - ${Faculty.getName(id)}` }),
		newElement("div", { text: "School Year 2024-2025" }),
	);

	const table = q$(".sched-table tbody", null, HTMLTableElement);
	const facultyData = Schedule.for(id);

	if (!table) return;

	for (const [key, entry] of Object.entries(facultyData)) {
		const colIndex = entry.day;
		if (colIndex === undefined) return;

		for (let i = entry.start; i < entry.end; i++) {
			const row = table.children[i];
			const cell = q$(`td[data-column="${colIndex}"]`, row);

			if (i === entry.start && cell) {
				bindAttrs(cell, {
					append: [
						newElement("div", { text: entry.subject.toUpperCase() }),
						newElement("div", { text: Room.get(entry.room).name }),
						newElement("div", { text: Section.get(entry.section)._name }),
					],
				});

				cell.setAttribute("schedule", entry._id);
				cell.setAttribute("rowspan", String(entry.end - entry.start));
				cell.classList.add(colors[Number(key) % colors.length]);
				continue;
			}

			cell?.remove();
		}
	}
}

function updateSectionTable(id) {
	resetTable();

	q$("#tableInfo")?.replaceChildren(
		newElement("div", { text: "Bulacan Polytechnic College" }),
		newElement("div", { text: `Section Schedule - ${Section.get(id)._name}` }),
		newElement("div", { text: "School Year 2024-2025" }),
	);

	const table = q$(".sched-table tbody", null, HTMLTableElement);
	const sectionData = Schedule.onSection(id);

	if (!table) return;

	for (const [key, entry] of Object.entries(sectionData)) {
		const colIndex = entry.day;
		if (colIndex === undefined) return;

		for (let i = entry.start; i < entry.end; i++) {
			const row = table.children[i];
			const cell = q$(`td[data-column="${colIndex}"]`, row);

			if (i === entry.start && cell) {
				bindAttrs(cell, {
					append: [
						newElement("div", { text: entry.subject.toUpperCase() }),
						newElement("div", { text: Room.get(entry.room).name }),
						newElement("div", { text: Faculty.getName(entry.faculty) }),
					],
				});

				cell.setAttribute("schedule", entry._id);
				cell.setAttribute("rowspan", String(entry.end - entry.start));
				cell.classList.add(colors[Number(key) % colors.length]);
				continue;
			}

			cell?.remove();
		}
	}
}

document.addEventListener("pointerdown", (event) => {
	const target = as(event.target, HTMLElement);

	if (!id) return false;
	if (user.role === ROLES.ADMIN) return false;

	if (startClick + 200 > Date.now()) {
		if (target.hasAttribute("schedule") || target.matches(".selected")) {
			editData(
				Schedule.get(target.getAttribute("schedule") || "") ||
					new Schedule(
						/** @type {any} */ ({
							day: column,
							start: cellStart,
							end: cellEnd + 1,
							[type]: id,
						}),
					),
			);
			return;
		}
	} else {
		startClick = Date.now();
	}

	if (target.matches(".selected, .sidebar, .sidebar *")) return;

	dragging = true;
	document.body.style.cursor = "ns-resize";

	const size = Number(target.getAttribute("rowspan") || 1);
	column = Number(target.dataset.column || -1);
	cellStart = Number(target.dataset.row || -1);
	cellEnd = cellStart + size - 1;
	initialStart = cellStart;

	highlightCells();
});

document.addEventListener("pointermove", (event) => {
	if (!dragging) return;

	const target = as(event.target, HTMLElement);

	if (target.tagName !== "TD" || target.matches(".time")) return;
	if (!target.matches("[data-row]")) return;
	const size = Number(target.getAttribute("rowspan") || 1);
	const pos = Number(target.dataset.row || -1);

	if (pos < initialStart - 5 || pos + size > initialStart + 6) return;

	console.log(size);

	const newPos = Number(target.dataset.row || -1);
	const newEnd = newPos + size - 1;

	cellStart = Math.max(Math.min(newPos, initialStart), initialStart - 5, 0);
	cellEnd = Math.min(Math.max(newEnd, initialStart), initialStart + 5);

	console.log(cellStart, cellEnd);

	highlightCells();
});

document.addEventListener("pointerup", () => {
	dragging = false;
	highlightCells();
	document.body.style.cursor = "default";
});

function highlightCells() {
	const oldCells = qAll$(".sched-table td.selected");

	for (const cell of oldCells) {
		cell.classList.remove("selected", "start", "end", "origin");
	}

	if (cellStart < 0 || cellEnd < 0 || initialStart < 0) return;

	for (let i = cellStart; i <= cellEnd; i++) {
		const cell = q$(`td[data-column="${column}"][data-row="${i}"]`);

		if (!cell) continue;

		const size = Number(cell.getAttribute("rowspan") || 1);
		console.log(cellEnd, i + (size - 1));

		cell.classList.toggle("start", i === cellStart);
		cell.classList.toggle("origin", i === initialStart);
		cell.classList.toggle("end", i + (size - 1) === cellEnd);
		cell.classList.add("selected");
	}
}

/** @param {Schedule} schedule */
function editData(schedule) {
	assert(
		facultyInput &&
			subjectInput &&
			roomInput &&
			sectionInput &&
			startInput &&
			endInput &&
			dayInput,
		"Missing inputs",
	);

	const sidebar = q$(".sidebar", null, HTMLFormElement);

	if (sidebar) {
		sidebar.classList.add("open");

		subjectInput.value = schedule.subject;
		roomInput.value = schedule.room;
		facultyInput.value = String(schedule.faculty);
		sectionInput.value = String(schedule.section);
		startInput.value = String(schedule.start === -1 ? "" : schedule.start);
		endInput.value = String(schedule.end === -1 ? "" : schedule.end);
		dayInput.value = String(schedule.day === -1 ? "" : schedule.day);

		sidebar.onsubmit = (event) => {
			event.preventDefault();
			sidebar.requestSubmit();
			editSchedule(schedule);
			return false;
		};

		sidebar.onreset = (event) => {
			event.preventDefault();
			openDialog({
				icon: "material-symbols:warning-outline",
				closeable: true,
				title: "Delete schedule",
				content: "Are you sure you want to delete this schedule?",
				actions: [
					newElement("w-button", {
						text: "No",
						type: "close",
						variant: "outlined",
					}),
					newElement("w-button", {
						text: "Yes",
						type: "close",
						class: "error",
						onclick: () => deleteSchedule(schedule._id),
					}),
				],
			});
			return false;
		};
	}
}

/** @param {Partial<Schedule>} data */
function editSchedule(data) {
	assert(
		facultyInput &&
			subjectInput &&
			roomInput &&
			sectionInput &&
			startInput &&
			endInput &&
			dayInput,
		"Missing inputs",
	);

	const start = Number(startInput.value);
	const end = Number(endInput.value);

	if (start >= end) {
		openDialog({
			icon: "material-symbols:warning-outline",
			closeable: true,
			title: "Invalid time range",
			content: "Start time must be before end time",
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

	const newData = new Schedule(
		/** @type {any} */ ({
			...data,
			id: data._id || Schedule.nextId,
			faculty: Number(facultyInput.value),
			room: roomInput.value,
			subject: subjectInput.value,
			section: Number(sectionInput.value),
			day: Number(dayInput.value),
			start,
			end,
		}),
	);

	const conflicts = Schedule.hasConflicts(newData);

	if (conflicts.length) {
		openDialog({
			icon: "material-symbols:warning-outline",
			closeable: true,
			title: "Schedule conflict",
			content: [
				newElement("p", {
					append: [
						newElement("b", { text: "Conflict with the following schedules:" }),
						...conflicts.map((c) =>
							newElement("p", { text: c.reasons.join(", ") }),
						),
					],
				}),
				newElement("p", {
					append: [
						newElement("b", { text: "Conflicting schedules:" }),
						...conflicts.map((conflict) => {
							const { subject, section, faculty, room } = conflict.with;

							return newElement("ul", {
								class: "conflict",
								append: [
									newElement("li", { text: Subject.get(subject).title }),
									newElement("li", { text: Section.get(section)._name }),
									newElement("li", { text: Faculty.getName(faculty) }),
									newElement("li", { text: Room.get(room).name }),
									newElement("li", { text: conflict.with._time }),
									newElement("li", { text: conflict.with._day }),
								],
							});
						}),
					],
				}),
			],
			actions: [
				newElement("w-button", {
					text: "Close",
					type: "close",
					variant: "outlined",
				}),
			],
		});
		return false;
	}

	Schedule.data[newData._id] = newData;

	updateTable();
	q$(".sidebar")?.classList.remove("open");
}

function deleteSchedule(id) {
	if (!id) {
		openDialog({
			icon: "material-symbols:warning-outline",
			closeable: true,
			title: "No schedule selected",
			content: "Please select a schedule to delete.",
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

	delete Schedule.data[id];

	updateTable();
	q$(".sidebar")?.classList.remove("open");
}
// @ts-ignore
window.closeSidebar = (event) => {
	if (event.currentTarget !== event.target) return;
	q$(".sidebar")?.classList.remove("open");
};
