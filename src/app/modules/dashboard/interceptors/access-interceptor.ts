import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { envs } from '@app/envs/envs';
import Cookies from 'js-cookie';
import { toast } from 'ngx-sonner';

export type THttpRequest = {
	path: string;
	method: 'GET' | 'POST' | 'PUT';
	headers: Record<string, string>;
	signal: AbortSignal | null | undefined;
	body?: any;
};

export abstract class AccessInterceptor {
	private readonly _router = inject(Router);

	protected async _HttpRequest<T>(args: THttpRequest) {
		const { path, ...options } = args;

		try {
			const response = await fetch(path, options);
			const result = (await response.json()) as TApi<unknown>;

			switch (result.internalCode) {
				case 1005:
					this._handleInternalCode({
						title: 'Acceso Denegado',
						description: 'Sesión errada, inicie sesión nuevamente.',
					});
					break;
				case 1004:
					this._handleInternalCode({
						title: 'Acceso Denegado',
						description: 'La sesión ha expirado, inicie sesión nuevamente.',
					});
					break;
			}

			if (!response.ok) {
				throw {
					name: 'ApiError',
					message: result.message,
					internalCode: result.internalCode,
					error: result.error,
					status: response.status,
				};
			}

			return result as T;
		} catch (error) {
			throw error;
		}
	}

	private _handleInternalCode(options: { title: string; description: string; redirect?: string }) {
		const { title, description, redirect = 'authentication/sign-in' } = options;
		Cookies.remove(envs.FT_AUTHENTICATION_TOKEN_PATH);

		this._router.navigate([redirect], { replaceUrl: true }).then(() => {});

		// MENSAJES DE ERROR POR ACCESO, DESHABILITADOS.
		// this._router.navigate([redirect], { replaceUrl: true }).then(() => {
		// 	toast.message(title, {
		// 		description: description,
		// 	});
		// });

		throw new Error(description);
	}
}
