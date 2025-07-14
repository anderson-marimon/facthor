import { resource } from '@angular/core';
import { envs } from '@envs/envs';

type TCiuuOption = {
	label: string;
	value: any;
};

interface TApiCiuuCodes extends TApi<TCiuuOption[]> {}

export class ApiGetFormCiuuCodes {
	private readonly _url = `${envs.FT_URL_REGISTER}${envs.FT_URN}`;
	private readonly _ciuuResource = resource({ loader: () => this._fetchCiuuCodes() });

	private async _fetchCiuuCodes() {
		const url = `${this._url}/MasterData/GetCodeCiuu`;

		try {
			const response = await fetch(url, { method: 'GET' });

			const { ok, data }: TApiCiuuCodes = await response.json();

			if (!ok) throw new Error('No se pudo cargar los departamentos');

			return data ?? [];
		} catch {
			return [];
		}
	}

	public readonly isLoading = this._ciuuResource.isLoading;
	public readonly response = this._ciuuResource.value;
	public readonly errors = this._ciuuResource.error;
}
