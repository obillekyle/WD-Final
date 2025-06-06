/**
 * @template T
 * @param {new (arg0: any) => T} type
 * @returns {(data: any) => Record<string, T>}
 */
export function transformData(type) {
	return (data) =>
		Object.fromEntries(
			Object.entries(data).map(([key, value]) => [key, new type(value)]),
		);
}
