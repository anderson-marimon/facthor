import { resource, ResourceLoaderParams, signal } from '@angular/core';
import { envs } from '@app/envs/envs';
import { toast } from 'ngx-sonner';

export class ApiPostForgotPassword {
	private readonly _url = `${envs.FT_URL_LOGIN}${envs.FT_URN}`;
	private readonly _forgotPasswordForm = signal<Record<string, string>>({});
	private readonly _resource = resource({ request: this._forgotPasswordForm, loader: (body) => this._forgotPassword(body) });

	private async _forgotPassword(body: ResourceLoaderParams<Record<string, string>>): Promise<boolean> {
		if (Object.keys(this._forgotPasswordForm()).length === 0) return false;

		const path = `${this._url}${envs.FT_AUTH_FORGOT_PASSWORD}`;

		try {
			const response = await fetch(path, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				signal: body.abortSignal,
				body: JSON.stringify(body.request),
			});

			const { ok, message }: TApi<boolean> = await response.json();

			if (!ok) {
				throw new Error(message);
			}

			toast.message('Correo enviado', {
				description: 'Por favor, revisar la bandeja de spam.',
			});

			return ok;
		} catch (err) {
			const error = err instanceof Error ? err : new Error(String(err));

			toast.message('Envío de correo fallido', {
				description: error.message || 'Por favor, intenta nuevamente.',
			});

			return false;
		}
	}

	public readonly isLoading = this._resource.isLoading;
	public readonly response = this._resource.value;

	public forgotPassword(form: Record<string, string>): void {
		this._forgotPasswordForm.set(form);
	}
}
