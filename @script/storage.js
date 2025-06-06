/**
 * @template {object | any[]} T
 * @typedef {import("./type").StaticObject<T>} StaticObject
 */
/**
 * @template {object} T
 * @template {string} S
 * @typedef {import("./type").ExcludeStartsWith<T, S>} ExcludeStartsWith
 */

/**
 * @overload
 * @param {string} key
 * @returns {any}
 */

/**
 * @template {object | any[]} T
 * @overload
 * @param {string} key
 * @param {StaticObject<T>} defaultValue
 * @param {(data: StaticObject<T>) => T} [transform]
 * @returns {T}
 */
/**
 * @template {object | any[]} T
 * @param {string} key
 * @param {T | StaticObject<T>} [defs]
 * @param {(data: StaticObject<T>) => T} [transform]
 * @returns {T | undefined}
 */
export function getValue(key, defs, transform = (x) => /** @type {T} */ (x)) {
	const data = localStorage.getItem(key);
	let obj = null;

	try {
		obj = JSON.parse(data || "null") || defs;
	} catch (error) {
		console.error(error);
		obj = defs;
	}

	const proxyMap = new WeakMap();
	if (transform) obj = transform(obj);

	const createRecursiveProxy = (target) => {
		if (typeof target !== "object" || target === null) return target;
		if (proxyMap.has(target)) return proxyMap.get(target);

		const proxy = new Proxy(target, {
			get(t, prop, receiver) {
				const value = Reflect.get(t, prop, receiver);
				return createRecursiveProxy(value);
			},
			set(t, prop, value, receiver) {
				const result = Reflect.set(t, prop, value, receiver);
				setValue(key, obj);
				return result;
			},
			deleteProperty(t, prop) {
				const result = Reflect.deleteProperty(t, prop);
				setValue(key, obj);
				return result;
			},
		});

		proxyMap.set(target, proxy);
		return proxy;
	};

	return createRecursiveProxy(obj);
}

/**
 * @template {object | any[]} T
 * @param {string} key
 * @param {T} value
 * @returns {void}
 */
export function setValue(key, value) {
	localStorage.setItem(key, JSON.stringify(value));
}

/**
 * @param {string} key
 * @returns {boolean}
 */
export function existsStorage(key) {
	return localStorage.getItem(key) !== null;
}
