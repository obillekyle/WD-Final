import { days, timeRows } from "./constants.js";
import {
	accounts,
	faculties,
	profiles,
	programs,
	rooms,
	schedules,
	sections,
	session,
	subjects,
} from "./data.js";
import {
	NAME,
	ROLES,
	ROOMTYPE,
	SCHEDULE,
	SHIFTS,
	STATUS,
	WEEKDAYS,
} from "./enums.js";
import {
	filteredJoin,
	prepareImage,
	svgToBase64,
	switchCase,
} from "./utils.js";

/**
 * @template T
 * @typedef {Partial<import("./type").StaticObject<T>>} Static
 */

function binder(thisArg, options) {
	Object.keys(options).forEach((key) => {
		thisArg[key] = options[key] ?? thisArg[key];
	});
}

/**
 * @template {object} T
 * @param {(new (...args: any[]) => T)} cls
 * @param {*} data
 * @returns {Record<string, T>}
 */
function dataBinder(cls, data) {
	return new Proxy(data, {
		get: (target, name) => {
			return name in target
				? new cls({ ...target[name], id: name })
				: undefined;
		},
		set: (target, name, value) => {
			target[name] = value.toJSON();
			return true;
		},
		deleteProperty: (target, name) => {
			delete target[name];
			return true;
		},
	});
}

/** @typedef {{id?: number | string}} ID */
export class WithID {
	/** @param {string | number} [id] */
	constructor(id) {
		this._id = String(id ?? "");
	}
}

// Blueprints

// biome-ignore lint: static session
export class Session {
	/**
	 * @param {string} login
	 * @param {string} password
	 */
	static login(login, password) {
		if (Session.loggedIn()) return false;

		login = login.toLowerCase();
		password = btoa(password);
		let account = accounts[login];

		if (!account) {
			Object.entries(accounts).find(([key, value]) => {
				if (value.email === login) {
					login = key;
					account = value;
					return true;
				}
			});
		}

		if (!account || account.password !== password) {
			return false;
		}

		session.loggedAs = login;
		session.loggedAt = Date.now();

		return true;
	}

	static get currentUser() {
		return Account.get(session.loggedAs || "");
	}

	static loggedIn() {
		return !!Session.currentUser;
	}

	static logout() {
		session.loggedAs = undefined;
		session.loggedAt = undefined;
	}
}

export class UserInfo extends WithID {
	title = "";
	fname = "";
	mname = "";
	lname = "";
	email = "";

	get _initials() {
		const mname = this.mname;
		if (!mname) return "";

		const mArr = mname.trim().split(" ");
		return `${mArr.map((m) => m[0]).join("")}. `;
	}

	toJSON() {
		return {
			title: this.title,
			fname: this.fname,
			mname: this.mname,
			lname: this.lname,
			email: this.email,
		};
	}
}

// biome-ignore lint: static
export class Avatars {
	static get(id) {
		const user = Account.get(id);
		console.log(user);

		return profiles[id] || Avatars.svgAvatar(user?.fname[0] || "?");
	}

	static async set(id, urlOrFile) {
		profiles[id] =
			typeof urlOrFile === "string" ? urlOrFile : await prepareImage(urlOrFile);
	}

	static remove(id) {
		delete profiles[id];
	}

	static svgAvatar(initials) {
		initials = String(initials || "?")
			.trim()
			.toUpperCase();

		const svg = `
				<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128">
					<rect width="100%" height="100%" fill="#555" rx="16"/>
					<text x="50%" y="50%" font-size="64" fill="#fff" font-family="sans-serif"
								text-anchor="middle" dominant-baseline="central">${initials}</text>
				</svg>`;

		return `data:image/svg+xml;base64,${svgToBase64(svg)}`;
	}
}

export class Account extends UserInfo {
	/** @type {string} */ password = "";
	/** @type {ROLES} */ role = ROLES.ADMIN;

	/** @param {ID & Static<Account>} [options] */
	// @ts-ignore
	constructor({ id, ...options } = {}) {
		super(id);
		binder(this, options);
	}

	/** @param {NAME} [format] */
	formatName(format = NAME.REGULAR) {
		const { title, fname, mname, lname } = this;
		const initial = this._initials;

		// biome-ignore format: much better
		return filteredJoin(
			switchCase(format, [
				[NAME.REGULAR,            [fname, lname]],
				[NAME.WITH_INITIAL,       [fname, initial, lname]],
				[NAME.FULLNAME,           [fname, mname, lname]],
				[NAME.SURNAME,            [`${lname},`, fname, initial]],
				[NAME.SURNAME_FULL,       [`${lname},`, fname, mname]],
				[NAME.WITH_TITLE,         [title, fname, mname, lname]],
				[NAME.WITH_INITIAL_TITLE, [title, `${lname},`, fname, initial]],
				[switchCase.DEFAULT,      [fname, lname]],
			]), 
			" "
		);
	}

