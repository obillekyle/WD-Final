import { Avatars, Faculty } from "../blueprint.js";
import { faculties } from "../data.js";
import { SHIFTS, STATUS } from "../enums.js";
import { filteredJoin, newElement, switchCase } from "../utils.js";

/**
 *
 * @param {Faculty | string} [idOrData]
 * @returns
 */
export function getFacultyCard(idOrData) {
	const data = new Faculty(
		typeof idOrData === "string" ? faculties[idOrData] : idOrData,
	);

	const card = newElement("div", {
		class: "profile-card",
		append: [
			newElement("div", ["cover"]),
			newElement("div", {
				avatar: "",
				style: `background-image: url(${Avatars.svgAvatar()});`,
			}),
			newElement("span", { name: "", text: data.formatName() }),
			newElement("span", {
				text: filteredJoin([data.department, "Instructor"], " - "),
			}),
			newElement("div", { class: "divider" }),
			newElement("div", {
				class: "flex-wrap gap-xs",
				append: [
					newElement("w-chip", {
						icon: "material-symbols:work-history-outline",
						variant: "outlined",
						text: switchCase(Number(data.shift), [
							[SHIFTS.BOTH, "AM/PM"],
							[SHIFTS.AM, "AM"],
							[SHIFTS.PM, "PM"],
							[switchCase.DEFAULT, "N/A"],
						]),
					}),

					newElement("w-chip", {
						icon: "tabler:tie",
						variant: "outlined",
						text: switchCase(Number(data.status), [
							[STATUS.FULL_TIME, "Full Time"],
							[STATUS.PART_TIME, "Part Time"],
							[switchCase.DEFAULT, "N/A"],
						]),
					}),
				],
			}),
		],
	});

	return card;
}
