import { resource } from '@angular/core';
import { envs } from '@envs/envs';

type TCiuuOption = {
	label: string;
	value: any;
};

interface TApiCiuuCodes extends TApi<TCiuuOption[]> {}

export class FormCiuuCodesApi {
	private readonly _url = `${envs.FT_URL_REGISTER}${envs.FT_URN}`;
	private readonly _ciuuResource = resource({ loader: () => this._fetchCiuuCodes() });

	public readonly ciuuCodes = this._ciuuResource.value;
	public readonly isLoading = this._ciuuResource.isLoading;
	public readonly errors = this._ciuuResource.error;

	private async _fetchCiuuCodes() {
		const url = `${this._url}/MasterData/GetCodeCiuu`;

		try {
			const response = await fetch(url, { method: 'GET' });

			if (!response.ok) throw new Error('Error al cargar los códigos CIUU');

			const result: TApiCiuuCodes = await response.json();
			return result.data ?? [];
		} catch {
			return [];
		}
	}
}
