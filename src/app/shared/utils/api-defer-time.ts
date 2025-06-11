export async function apiDeferTime(timeMs = 1200): Promise<void> {
	return await new Promise((resolve) => setTimeout(resolve, timeMs));
}
