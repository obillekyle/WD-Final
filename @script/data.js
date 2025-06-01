import { NAME, ROLES, SCHEDULE, SHIFTS, STATUS, WEEKDAYS } from "./enums.js";
import { getValue, setValue } from "./storage.js";
import { filteredJoin, getBrowserAndOS } from "./utils.js";

// ==========================================
// ============== Data arrays ===============
// ==========================================

/**
 * @typedef {Object} Account
 * @prop {string} title
 * @prop {string} fname
 * @prop {string} lname
 * @prop {string} mname
 * @prop {string} email
 * @prop {string} password
 * @prop {(typeof ROLES)[keyof typeof ROLES]} role
 *
 */

/** @type {Record<string, Account>} */
export const accounts = getValue("accounts", {
	mis: {
		title: "Mr.",
		fname: "User",
		lname: "",
		mname: "",
		email: "mis@bpc.edu.ph",
		password: btoa("mis"),
		role: ROLES.MIS,
	},
	vpaa: {
		title: "Mr.",
		fname: "User",
		lname: "",
		mname: "",
		email: "vpaa@bpc.edu.ph",
		password: btoa("vpaa"),
		role: ROLES.VPAA,
	},
	admin: {
		title: "Mr.",
		fname: "User",
		lname: "",
		mname: "",
		email: "admin@bpc.edu.ph",
		password: btoa("admin"),
		role: ROLES.ADMIN,
	},
});

/** @type {Record<string, string>} */
export const profiles = getValue("profiles", {
	mis: "",
	vpaa: "",
	admin: "",
});

/** @type {Record<string, string>} */
export const images = getValue("images", {});

/**
 * @typedef {Object} Session
 * @prop {string} [loggedAs]
 * @prop {number} [loggedAt]
 */

/** @type {Session} */
export const session = getValue("session", {});

/**
 * @typedef {Object} Program
 * @prop {string} name
 */

/** @type {Record<string, Program>} */
export const programs = getValue("programs", {
	BSIS: { name: "Bachelor of Science in Information Systems" },
	BTVTED: { name: "Bachelor of Technical-Vocational Teacher Education" },
	BSED: { name: "Bachelor of Secondary Education" },
	SMAW: { name: "Shielded Metal Alloy Welding" },
	HRS: { name: "Hotel and Restaurant Services" },
	BSOM: { name: "Bachelor of Science in Office Management" },
	BSAIS: { name: "Bachelor of Science in Accountancy and Information Systems" },
	ACT: { name: "Associate in Computer Technology" },
	BSCS: { name: "Bachelor of Science in Computer Science" },
	DHMRT: {
		name: "Diploma in Hotel Management and Restaurant Technology",
	},
});

/**
 * @typedef {Object} Faculty
 * @prop {string} title
 * @prop {string} fname
 * @prop {string} lname
 * @prop {string} mname
 * @prop {string} suffix
 * @prop {string} department
 * @prop {number} shift
 * @prop {number} status
 * @prop {string} contact
 * @prop {string} email
 */

/** @type {Record<string, Faculty>} */
export const faculties = getValue("faculties", {
	1: {
		title: "Mr.",
		fname: "Miguel Don",
		lname: "Gatchalian",
		mname: "",
		suffix: "",
		department: "BSIS",
		status: STATUS.FULL_TIME,
		shift: SHIFTS.BOTH,
		contact: "09171234567",
		email: "miguel.dongatchalian@bpc.edu.ph",
	},
	2: {
		title: "Ms.",
		fname: "Joana",
		lname: "Marie Cruz",
		mname: "",
		suffix: "",
		department: "BSIS",
		status: STATUS.FULL_TIME,
		shift: SHIFTS.BOTH,
		contact: "09281234567",
		email: "joana.marie.cruz@bpc.edu.ph",
	},
	3: {
		title: "Mr.",
		fname: "Jaymart",
		lname: "Maala",
		mname: "",
		suffix: "",
		department: "BSIS",
		status: STATUS.PART_TIME,
		shift: SHIFTS.BOTH,
		contact: "09391234567",
		email: "jaymart.maala@bpc.edu.ph",
	},
	4: {
		title: "Ms.",
		fname: "Deserie",
		lname: "Robles",
		mname: "",
		suffix: "",
		department: "BSIS",
		status: STATUS.PART_TIME,
		shift: SHIFTS.BOTH,
		contact: "09471234567",
		email: "deserie.robles@bpc.edu.ph",
	},
	5: {
		title: "Ms.",
		fname: "Lynzel",
		lname: "Valenzuela",
		mname: "",
		suffix: "",
		department: "BSIS",
		status: STATUS.FULL_TIME,
		shift: SHIFTS.BOTH,
		contact: "09581234567",
		email: "lynzel.valenzuela@bpc.edu.ph",
	},
	6: {
		title: "Mr.",
		fname: "Glenn",
		lname: "Beleber",
		mname: "",
		suffix: "",
		department: "BTVTED",
		status: STATUS.PART_TIME,
		shift: SHIFTS.BOTH,
		contact: "09691234567",
		email: "glenn.beleber@bpc.edu.ph",
	},
	7: {
		title: "Mr.",
		fname: "Eric",
		lname: "Santiago",
		mname: "",
		suffix: "",
		department: "",
		status: STATUS.FULL_TIME,
		shift: SHIFTS.BOTH,
		contact: "09771234567",
		email: "eric.santiago@bpc.edu.ph",
	},
	8: {
		title: "Doc.",
		fname: "Eliseo",
		lname: "Amaninche",
		mname: "",
		suffix: "PhD",
		department: "BTVTED",
		status: STATUS.FULL_TIME,
		shift: SHIFTS.BOTH,
		contact: "09881234567",
		email: "eliseo.amaninche@bpc.edu.ph",
	},
	9: {
		title: "Ms.",
		fname: "Elizabeth",
		lname: "Lagman",
		mname: "",
		suffix: "",
		department: "",
		status: STATUS.FULL_TIME,
		shift: SHIFTS.BOTH,
		contact: "09991234567",
		email: "elizabeth.lagman@bpc.edu.ph",
	},
});

