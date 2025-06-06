/**
 * Gets the input value
 *
 * @param {string} inputName
 * @param {string} [defaultValue]
 * @returns {string}
 */
export function getInputValue(inputName, defaultValue = "") {
	return (
		/** @type {HTMLInputElement} */
		(q$(`input[name="${inputName}"]`)).value || defaultValue
	);
}

/**
 * @typedef {Object} HasQuerySelector
 * @property {(selector: string) => any} querySelector
 */

/**
 * Shorthand for document.querySelector
 * @template {Element} [E=HTMLElement]
 * @param {string} selector
 * @param {HasQuerySelector | null} [root]
 * @param {ElementType<E>} [_]
 * @returns {E | undefined} any
 */
export function q$(selector, root = document, _ = undefined) {
	return /** @type {any} */ (
		(root || document).querySelector(selector) ?? undefined
	);
}

/**
 * Asserted shorthand for document.querySelector
 *
 * @param {string} selector
 * @param {HasQuerySelector} [root]
 * @returns {HTMLElement}
 */
export function aQ$(selector, root = document) {
	return /** @type {any} */ (root.querySelector(selector));
}

/**
 * @param {string} id
 * @returns {HTMLTemplateElement | undefined}
 */
export function getTemplate(id) {
	return /** @type {any} */ (q$(`template#${id}`)) ?? undefined;
}

/**
 * Shorthand for document.querySelectorAll
 *
 * @param {string} selector
 * @returns {HTMLElement[]}
 */
export function qAll$(selector) {
	return /** @type {any} */ (Array.from(document.querySelectorAll(selector)));
}

/**
 * @typedef TemplateString
 * @type {{
 *     raw: readonly string[] | ArrayLike<string>
 *   } | string
 * }
 */ /**
 * @param {TemplateString} str
 * @param {any[]} args
 * @returns {string}
 */
export function fromRaw(str, ...args) {
	return typeof str === "string" ? str : String.raw(str, ...args);
}

/**
 * @param {TemplateStringsArray} strings
 * @param {any[]} values
 * @returns {string}
 */
export function html(strings, ...values) {
	return fromRaw(strings, ...values)
		.replace(/\s*\n\s*/g, " ")
		.replace(/\s{2,}/g, " ")
		.trim();
}

/**
 * @param {string} url
 * @param {RequestInit} [options]
 * @returns {Promise<object | undefined>}
 *
 */

export async function getJSON(url, options = {}) {
	const response = await fetch(url, options);
	return response.ok ? response.json() : undefined;
}
/**
 * Generates a random integer between `min` and `max` (inclusive) using an optional seed.
 *
 * @param {number} min - The minimum number.
 * @param {number} max - The maximum number.
 * @param {string | number} [seed] - The seed for the random number generator.
 * @returns {number}
 */
export function rand(min, max, seed = "") {
	let h = 2166136261 >>> 0;
	const seedStr = String(seed);
	for (let i = 0; i < seedStr.length; i++) {
		h ^= seedStr.charCodeAt(i);
		h = Math.imul(h, 16777619);
	}

	h += h << 13;
	h ^= h >>> 7;
	h += h << 3;
	h ^= h >>> 17;
	h += h << 5;

	const normalized = (h >>> 0) / 2 ** 32;

	return Math.floor(normalized * (max - min + 1)) + min;
}

/**
 * @typedef {Object} Position
 * @prop {number} x
 * @prop {number} y
 * @param {Event} event
 */
export function isInteractiveEvent(event) {
	return (
		event instanceof MouseEvent ||
		event instanceof TouchEvent ||
		event instanceof PointerEvent
	);
}

/**
 * Returns the position of the event
 * @param {Event} event
 * @returns {Position}
 */
export function getClientPos(event) {
	if (isInteractiveEvent(event)) {
		return "changedTouches" in event
			? {
					x: event.changedTouches[0].clientX,
					y: event.changedTouches[0].clientY,
				}
			: { x: event.clientX, y: event.clientY };
	}

	const target = event.currentTarget;
	if (!(target instanceof HTMLElement)) return { x: 0, y: 0 };

	const { top, left, height, width } = target.getBoundingClientRect();
	return { x: left + width / 2, y: top + height / 2 };
}

/**
 * @template T
 * @typedef {new (...args: any[]) => T | T} ElementType
 */

/**
 * @template T
 * @typedef {{[key: string]: any, $?: ElementType<T>}} Attributes
 */

/**
 * Creates a new element with attributes
 * @template {Element} [E=HTMLElement]
 * @param {string} tagName
 * @param {Attributes<E>} [attributes]
 * @param {ElementType<E>} [_]
 * @returns {E}
 */
