import { resource, ResourceLoaderParams, signal } from '@angular/core';
import { envs } from '@app/envs/envs';

export class ApiGetVerifyUpdateFilesToken {
	private readonly _url = `${envs.FT_URL_REGISTER}${envs.FT_URN}`;
	private readonly _token = signal('');
	private readonly _resource = resource({ request: this._token, loader: (token) => this._verifyUpdateFilesToken(token) });

	private async _verifyUpdateFilesToken(token: ResourceLoaderParams<string>): Promise<boolean> {
		if (this._token().length === 0) return false;

		await new Promise((resolve) => setTimeout(resolve, 1800));

		const path = `${this._url}${envs.FT_REGISTER_VERIFY_TOKEN}`;

		try {
			const response = await fetch(path, {
				method: 'GET',
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

			return ok;
		} catch {
			return false;
		}
	}

	public readonly isLoading = this._resource.isLoading;
	public readonly response = this._resource.value;

	public verifyUpdateFileToken(form: string): void {
		this._token.set(form);
	}
}
