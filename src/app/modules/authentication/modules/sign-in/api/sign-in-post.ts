import { resource, ResourceLoaderParams, signal } from '@angular/core';
import { envs } from '@app/envs/envs';
import Cookies from 'js-cookie';
import { toast } from 'ngx-sonner';

type SingIn = Nullable<{
	authToken: string;
	businessLegalName: string;
	ipConnection: string;
	username: string;
}>;

export class ApiPostSignIn {
	private readonly _url = `${envs.FT_URL_LOGIN}${envs.FT_URN}`;
	private readonly _signInForm = signal<Record<string, string>>({});
	private readonly _resource = resource({ request: this._signInForm, loader: (body) => this._signIn(body) });

	public readonly loader = this._resource.isLoading;

	private async _signIn(body: ResourceLoaderParams<Record<string, string>>): Promise<SingIn> {
		if (Object.keys(this._signInForm()).length === 0) return null;

		const path = `${this._url}${envs.FT_AUTH_LOGIN}`;

		try {
			const response = await fetch(path, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				signal: body.abortSignal,
				body: JSON.stringify(body.request),
			});

			const { ok, data, message }: TApi<SingIn> = await response.json();

			if (!ok) {
				throw new Error(message);
			}

			const expirationDate = new Date();
			expirationDate.setHours(expirationDate.getHours() + 1);

			Cookies.set(envs.FT_AUTHENTICATION_TOKEN_PATH, data?.authToken ?? '', {
				expires: expirationDate,
				secure: true,
				sameSite: 'strict',
			});

			const now = new Date();
			let formatted = now.toLocaleString('es-ES', {
				day: '2-digit',
				month: '2-digit',
				year: 'numeric',
				hour: '2-digit',
				minute: '2-digit',
				hour12: true,
			});

			toast.message('Bienvenido', {
				description: `Inicio de sesión: ${formatted}`,
			});

			return data;
		} catch (err) {
			const error = err instanceof Error ? err : new Error(String(err));

			toast.message('Inicio de sesión fallido', {
				description: error.message || 'Por favor, intenta nuevamente.',
			});

			return null;
		}
	}

	public signIn(form: { username: string; password: string }): void {
		this._signInForm.set(form);
	}
}