/**
 * @typedef {Object} Room
 * @prop {string} name
 * @prop {string} type
 * @prop {boolean} available
 */

/** @type {Record<string, Room>} */
export const rooms = getValue("rooms", {
	R101: { name: "Room 101", type: "regular", available: true },
	R102: { name: "Room 102", type: "comlab", available: true },
	HL1: { name: "HRS Lab 1", type: "hrslab", available: true },
	CL1: { name: "ComLab 1", type: "comlab", available: true },
});

/**
 * @typedef {Object} Section
 * @prop {string} program
 * @prop {number} year
 * @prop {string} section
 */

/** @type {Record<string, Section>} */
export const sections = getValue("sections", {
	1: { program: "BSIS", year: 1, section: "A" },
	2: { program: "BSIS", year: 1, section: "B" },
	3: { program: "BSIS", year: 1, section: "C" },
	4: { program: "BSIS", year: 1, section: "D" },
	5: { program: "BSIS", year: 1, section: "E" },
});

/**
 * @typedef {Object} Subject
 * @prop {string} title
 * @prop {string} program
 * @prop {number} units
 */

/** @type {Record<string, Subject>} */
// prettier-ignore
export const subjects = getValue("subjects", {
	cccp113: { title: "Computer Programming 1", program: "BSIS", units: 3 },
	cccp123: { title: "Computer Programming 2", program: "BSIS", units: 3 },
	isfis123: {
		title: "Fundamentals of Information System",
		program: "BSIS",
		units: 3,
	},
	pathfit112: {
		title: "Physical Activity Towards Health and Fitness",
		program: "PATHFIT",
		units: 2,
	},
	isic113: { title: "Introduction To Computing", program: "BSIS", units: 3 },
	ctwd123: { title: "Web Development", program: "BSIS", units: 3 },
});

/**
 * @typedef {Object} Schedule
 * @prop {string} subject
 * @prop {number} instructor
 * @prop {number} section
 * @prop {0|1|2|3|4|5|6} day
 * @prop {number} start
 * @prop {number} end
 * @prop {number} id
 */

/**
 * @typedef {Schedule & { room: string }} ScheduleWithRoom
 */

/** @type {Record<string, Schedule[]>} */

export const schedules = getValue("schedules", {
	R101: [
		{
			subject: "cccp113",
			instructor: 1,
			section: 1,
			day: WEEKDAYS.MONDAY,
			start: SCHEDULE.T700AM,
			end: SCHEDULE.T1000AM,
			id: 1,
		},
	],
	R102: [
		{
			subject: "cccp113",
			instructor: 1,
			section: 1,
			day: WEEKDAYS.TUESDAY,
			start: SCHEDULE.T700AM,
			end: SCHEDULE.T1000AM,
			id: 2,
		},
	],
});

/**
 * @typedef {Object} AccessLog
 * @prop {number} user
 * @prop {string} action
 * @prop {string} ip
 * @prop {string} location
 * @prop {string} device
 */

/**
 * @type {Record<string, AccessLog>}
 */
export const accessLogs = getValue("accessLogs", {
	[Date.now()]: {
		user: 1,
		action: "Login",
		ip: "127.0.0.1",
		location: "Bulacan, Philippines",
		device: "Chrome",
	},
	[Date.now() + 1]: {
		user: 1,
		action: "Logout",
		ip: "127.0.0.1",
		location: "Bulacan, Philippines",
		device: "Chrome",
	},
});

