import { resource, ResourceLoaderParams, signal } from '@angular/core';
import { envs } from '@envs/envs';

type TDepartmentOption = {
	label: string;
	value: any;
};

interface TApiDepartment extends TApi<TDepartmentOption[]> {}

export class ApiGetFormDepartment {
	private readonly _url = `${envs.FT_URL_REGISTER}${envs.FT_URN}`;
	private readonly _countryId = signal(82);

	private readonly _departmentsResource = resource({
		request: this._countryId,
		loader: (params) => this._fetchDepartments(params),
	});

	private async _fetchDepartments(params: ResourceLoaderParams<number>) {
		if (params.request === 0) return [];

		const query = new URLSearchParams();
		query.append('IdCountry', params.request.toString());

		const url = `${this._url}/MasterData/GetDepartments?${query}`;

		try {
			const response = await fetch(url, {
				method: 'GET',
				signal: params.abortSignal,
			});

			const { ok, data }: TApiDepartment = await response.json();

			if (!ok) throw new Error('Error al cargar los departamentos');

			return data ?? [];
		} catch {
			return [];
		}
	}

	public readonly isLoading = this._departmentsResource.isLoading;
	public readonly response = this._departmentsResource.value;
	public readonly error = this._departmentsResource.error;
}
