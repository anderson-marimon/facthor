import { resource } from '@angular/core';
import { envs } from '@envs/envs';

type TBankOption = {
	label: string;
	value: any;
};

interface TApiBanks extends TApi<TBankOption[]> {}

export class ApiGetFormBanks {
	private readonly _url = `${envs.FT_URL_REGISTER}${envs.FT_URN}`;
	private readonly _apiResource = resource({ loader: () => this._fetchBanks() });

	public readonly banks = this._apiResource.value;
	public readonly loader = this._apiResource.isLoading;
	public readonly error = this._apiResource.error;

	private async _fetchBanks() {
		const path = `${this._url}/MasterData/GetBanks`;

		try {
			const response = await fetch(path, { method: 'GET' });

			const { ok, data }: TApiBanks = await response.json();

			if (!ok) throw new Error('Error al cargar los departamentos');

			return data ?? [];
		} catch {
			return [];
		}
	}
}
