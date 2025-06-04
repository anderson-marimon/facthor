import { toast } from 'ngx-sonner';

export function catchHandlerError(args: { error: unknown; message: string; description: string }): void {
	const { error, message, description } = args;
	const _error = error instanceof Error ? error : new Error(String(error));

	toast.message(message, {
		description: _error.message || description,
	});
}
