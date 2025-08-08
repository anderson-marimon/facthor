import { AccessInterceptor } from '@dashboard/interceptors/access-interceptor';
import { envs } from '@envs/envs';
import { resource, ResourceLoaderParams, signal } from '@angular/core';
import { cleanQuery } from '@shared/utils/clean-query';
import { apiDeferTime } from '@shared/utils/api-defer-time';
import { catchHandlerError } from '@shared/handlers/catch-handler-error';

type TProviderQuota = {
	approveQuota: number;
	usedQuota: number;
	remainingQuota: number;
};

type TApiGetProviderQuotaResponse = TApi<TProviderQuota>;
type TApiGetProviderQuotaSignalHeaders = TAccessInfo;

export class ApiGetProviderQuota extends AccessInterceptor {
	private readonly _url = `${envs.FT_URL_NEGOTIATION}`;
	private readonly _headers = signal<Nullable<TApiGetProviderQuotaSignalHeaders>>(null);

	private readonly _resource = resource({
		request: this._headers,
		loader: (args) => this._fetchGetProviderQuota(args),
	});

	private async _fetchGetProviderQuota(params: ResourceLoaderParams<Nullable<TApiGetProviderQuotaSignalHeaders>>) {
		const request = params.request;
		if (!request) return null;

		const { accessToken, accessModule, accessService, ...queryParams } = request;

		if (!accessService?.service) {
			console.error('The service route is not being provided.');
			return null;
		}

		if (!accessService?.method) {
			console.error('The service method is not being provided.');
			return null;
		}

		const _queryParams = new URLSearchParams(cleanQuery(queryParams)).toString();
		const path = `${this._url}${accessService.service}?${_queryParams}`;

		try {
			await apiDeferTime();
			const response = await this._HttpRequest<TApiGetProviderQuotaResponse>({
				path,
				method: accessService.method,
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${accessToken}`,
					'x-module': `${accessModule}`,
				},
				signal: params.abortSignal,
			});

			return response.data;
		} catch (error) {
			catchHandlerError({
				error,
				message: 'No se pudo obtener la información de cupos del proveedor',
				description: 'Estamos teniendo problemas para obtener la información de cupos del proveedor, por favor, intente más tarde.',
			});

			return null;
		}
	}

	public readonly response = this._resource.value;
	public readonly isLoading = this._resource.isLoading;

	public getProviderQuota(params: TApiGetProviderQuotaSignalHeaders): void {
		this._headers.set(params);
	}
}