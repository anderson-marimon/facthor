import { resource, ResourceLoaderParams, signal } from '@angular/core';
import { envs } from '@envs/envs';

type TCityOption = {
	label: string;
	value: any;
};

interface TApiCities extends TApi<TCityOption[]> {}

export class ApiGetFormCities {
	private readonly _url = `${envs.FT_URL_REGISTER}${envs.FT_URN}`;
	private readonly _businessDepartmentId = signal(0);
	private readonly _legalRepresentativeBirthDepartmentId = signal(0);
	private readonly _legalRepresentativeExpeditionDepartmentId = signal(0);

	private readonly _businessCitiesResource = resource({
		request: this._businessDepartmentId,
		loader: (params) => this._fetchCities(params),
	});

	private readonly _legalRepresentativeBirthCitiesResource = resource({
		request: this._legalRepresentativeBirthDepartmentId,
		loader: (params) => this._fetchCities(params),
	});

	private readonly _legalRepresentativeExpeditionCitiesResource = resource({
		request: this._legalRepresentativeExpeditionDepartmentId,
		loader: (params) => this._fetchCities(params),
	});

	public readonly businessCities = this._businessCitiesResource.value;
	public readonly businessIsLoading = this._businessCitiesResource.isLoading;
	public readonly businessError = this._businessCitiesResource.error;

	public readonly legalRepresentativeBirthCities = this._legalRepresentativeBirthCitiesResource.value;
	public readonly legarRepresentativeBirthIsLoading = this._legalRepresentativeBirthCitiesResource.isLoading;
	public readonly legalRepresentativeBirthError = this._legalRepresentativeBirthCitiesResource.error;

	public readonly legalRepresentativeExpeditionCities = this._legalRepresentativeExpeditionCitiesResource.value;
	public readonly legarRepresentativeExpeditionIsLoading = this._legalRepresentativeExpeditionCitiesResource.isLoading;
	public readonly legalRepresentativeExpeditionError = this._legalRepresentativeExpeditionCitiesResource.error;

	private async _fetchCities(params: ResourceLoaderParams<number>) {
		if (params.request === 0) return [];

		const query = new URLSearchParams();
		query.append('IdDepartment', params.request.toString());

		const url = `${this._url}/MasterData/GetTowns?${query}`;

		try {
			const response = await fetch(url, {
				method: 'GET',
				signal: params.abortSignal,
			});

			const { ok, data }: TApiCities = await response.json();

			if (!ok) throw new Error('Error al cargar los departamentos');

			return data ?? [];
		} catch {
			return [];
		}
	}

	public updateBusinessDepartment(id: number): void {
		this._businessDepartmentId.set(id);
	}

	public updateLegalRepresentativeExpeditionDepartment(id: number): void {
		this._legalRepresentativeExpeditionDepartmentId.set(id);
	}

	public updateLegalRepresentativeBirthDepartment(id: number): void {
		this._legalRepresentativeBirthDepartmentId.set(id);
	}
}
