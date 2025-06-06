/** @typedef {(typeof WEEKDAYS)[keyof typeof WEEKDAYS]} WEEKDAYS */

export const WEEKDAYS = Object.freeze({
	MONDAY: 0,
	TUESDAY: 1,
	WEDNESDAY: 2,
	THURSDAY: 3,
	FRIDAY: 4,
	SATURDAY: 5,
	SUNDAY: 6,
});

/** @typedef {(typeof MONTHS)[keyof typeof MONTHS]} MONTHS */

export const MONTHS = Object.freeze({
	JANUARY: 0,
	FEBRUARY: 1,
	MARCH: 2,
	APRIL: 3,
	MAY: 4,
	JUNE: 5,
	JULY: 6,
	AUGUST: 7,
	SEPTEMBER: 8,
	OCTOBER: 9,
	NOVEMBER: 10,
	DECEMBER: 11,
});

/** @typedef {(typeof SCHEDULE)[keyof typeof SCHEDULE]} SCHEDULE */

export const SCHEDULE = Object.freeze({
	T700AM: 0,
	T730AM: 1,
	T800AM: 2,
	T830AM: 3,
	T900AM: 4,
	T930AM: 5,
	T1000AM: 6,
	T1030AM: 7,
	T1100AM: 8,
	T1130AM: 9,
	T1200PM: 10,
	T1230PM: 11,
	T100PM: 12,
	T130PM: 13,
	T200PM: 14,
	T230PM: 15,
	T300PM: 16,
	T330PM: 17,
	T400PM: 18,
	T430PM: 19,
	T500PM: 20,
	T530PM: 21,
	T600PM: 22,
	T630PM: 23,
	T700PM: 24,
	T730PM: 25,
	T800PM: 26,
	T830PM: 27,
	T900PM: 28,
});

/** @typedef {(typeof ROLES)[keyof typeof ROLES]} ROLES */

export const ROLES = Object.freeze({
	MIS: "mis",
	VPAA: "vpaa",
	ADMIN: "admin",
});

/** @typedef {(typeof NAME)[keyof typeof NAME]} NAME */

export const NAME = Object.freeze({
	/** Juan Dela Cruz */
	REGULAR: 0,
	/** Juan A. Dela Cruz */
	WITH_INITIAL: 1,
	/** Juan Antonio Dela Cruz */
	FULLNAME: 2,
	/** Dela Cruz, Juan A. */
	SURNAME: 3,
	/** Dela Cruz, Juan Antonio */
	SURNAME_FULL: 4,
	/** Dr. Juan Antonio Dela Cruz */
	WITH_TITLE: 5,
	/** Dr. Juan A. Dela Cruz */
	WITH_INITIAL_TITLE: 6,
});

/** @typedef {(typeof SHIFTS)[keyof typeof SHIFTS]} SHIFTS */
export const SHIFTS = Object.freeze({
	BOTH: 0,
	AM: 1,
	PM: 2,
});

/** @typedef {(typeof STATUS)[keyof typeof STATUS]} STATUS */
export const STATUS = Object.freeze({
	FULL_TIME: 0,
	PART_TIME: 1,
});

export const ROOMTYPE = Object.freeze({
	COMLAB: "comlab",
	HRSLAB: "hrslab",
	REGULAR: "regular",
});
