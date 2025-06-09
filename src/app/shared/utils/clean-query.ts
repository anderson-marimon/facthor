export function cleanQuery(queryParams: any) {
	const cleanQuery: Record<string, string> = Object.fromEntries(
		Object.entries(queryParams ?? {})
			.filter(([_, v]) => v != null)
			.map(([k, v]) => [k, String(v)])
	);

	return cleanQuery;
}
