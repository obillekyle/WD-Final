import { ROLES, SCHEDULE, SHIFTS, STATUS, WEEKDAYS } from "./enums.js";
import { getValue, setValue } from "./storage.js";
import { getBrowserAndOS } from "./utils.js";

// ==========================================
// ============== Data arrays ===============
// ==========================================

/** @type {Record<string, import("./blueprint.js").Account>} */
export const accounts = getValue("accounts", {
	mis: {
		title: "Mr.",
		fname: "User",
		lname: "MIS",
		mname: "",
		email: "mis@bpc.edu.ph",
		password: btoa("mis"),
		role: ROLES.MIS,
	},
	vpaa: {
		title: "Mr.",
		fname: "User",
		lname: "VPAA",
		mname: "",
		email: "vpaa@bpc.edu.ph",
		password: btoa("vpaa"),
		role: ROLES.VPAA,
	},
	admin: {
		title: "Mr.",
		fname: "User",
		lname: "Admin",
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

/** @type {Record<string, import("./blueprint.js").Program>} */
// biome-ignore format: much better
export const programs = getValue(
	"programs",
	{
		BSIS:   { name: "Bachelor of Science in Information Systems"                 },
		BTVTED: { name: "Bachelor of Technical-Vocational Teacher Education"         },
		BSED:   { name: "Bachelor of Secondary Education"                            },
		SMAW:   { name: "Shielded Metal Alloy Welding"                               },
		HRS:    { name: "Hotel and Restaurant Services"                              },
		BSOM:   { name: "Bachelor of Science in Office Management"                   },
		BSAIS:  { name: "Bachelor of Science in Accountancy and Information Systems" },
		ACT:    { name: "Associate in Computer Technology"                           },
		BSCS:   { name: "Bachelor of Science in Computer Science"                    },
		DHMRT:  { name: "Diploma in Hotel Management and Restaurant Technology"      },
	},
);

/** @type {Record<string, import("./blueprint.js").Faculty>} */
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

/** @type {Record<string, import("./blueprint.js").Room>} */
export const rooms = getValue("rooms", {
	R101: { name: "Room 101", type: "regular", available: true },
	R102: { name: "Room 102", type: "comlab", available: true },
	HL1: { name: "HRS Lab 1", type: "hrslab", available: true },
	CL1: { name: "ComLab 1", type: "comlab", available: true },
});

/** @type {Record<string, import("./blueprint.js").Section>} */
export const sections = getValue("sections", {
	1: { program: "BSIS", year: 1, section: "A" },
	2: { program: "BSIS", year: 1, section: "B" },
	3: { program: "BSIS", year: 1, section: "C" },
	4: { program: "BSIS", year: 1, section: "D" },
	5: { program: "BSIS", year: 1, section: "E" },
});

/** @type {Record<string, import("./blueprint.js").Subject>} */
// biome-ignore format : much better
export const subjects = getValue(
	"subjects",
	{
		cccp113:    { title: "Computer Programming 1",                       program: "BSIS", 	 units: 3 },
		cccp123:    { title: "Computer Programming 2",                       program: "BSIS", 	 units: 3 },
		isfis123:   { title: "Fundamentals of Information System",           program: "BSIS", 	 units: 3 },
		pathfit112: { title: "Physical Activity Towards Health and Fitness", program: "PATHFIT", units: 2 },
		isic113:    { title: "Introduction To Computing",                    program: "BSIS", 	 units: 3 },
		ctwd123:    { title: "Web Development",                              program: "BSIS", 	 units: 3 },
	},
);

/** @type {Record<string, import("./blueprint.js").Schedule>} */
export const schedules = getValue("schedules", {
	0: {
		subject: "cccp113",
		faculty: 1,
		section: 1,
		day: WEEKDAYS.MONDAY,
		start: SCHEDULE.T700AM,
		end: SCHEDULE.T1000AM,
		room: "R101",
	},
	1: {
		subject: "cccp113",
		faculty: 1,
		section: 1,
		day: WEEKDAYS.TUESDAY,
		start: SCHEDULE.T700AM,
		end: SCHEDULE.T1000AM,
		room: "R102",
	},
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
 * @param {number} userId
 * @param {string} action
 * @returns {void}
 */
export function accessLog(userId, action) {
	fetch("https://freeipapi.com/api/json")
		.then(
			(response) =>
				/** @type {Promise<import("./type").IPObject>} */ (response.json()),
		)
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
