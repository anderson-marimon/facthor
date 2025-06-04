import { resource, ResourceLoaderParams, signal } from '@angular/core';
import { envs } from '@app/envs/envs';
import { toast } from 'ngx-sonner';

export class ApiPostChangePassword {
	private readonly _url = `${envs.FT_URL_LOGIN}${envs.FT_URN}`;
	private readonly _changePasswordForm = signal<Record<string, string>>({});
	private readonly _resource = resource({ request: this._changePasswordForm, loader: (body) => this._changePassword(body) });

	private async _changePassword(_body: ResourceLoaderParams<Record<string, string>>): Promise<boolean> {
		if (Object.keys(this._changePasswordForm()).length === 0) return false;

		const path = `${this._url}${envs.FT_AUTH_CHANGE_PASSWORD}`;
		const { token, ...body } = _body.request;

		try {
			const response = await fetch(path, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'x-change-password': `Bearer ${token}`,
				},
				signal: _body.abortSignal,
				body: JSON.stringify(body),
			});

			const { ok, message }: TApi<boolean> = await response.json();

			if (!ok) {
				throw new Error(message);
			}

			toast.message('Contraseña cambiada', {
				description: 'Operación exitosa, contraseña actualizada.',
			});

			return ok;
		} catch (err) {
			const error = err instanceof Error ? err : new Error(String(err));

			toast.message('Cambio de contraseña fallido', {
				description: error.message || 'Por favor, intenta nuevamente.',
			});

			return false;
		}
	}

	public readonly isLoading = this._resource.isLoading;
	public readonly response = this._resource.value;

	public changePassword(form: Record<string, string>): void {
		this._changePasswordForm.set(form);
	}
}
