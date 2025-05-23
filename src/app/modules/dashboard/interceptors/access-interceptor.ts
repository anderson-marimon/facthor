import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { envs } from '@envs/envs';
import Cookies from 'js-cookie';
import { toast } from 'ngx-sonner';

export abstract class AccessInterceptor {
	private readonly _router = inject(Router);
	private readonly _tokenPath = envs.FT_AUTHENTICATION_TOKEN_PATH;

	protected async interceptInternalCodes<T>(promise: Promise<Nullable<TApi<T>>>, callback?: () => Nullable<T>): Promise<Nullable<T>> {
		const response = await promise;
		if (response === null) return null;

		try {
			const { ok, internalCode, message, data } = response;

			switch (internalCode) {
				case 1005:
					return this._handleInternalCode({
						title: 'Acceso Denegado',
						description: 'Sesión errada, inicie sesión nuevamente.',
					});

				case 1004:
					callback && callback();
					return this._handleInternalCode({
						title: 'Acceso Denegado',
						description: 'La sesión ha expirado, inicie sesión nuevamente.',
					});
			}

			if (!ok) {
				throw new Error(message);
			}

			if (callback) {
				return callback();
			}

			return data;
		} catch (err) {
			const error = err instanceof Error ? err : new Error(String(err));

			toast.message('', {
				description: error.message || 'Error al enviar el formulario de registro, por favor intente nuevamente.',
			});

			return null;
		}
	}

	private _handleInternalCode(options: { title: string; description: string; redirect?: string }): null {
		const { title, description, redirect = 'authentication/sign-in' } = options;

		Cookies.remove(this._tokenPath);

		this._router.navigate([redirect], { replaceUrl: true }).then(() => {
			toast.message(title, {
				description: description,
			});
		});
		return null;
	}
}
