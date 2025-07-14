import { envs } from '@app/envs/envs';
import { resource, ResourceLoaderParams, signal } from '@angular/core';
import { AccessInterceptor } from '@dashboard/interceptors/access-interceptor';
import { catchHandlerError } from '@shared/handlers/catch-handler-error';
import { apiDeferTime } from '@shared/utils/api-defer-time';

type TFinancier = {
	id: number;
	tradename: string;
	idParamAssigned: number;
};

type TApiGetOperationsFinancierListResponse = TApi<TFinancier[]>;

type TApiGetOperationsFinancierListQueryParams = TAccessInfo;

export class ApiGetOperationsFinancierList extends AccessInterceptor {
	private readonly _url = `${envs.FT_URL_NEGOTIATION}`;
	private readonly _request = signal<Nullable<TApiGetOperationsFinancierListQueryParams>>(null);

	private readonly _resource = resource({
		request: this._request,
		loader: (args) => this._fetchGetOperationsFinanciers(args),
	});

	private async _fetchGetOperationsFinanciers(params: ResourceLoaderParams<Nullable<TApiGetOperationsFinancierListQueryParams>>) {
		const request = params.request;
		if (!request) return [];

		const { accessToken, accessModule, accessService } = request;

		if (!accessService?.service) {
			console.error('The service route is not being provided.');
			return [];
		}

		if (!accessService?.method) {
			console.error('The service method is not being provided.');
			return [];
		}

		const path = `${this._url}${accessService.service}`;

		try {
			await apiDeferTime();
			const response = await this._HttpRequest<TApiGetOperationsFinancierListResponse>({
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
				message: 'No se pudo obtener la lista de financiadores',
				description: 'Estamos teniendo problemas para obtener los financiadores, por favor intente más tarde.',
			});

			return [];
		}
	}

	public readonly response = this._resource.value;
	public readonly isLoading = this._resource.isLoading;

	public _getOperationsFinancierList(params: TApiGetOperationsFinancierListQueryParams): void {
		this._request.set(params);
	}
}
