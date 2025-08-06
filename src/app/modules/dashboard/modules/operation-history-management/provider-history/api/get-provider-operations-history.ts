import { AccessInterceptor } from '@dashboard/interceptors/access-interceptor';
import { envs } from '@envs/envs';
import { inject, resource, ResourceLoaderParams, signal } from '@angular/core';
import { cleanQuery } from '@shared/utils/clean-query';
import { apiDeferTime } from '@shared/utils/api-defer-time';
import { catchHandlerError } from '@shared/handlers/catch-handler-error';
import { TApiGetActiveOperationsListQuerySignalParams } from '@dashboard/modules/operations-management/view-operations/api/get-active-operations-list';
import { StoreActiveOperations } from '@dashboard/modules/operations-management/view-operations/stores/active-operations';
import { TOperationHistory } from '@dashboard/modules/operation-history-management/payer-history/api/get-payer-operations-history';

export type TApiGetProviderOperationsHistoryQueryParams = {
	IdBusiness: number;
	LegalName: string;
	Tradename: string;
	IdentitificationNumber: string; // Spelling
	IdOperationState: number;
	OrderNumber: string;
	StartOperationDate: string;
	EndOperationDate: string;
} & TPaginator;

type TApiGetProviderOperationsHistoryResponse = TApi<{
	countItems: number;
	countPages: number;
	data: TOperationHistory[];
}>;

export type TApiGetProviderOperationsHistoryQuerySignalParams = TAccessInfo & Partial<TApiGetProviderOperationsHistoryQueryParams>;

export class ApiGetProviderOperationsHistory extends AccessInterceptor {
	private readonly _storeActiveOperations = inject(StoreActiveOperations);
	private readonly _url = `${envs.FT_URL_NEGOTIATION}`;
	private readonly _queryParams = signal<Nullable<TApiGetProviderOperationsHistoryQuerySignalParams>>(null);

	private readonly _resource = resource({
		request: this._queryParams,
		loader: (args) => this._fetchGetProviderOperationsHistory(args),
	});

	private async _fetchGetProviderOperationsHistory(params: ResourceLoaderParams<Nullable<TApiGetProviderOperationsHistoryQuerySignalParams>>) {
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
			const response = await this._HttpRequest<TApiGetProviderOperationsHistoryResponse>({
				path,
				method: accessService.method,
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${accessToken}`,
					'x-module': `${accessModule}`,
				},
				signal: params.abortSignal,
			});

			this._storeActiveOperations.setActiveOperationList(response.data.data);

			return response.data;
		} catch (error) {
			catchHandlerError({
				error,
				message: 'No se pudo obtener el historial de operaciones del proveedor',
				description: 'Estamos teniendo problemas para obtener el historial de operaciones del proveedor, por favor, intente más tarde.',
			});

			return null;
		}
	}

	public readonly response = this._resource.value;
	public readonly isLoading = this._resource.isLoading;

	public getProviderOperationsHistory(params: TApiGetActiveOperationsListQuerySignalParams): void {
		this._queryParams.set(params);
	}
}