import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { toast } from 'ngx-sonner';

export abstract class AccessInterceptor {
	private readonly _router = inject(Router);
	protected async interceptInternalCodes<T>(promise: Promise<Nullable<TApi<T>>>, callback?: Function): Promise<Nullable<T>> {
		const response = await promise;
		if (response === null) return null;

		try {
			const { ok, internalCode, message, data } = response;

			if (internalCode === 1004) {
				return this.handleInternalCode1004();
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

	protected handleInternalCode1004(): null {
		toast.message('Acceso denegado', {
			description: 'La sesión ha expirado, inicie sesión nuevamente.',
		});

		this._router.navigate(['authentication/sign-in'], { replaceUrl: true });
		return null;
	}
}
