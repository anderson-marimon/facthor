import { resource, ResourceLoaderParams, signal } from '@angular/core';
import { envs } from '@app/envs/envs';
import { toast } from 'ngx-sonner';

export class ApiPutRenewUpdateFilesToken {
	private readonly _url = `${envs.FT_URL_REGISTER}${envs.FT_URN}`;
	private readonly _token = signal('');
	private readonly _resource = resource({ request: this._token, loader: (token) => this._renewUpdateFilesToken(token) });

	public readonly loader = this._resource.isLoading;
	public readonly wasSent = this._resource.value;

	private async _renewUpdateFilesToken(token: ResourceLoaderParams<string>): Promise<boolean> {
		if (this._token().length === 0) return false;

		const path = `${this._url}${envs.FT_REGISTER_RENEW_UPDATE_FILES_TOKEN}`;

		try {
			const response = await fetch(path, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					'x-update-token': `${token.request}`,
				},
				signal: token.abortSignal,
			});
			const { ok, message }: TApi<boolean> = await response.json();

			if (!ok) {
				throw new Error(message);
			}

			toast.message('Solicitud renovada', {
				description: 'Correo enviado, por favor revisar la bandeja de spam.',
			});

			return ok;
		} catch (err) {
			const error = err instanceof Error ? err : new Error(String(err));

			toast.message('Solicitud de renovación fallida', {
				description: error.message || 'Por favor, intenta nuevamente.',
			});

			this._token.set('');
			return false;
		}
	}

	public renewUpdateFileToken(form: string): void {
		this._token.set(form);
	}
}