/**
 * @typedef {Object}  Notification
 * @prop {string} title
 * @prop {string} message
 * @prop {number} time
 * @prop {string} type
 */

/** @type {Record<string, Notification[]>} */
export const notifications = getValue("notifications", {
	mis: [
		{
			title: "Welcome to MIS Dashboard",
			message: "You have successfully logged in to MIS Dashboard.",
			time: Date.now(),
			type: "info",
		},
	],
});

// ==========================================
// ============ Logs and Errors =============
// ==========================================

/**
 /**
 * @typedef {Object} IPObject
 * @property {number} ipVersion
 * @property {string} ipAddress
 * @property {number} latitude
 * @property {number} longitude
 * @property {string} countryName
 * @property {string} countryCode
 * @property {string} timeZone
 * @property {string} zipCode
 * @property {string} cityName
 * @property {string} regionName
 * @property {boolean} isProxy
 * @property {string} continent
 * @property {string} continentCode
 * @property {Object} currency
 * @property {string} currency.code
 * @property {string} currency.name
 * @property {string} language
 * @property {string[]} timeZones
 * @property {string[]} tlds
 */

/**
 * @param {number} userId
 * @param {string} action
 * @returns {void}
 */
export function accessLog(userId, action) {
	const user = accounts[userId];

	if (!user) return;

	fetch("https://freeipapi.com/api/json")
		.then((response) => /** @type {Promise<IPObject>} */ (response.json()))
		.then((data) => {
			accessLogs[Date.now()] = {
				user: userId,
				action,
				ip: data.ipAddress,
				location: `${data.cityName}, ${data.countryName}`,
				device: getBrowserAndOS(),
			};
		});
}

/**
 * @param {string} title
 * @param {string} message
 * @returns {void}
 */
export function addNotification(user, title, message, type = "info") {
	notifications[user] = notifications[user] || [];
	notifications[user].push({ title, message, time: Date.now(), type });

	setValue("notifications", notifications);
}

// ==========================================
// =============== Functions ================
// ==========================================

/**
 * Parse section id to section name
 * @param {number | string} sectionId
 * @returns {string}
 */
export function getSectionName(sectionId) {
	if (!sections[sectionId]) return "";

	const { program, year, section } = sections[sectionId];
	return `${program} ${year}${section}`;
}

export function getRoomName(roomId) {
	if (!rooms[roomId]) return "";

	return rooms[roomId].name;
}

/**
 * Parse subject id to subject name
 *
 * @param {number | string} subjectId
 * @returns {string}
 */
export function getSubjectName(subjectId) {
	if (!subjects[subjectId]) return "";

	return subjects[subjectId].title;
}

/**
 * Parse middle name to initials
 * @param {string} middleName
 * @returns {string} The initials
 */
export function getInitials(middleName) {
	if (!middleName) return "";

	const mArr = middleName.trim().split(" ");
	return `${mArr.map((m) => m[0]).join("")}. `;
}

/**
 * Gets the full name of a given faculty id
 *
 * @param {number | string} facultyId
 * @param {NAME} [format]
 * @returns {string}
 */
export function getFacultyName(facultyId, format = NAME.REGULAR) {
	const user = faculties[facultyId];
	let arr = [];

	if (!user) return "";

	switch (format) {
		case NAME.REGULAR:
			arr = [user.fname, user.lname];
			break;
		case NAME.WITH_INITIAL:
			arr = [user.fname, getInitials(user.mname), user.lname];
			break;
		case NAME.FULLNAME:
			arr = [user.fname, user.mname, user.lname];
			break;
		case NAME.SURNAME_FIRST:
			arr = [`${user.lname},`, user.fname, getInitials(user.mname)];
			break;
		case NAME.SURNAME_FULL:
			arr = [`${user.lname},`, user.fname, user.mname];
			break;
		case NAME.WITH_TITLE:
			arr = [user.title, user.fname, user.mname, user.lname, user.suffix];
			break;
		case NAME.WITH_INITIAL_TITLE:
			arr = [
				user.title,
				user.fname,
				getInitials(user.mname),
				user.lname,
				user.suffix,
			];
			break;
		default:
			arr = [user.fname, user.lname];
	}

	return filteredJoin(arr, " ");
}

/**
 *
 * @param {string | number} userId
 * @param {NAME} [format]
 * @returns {string}
 */
