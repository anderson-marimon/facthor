import { toast } from 'ngx-sonner';

export function catchHandlerError(args: { error: any; message: string; description: string; logError?: boolean }): void {
	const { error, message, description, logError = false } = args;
	const _error = error instanceof Error ? error : new Error(String(error));

	if (logError) console.error(args.error);

	if (_error.name === 'AbortError') return;

	if (Array.isArray(error?.error)) {
		for (const err of error.error) {
			if (Array.isArray(err.errors)) {
				for (const item of err.errors) {
					toast.message(message, {
						description: item || description,
					});
				}
			}
		}
		return;
	}

	if (Array.isArray(error?.error)) {
		for (const errorItem of error.error) {
			toast.message(message, {
				description: errorItem || description,
			});
		}
		return;
	}

	toast.message(message, {
		description: _error.message || description,
	});
}