export function newElement(tagName, attributes = {}, _ = undefined) {
	/** @type {Element} */
	let element;

	switch (tagName) {
		case "svg":
		case "circle":
		case "path":
		case "g":
		case "rect":
		case "text":
		case "line":
		case "polygon":
		case "polyline":
		case "use":
		case "defs":
		case "clipPath":
		case "linearGradient":
		case "radialGradient":
		case "stop":
		case "image":
		case "tspan":
		case "foreignObject":
		case "desc":
		case "title":
		case "animate":
		case "animateMotion":
		case "animateTransform":
		case "set":
		case "animateColor":
			element = document.createElementNS("http://www.w3.org/2000/svg", tagName);
			break;

		default:
			element = document.createElement(tagName);
			break;
	}

	bindAttrs(element, attributes);
	return /** @type {E} */ (element);
}

/**
 * Binds attributes to an element
 * @template {Element} [E=HTMLElement]
 * @param {E} element
 * @param {Attributes<E>} attributes
 * @returns {E}
 */

export function bindAttrs(element, attributes) {
	const attrArray = Array.isArray(attributes)
		? Object.fromEntries(
				attributes.map((/** @type {any} */ attr) => [attr, ""]),
			)
		: attributes || {};

	for (const [key, value] of Object.entries(attrArray)) {
		if (key === "$") {
			continue;
		}

		if (value === undefined || value === null || value === false) {
			element.removeAttribute(key);
			continue;
		}

		if (key.startsWith("on") && typeof value === "function") {
			element.addEventListener(key.slice(2).toLowerCase(), value);
			continue;
		}

		if (value === true) {
			element.setAttribute(key, "");
			continue;
		}

		switch (key) {
			case "append": {
				if (!Array.isArray(value)) continue;

				if (element instanceof HTMLTemplateElement) {
					element.content.append(...value);
					continue;
				}

				element.append(...value);
				continue;
			}

			case "replace": {
				if (!Array.isArray(value)) continue;
				element.replaceChildren(...value);
				continue;
			}

			case "innerHTML":
			case "innerText":
			case "textContent": {
				element[key] = String(value);
				continue;
			}

			case "text": {
				element.textContent = String(value);
				continue;
			}

			case "html": {
				element.innerHTML = String(value);
				continue;
			}

			case "style":
				if (
					"style" in element &&
					element.style instanceof CSSStyleDeclaration
				) {
					if (typeof value === "object") {
						const cssArray = [];
						for (const [prop, val] of Object.entries(value)) {
							cssArray.push(`${prop}: ${val}`);
						}

						element.style.cssText = cssArray.join("; ");
						continue;
					}

					element.style.cssText = String(value);
				}
				continue;
			case "dataset": {
				if (!(element instanceof HTMLElement)) continue;
				if (typeof value !== "object") continue;
				Object.assign(element.dataset, value);
				continue;
			}

			case "class":
			case "className": {
				if (element instanceof SVGElement) continue;
				element.className = String(value);
				continue;
			}
		}

		element.setAttribute(key, String(value));
	}

	return element;
}

/**
 * @param {number} itemCount
 * @param {string | any[]} array
 */
export function getRandomItemsFromArray(itemCount, array) {
	const count = itemCount > array.length ? array.length : itemCount;

	const copiedArray = [...array];
	const newArray = [];

	for (let i = 0; i < count; i++) {
		const index = rand(0, copiedArray.length - 1);
		newArray.push(copiedArray[index]);
		copiedArray.splice(index, 1);
	}

	return newArray;
}

/**
 * @param {string} str
 */
export function toKebabCase(str) {
	return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}

/**
 * @param {Element} element
 * @param {string} selector
 * @returns {HTMLElement | null}
 */
export function getParent(element, selector) {
	let parent = element.parentElement;
	while (parent) {
		if (parent.matches(selector)) return parent;
		parent = parent.parentElement;
	}
	return null;
}

/**
 * @param {string} str
 */
export function getUppercaseLetters(str) {
	const matches = str.match(/[A-Z0-9]/g);
	return matches ? matches.join("") : "";
}

/**
 * @template {Element} T
 * @param {Element} element
 * @param {T} newElement
 */
export function replaceElement(element, newElement) {
	const parent = element.parentElement;
	parent?.replaceChild(newElement, element);
	return newElement;
}

/**
 * @param {any[]} arr
 * @param {string} separator
 */
export function filteredJoin(arr, separator) {
	return arr.filter(Boolean).join(separator);
}