export function getUserFullname(userId, format = NAME.REGULAR) {
	const user = accounts[userId];
	let arr = [];

	if (!user) return "";

	switch (format) {
		case NAME.REGULAR:
			arr = [user.fname, user.lname];
			break;
		case NAME.WITH_INITIAL:
			arr = [user.fname, getInitials(user.mname), user.lname];
			break;
		case NAME.FULLNAME:
			arr = [user.fname, user.mname, user.lname];
			break;
		case NAME.SURNAME_FIRST:
			arr = [`${user.lname},`, user.fname, getInitials(user.mname)];
			break;
		case NAME.SURNAME_FULL:
			arr = [`${user.lname},`, user.fname, user.mname];
			break;
		case NAME.WITH_TITLE:
			arr = [user.title, user.fname, user.mname, user.lname];
			break;
		case NAME.WITH_INITIAL_TITLE:
			arr = [user.title, user.fname, getInitials(user.mname), user.lname];
			break;
		default:
			arr = [user.fname, user.lname];
			break;
	}

	return filteredJoin(arr, " ");
}

/**
 * Returns an array of ongoing schedules
 * @returns {ScheduleWithRoom[]}
 */
export function getOngoingSchedule() {
	const schedulesNow = [];
	const flatten = Object.entries(schedules).flatMap(([room, data]) => {
		return data.map((entry) => ({ room, ...entry }));
	});

	const dateIndex = dateToIndex();
	const weekIndex = (new Date().getDay() + 6) % 7;

	for (const schedule of flatten) {
		if (
			schedule.start <= dateIndex &&
			schedule.end > dateIndex &&
			schedule.day === weekIndex % 7
		) {
			schedulesNow.push(schedule);
		}
	}

	return schedulesNow;
}

function dateToIndex(date = new Date()) {
	const hours = date.getHours();
	const minutes = date.getMinutes();
	const totalMinutes = hours * 60 + minutes;
	const baseMinutes = 7 * 60;

	return Math.floor((totalMinutes - baseMinutes) / 30);
}

/**
 * Get user image
 * @param {string | number} userId
 * @returns {string} image url
 */
export function getUserImage(userId) {
	const user = accounts[userId] || faculties[String(userId).slice(2)];

	if (!user) return "";

	const picture = profiles[userId] || "";

	if (picture.startsWith("data:image/")) {
		return picture;
	}

	return getLetterAvatar(user.fname[0]);
}

export function getLetterAvatar(letter) {
	const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128">
      <rect width="100%" height="100%" fill="#555" rx="16"/>
      <text x="50%" y="50%" font-size="64" fill="#fff" font-family="sans-serif"
            text-anchor="middle" dominant-baseline="central">${String(
							letter || "?",
						).toUpperCase()}</text>
    </svg>`;

	const base64 = svgToBase64(svg);
	return `data:image/svg+xml;base64,${base64}`;
}

function svgToBase64(svg) {
	const svgBytes = new TextEncoder().encode(svg);
	let binary = "";
	svgBytes.forEach((byte) => {
		binary += String.fromCharCode(byte);
	});

	return btoa(binary);
}
/**
 * @typedef {Object} Conflict
 * @property {string} type - Type of conflict ('room', 'instructor', 'time_overlap').
 * @property {ScheduleWithRoom} newSchedule - The schedule being checked for conflicts.
 * @property {ScheduleWithRoom} conflictingSchedule - The existing schedule that conflicts.
 * @property {string[]} reasons - Array of strings describing specific conflict reasons (e.g., "Instructor conflict", "Room conflict").
 */

/**
 * Checks for schedule conflicts based on instructor, room, and time overlaps.
 *
 * @param {ScheduleWithRoom} newSchedule - The schedule object to check for conflicts.
 * @param {Record<string, Schedule[]>} [allExistingSchedules=schedules] - Optional: The full set of existing schedules to check against. Defaults to the global `schedules` object.
 * @returns {Conflict[]} An array of conflict objects, or an empty array if no conflicts are found.
 */
export function checkScheduleConflicts(
	newSchedule,
	allExistingSchedules = schedules,
) {
	const conflicts = [];

	const flattenedExistingSchedules = Object.entries(
		allExistingSchedules,
	).flatMap(([roomId, schedulesInRoom]) => {
		return schedulesInRoom.map((scheduleEntry) => ({
			room: roomId,
			...scheduleEntry,
		}));
	});

	for (const existingSchedule of flattenedExistingSchedules) {
		if (newSchedule.id && newSchedule.id === existingSchedule.id) {
			continue;
		}

		if (newSchedule.day === existingSchedule.day) {
			const isTimeOverlap =
				newSchedule.start < existingSchedule.end &&
				newSchedule.end > existingSchedule.start;

			if (isTimeOverlap) {
				const reasons = [];
				if (newSchedule.room === existingSchedule.room) {
					reasons.push("Room conflict");
				}
				if (newSchedule.instructor === existingSchedule.instructor) {
					reasons.push("Instructor conflict");
				}
				if (reasons.length > 0) {
					conflicts.push({
						type: "time_overlap",
						newSchedule: newSchedule,
						conflictingSchedule: existingSchedule,
						reasons: reasons,
					});
				}
			}
		}
	}

	return conflicts;
}