	get _avatar() {
		return Avatars.get(this._id);
	}

	toJSON() {
		return {
			...super.toJSON(),
			password: this.password,
			role: this.role,
		};
	}

	/**
	 * @param {string | number} id
	 * @returns {Account | undefined} account with given id
	 */
	static get(id) {
		return Account.data[id];
	}

	static get nextId() {
		return Math.max(...Object.keys(accounts).map(Number));
	}

	/**
	 * @param {string | number} id
	 * @param {NAME} [format]
	 */
	static getName(id, format = NAME.REGULAR) {
		return Account.get(id)?.formatName(format) || "";
	}

	static get data() {
		return dataBinder(Account, accounts);
	}
}

export class Faculty extends UserInfo {
	/** @type {STATUS} */ status = STATUS.FULL_TIME;
	/** @type {SHIFTS} */ shift = SHIFTS.BOTH;

	suffix = "";
	department = "";
	contact = "";

	/** @param {Static<Faculty> & ID} [options] */
	constructor({ id, ...options } = {}) {
		super(id);
		binder(this, options);
	}

	/** @param {NAME} [format] */
	formatName(format = NAME.REGULAR) {
		const { title, fname, mname, lname, suffix } = this;
		const initial = this._initials;

		// biome-ignore format: much better
		return filteredJoin(
			switchCase(format, [
				[NAME.REGULAR,            [fname, lname]],
				[NAME.WITH_INITIAL,       [fname, initial, lname]],
				[NAME.FULLNAME,           [fname, mname, lname]],
				[NAME.SURNAME,            [`${lname},`, fname, initial]],
				[NAME.SURNAME_FULL,       [`${lname},`, fname, mname]],
				[NAME.WITH_TITLE,         [title, fname, mname, lname, suffix]],
				[NAME.WITH_INITIAL_TITLE, [title, fname, initial, lname, suffix]],
				[switchCase.DEFAULT,      [fname, lname]],
			]),
			" "
		);
	}

	static get nextId() {
		return Math.max(...Object.keys(faculties).map(Number));
	}

	/** @param {string | number} id */
	static get(id) {
		return Faculty.data[id];
	}

	get _schedules() {
		return Object.values(Schedule.data).filter(
			(s) => String(s.faculty) === this._id,
		);
	}

	toJSON() {
		return {
			...super.toJSON(),
			status: this.status,
			shift: this.shift,
			suffix: this.suffix,
			department: this.department,
			contact: this.contact,
		};
	}

	/**
	 * @param {string | number} id
	 * @param {NAME} [format]
	 */
	static getName(id, format = NAME.REGULAR) {
		return Faculty.get(id)?.formatName(format) || "";
	}

	static get data() {
		return dataBinder(Faculty, faculties);
	}
}

export class Room extends WithID {
	name = "";
	type = "";
	available = true;

	/** @param {Static<Room> & ID} [options] */
	constructor({ id, ...options } = {}) {
		super(id);
		binder(this, options);
	}

	/** @param {string | number} id */
	static get(id) {
		return Room.data[id];
	}

	get _schedules() {
		return Object.values(Schedule.data).filter(
			(s) => String(s.room) === this._id,
		);
	}

	get _typeName() {
		return switchCase(this.type, [
			[switchCase.DEFAULT, "Room"],
			[ROOMTYPE.COMLAB, "Computer Lab"],
			[ROOMTYPE.REGULAR, "Regular Room"],
			[ROOMTYPE.HRSLAB, "HRS Lab"],
		]);
	}

	toJSON() {
		return {
			name: this.name,
			type: this.type,
			available: this.available,
		};
	}

	static get data() {
		return dataBinder(Room, rooms);
	}
}

export class Program extends WithID {
	/** @type {string} */ name = "";

	/** @param {Program & ID} options */
	constructor({ id, ...options }) {
		super(id);

		binder(this, options);
	}

	toJSON() {
		return {
			name: this.name,
		};
	}

	/** @param {string | number} id */
	static get(id) {
		return Program.data[id];
	}

	static get data() {
		return dataBinder(Program, programs);
	}
}

export class Section extends WithID {
	program = "";
	section = "";
	year = 0;

	/** @param {Static<Section> & ID} [options] */
	constructor({ id, ...options } = {}) {
		super(id);
		binder(this, options);
	}