export function getBrowserAndOS() {
	const ua = navigator.userAgent;
	let browser = "Unknown";
	let os = "Unknown";

	if (/Edg\//.test(ua)) browser = "Microsoft Edge";
	else if (/OPR\//.test(ua)) browser = "Opera";
	else if (/Chrome\//.test(ua)) browser = "Chrome";
	else if (/Firefox\//.test(ua)) browser = "Firefox";
	else if (/Safari\//.test(ua)) browser = "Safari";

	if (/Windows NT/.test(ua)) os = "Windows";
	else if (/Mac OS X/.test(ua)) os = "macOS";
	else if (/Android/.test(ua)) os = "Android";
	else if (/iPhone|iPad|iPod/.test(ua)) os = "iOS";
	else if (/Linux/.test(ua)) os = "Linux";

	return `${browser} on ${os}`;
}

/**
 * @overload
 * @param {Record<string, any>} obj
 */
/**
 * @overload
 * @param {string} key
 * @param {any} value
 */
/**
 * @param {string | Record<string, any>} key
 * @param {any} [value]
 * @returns {void}
 */
export function expose(key, value) {
	// @ts-ignore
	window.app ||= {};
	// @ts-ignore

	Object.assign(window.app, key instanceof Object ? key : { [key]: value });
}

/**
 * @param {HTMLElement} el
 * @param {number} count
 * @param {number} [duration]
 */
export function animateCounter(el, count, duration = 1000) {
	const start = performance.now();
	const from = 0;
	const to = count;

	/**
	 * @param {number} now
	 */
	function tick(now) {
		const progress = Math.min((now - start) / duration, 1);
		const value = Math.floor(from + (to - from) * progress);
		el.textContent = value.toString();

		if (progress < 1) {
			requestAnimationFrame(tick);
		}
	}

	requestAnimationFrame(tick);
}

// A function that resizes the picture to 256px by 256px
// and then converts it to a webp file

/**
 *
 * @param {File | Blob} file
 */
export async function prepareImage(file) {
	if (!file || !file.type.match(/^image\//)) return "";

	const canvas = document.createElement("canvas");
	canvas.width = 256;
	canvas.height = 256;
	const ctx = canvas.getContext("2d");
	if (!ctx) return "";

	const img = await createImageBitmap(file);

	const { width: srcW, height: srcH } = img;

	const size = Math.min(srcW, srcH);
	const sx = (srcW - size) / 2;
	const sy = (srcH - size) / 2;

	ctx.drawImage(img, sx, sy, size, size, 0, 0, 256, 256);

	return canvas.toDataURL("image/webp");
}

/**
 * @overload
 * @param {string} type
 * @param {false} multiple
 * @returns {Promise<File | null>}
 */
/**
 * @overload
 * @param {string} type
 * @returns {Promise<File | null>}
 */
/**
 * @overload
 * @param {string} type
 * @param {true} multiple
 * @returns {Promise<File[]>}
 */
/**
 * @param {string} type
 * @param {boolean} [multiple]
 * @returns {Promise<File[] | File | null>}
 */
export async function openFilePicker(type, multiple = false) {
	return new Promise((resolve) => {
		const input = document.createElement("input");
		input.type = "file";
		input.accept = type;
		input.multiple = multiple;
		input.onchange = () => {
			const files = input.files || [];
			resolve(multiple ? Array.from(files) : files[0]);
		};
		input.click();
	});
}

const timeouts = new Map();
/**
 * @param {() => void} callback
 * @param {number | undefined} delay
 */
export function debounce(callback, delay) {
	timeouts.has(callback) ? clearTimeout(timeouts.get(callback)) : callback();
	timeouts.set(
		callback,
		setTimeout(() => {
			callback();
			timeouts.delete(callback);
		}, delay),
	);
}

/** @type {(value: any, message?: string) => asserts value} */
export function assert(value, message = "Assertion failed") {
	if (!value) throw new Error(message);
}

/**
 * @template {string | number} T
 * @template K
 *
 * @overload
 * @param {T} value
 * @param {[(T), K][]} cases
 * @param {K} [defaultValue]
 * @returns {K | undefined}
 */
/**
 * @template {string | number} T
 * @template K
 *
 * @overload
 * @param {T} value
 * @param {[(T), K][]} cases
 * @param {K} defaultValue
 * @returns {K}
 */
/**
 * @template {string | number} T
 * @template K
 *
 * @overload
 * @param {T} value
 * @param {[(T | typeof switchCase.DEFAULT), K][]} cases
 * @returns {K}
 */

/**
 * @template {string | number} T
 * @template K
 * @param {T} value
 * @param {[(T | typeof switchCase.DEFAULT), K][]} cases
 * @param {K} [defaultValue]
 * @returns {K | undefined}
 */
export function switchCase(value, cases, defaultValue) {
	for (const [v, k] of cases) if (v === value) return k;
	return cases.find(([v]) => v === switchCase.DEFAULT)?.[1] || defaultValue;
}

switchCase.DEFAULT = Symbol();

/**
 * @template {Element} E
 * @param {any} value
 * @param {ElementType<E>} _
 * @returns {E}
 */
export function as(value, _) {
	return /** @type {any} */ (value);
}

export function svgToBase64(svg) {
	const svgBytes = new TextEncoder().encode(svg);
	let binary = "";
	svgBytes.forEach((byte) => {
		binary += String.fromCharCode(byte);
	});

	return btoa(binary);
}
