import { resource, ResourceLoaderParams, signal } from '@angular/core';
import { envs } from '@app/envs/envs';

export type TFiledDocuments = {
	id: number;
	name: string;
}[];

export class ApiGetFailedLegalDocumentsGet {
	private readonly _url = `${envs.FT_URL_REGISTER}${envs.FT_URN}`;
	private readonly _token = signal('');
	private readonly _resource = resource({ request: this._token, loader: (token) => this._getFailedLegalDocuments(token) });

	private async _getFailedLegalDocuments(token: ResourceLoaderParams<string>): Promise<TFiledDocuments> {
		if (this._token().length === 0) return [];

		await new Promise((resolve) => setTimeout(resolve, 1800));

		const path = `${this._url}${envs.FT_REGISTER_LIST_DOCUMENT}`;

		try {
			const response = await fetch(path, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'x-update-token': `${token.request}`,
				},
				signal: token.abortSignal,
			});

			const { ok, data, message }: TApi<TFiledDocuments> = await response.json();

			if (!ok) {
				throw new Error(message);
			}

			return data;
		} catch (err) {
			return [];
		}
	}

	public readonly response = this._resource.value;
	public readonly isLoading = this._resource.isLoading;

	public getFailedLegalDocuments(form: string): void {
		this._token.set(form);
	}
}