	/**
	 * @param {string | number} id
	 */
	static get(id) {
		return Section.data[id];
	}

	get _name() {
		const { program, year, section } = this;
		return `${program} ${year}${section}`;
	}

	toJSON() {
		return {
			program: this.program,
			section: this.section,
			year: this.year,
		};
	}

	get _schedules() {
		return Object.values(Schedule.data).filter(
			(s) => String(s.section) === this._id,
		);
	}

	static get nextId() {
		return Math.max(...Object.keys(sections).map(Number));
	}

	static get data() {
		return dataBinder(Section, sections);
	}
}

export class Subject extends WithID {
	title = "";
	program = "";
	units = 0;

	/** @param {Static<Subject> & ID} [options] */
	constructor({ id, ...options } = {}) {
		super(id);
		binder(this, options);
	}

	get _schedules() {
		return Object.values(Schedule.data).filter(
			(s) => String(s.subject) === this._id,
		);
	}

	toJSON() {
		return {
			title: this.title,
			program: this.program,
			units: this.units,
		};
	}

	/** @param {string | number} id */
	static get(id) {
		return Subject.data[id];
	}

	static get data() {
		return dataBinder(Subject, subjects);
	}
}

export class Schedule extends WithID {
	/** @type {SCHEDULE | -1} */ start = -1;
	/** @type {SCHEDULE | -1} */ end = -1;
	/** @type {WEEKDAYS | -1} */ day = -1;

	faculty = -1;
	section = -1;

	subject = "";
	room = "";

	/** @param {Static<Schedule> & ID} [options] */
	constructor({ id, ...options } = {}) {
		super(id);
		binder(this, options);
	}

	get _duration() {
		return (this.end - this.start) / 2;
	}

	get _time() {
		return `${timeRows[this.start]} - ${timeRows[this.end]}`;
	}

	get _day() {
		return days[this.day];
	}

	toJSON() {
		return {
			start: this.start,
			end: this.end,
			day: this.day,
			faculty: this.faculty,
			section: this.section,
			subject: this.subject,
			room: this.room,
		};
	}

	static get nextId() {
		return Math.max(...Object.keys(schedules).map(Number));
	}

	/** @param {string | number} id */
	static for(id) {
		return Faculty.get(id)?._schedules || [];
	}

	/** @param {string | number} id */
	static onRoom(id) {
		return Room.get(id)?._schedules;
	}

	/** @param {string | number} id */
	static onSection(id) {
		return Section.get(id)?._schedules;
	}

	/** @readonly */
	static get TODAY() {
		return /** @type {WEEKDAYS} */ ((new Date().getDay() + 6) % 7);
	}

	/** @readonly */
	static get ongoing() {
		const flatten = Object.values(Schedule.data);

		const dateIndex = Schedule.TODAY;
		const weekIndex = (new Date().getDay() + 6) % 7;

		return flatten.filter((schedule) => {
			return (
				schedule.start <= dateIndex &&
				schedule.end > dateIndex &&
				schedule.day === weekIndex % 7
			);
		});
	}

	/** @param {Schedule} schedule */
	static hasConflicts(schedule) {
		/** @type {Conflict[]} */
		const conflicts = [];

		for (const existingSchedule of Object.values(Schedule.data)) {
			console.log(schedule._id, existingSchedule._id);
			if (schedule._id && schedule._id === existingSchedule._id) {
				continue;
			}

			if (schedule.day === existingSchedule.day) {
				const isTimeOverlap =
					schedule.start < existingSchedule.end &&
					schedule.end > existingSchedule.start;

				if (isTimeOverlap) {
					const reasons = [];
					if (schedule.room === existingSchedule.room) {
						reasons.push("Room conflict");
					}
					if (schedule.faculty === existingSchedule.faculty) {
						reasons.push("Instructor conflict");
					}

					conflicts.push(
						new Conflict({
							type: "time",
							of: schedule,
							with: existingSchedule,
							reasons,
						}),
					);
				}
			}
		}

		return conflicts;
	}

	/** @param {string | number} id */
	static get(id) {
		return Schedule.data[id];
	}

	static get data() {
		return dataBinder(Schedule, schedules);
	}
}

export class Conflict {
	/** @type {string} */ type;
	/** @type {Schedule} */ of;
	/** @type {Schedule} */ with;
	/** @type {string[]} */ reasons;

	/** @param {Required<Conflict>} options */
	constructor(options) {
		this.of = options.of;
		this.with = options.with;
		this.reasons = options.reasons;
		this.type = options.type;
	}
}
