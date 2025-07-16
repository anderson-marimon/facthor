export async function apiDeferTime(timeMs = 1000): Promise<void> {
	return await new Promise((resolve) => setTimeout(resolve, timeMs));
}
