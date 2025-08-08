import { AccessInterceptor } from '@dashboard/interceptors/access-interceptor';
import { envs } from '@envs/envs';
import { resource, ResourceLoaderParams, signal } from '@angular/core';
import { cleanQuery } from '@shared/utils/clean-query';
import { apiDeferTime } from '@shared/utils/api-defer-time';
import { catchHandlerError } from '@shared/handlers/catch-handler-error';

type TOperationStatistics = {
	totalOperationFinanciedCount: number;
	totalOperationFinanciedAmount: number;
	operationPendingCount: number;
	totalOperationPendingAmount: number;
	monthlyOperationsFinancied: TMonthlyOperation[];
	totalInterestOperations: number;
	totalOperationPendingReserveCount: number;
	totalOperationReserveAmount: number;
	totalOperationCount: number;
	totalOperationAmount: number;
	totalOperationsAmount: number;
	monthlyOperations: TMonthlyOperation[];
};

type TMonthlyOperation = {
	month: string;
	idMonth: number;
	operationsCount: number;
};

type TApiGetOperationsStatisticsResponse = TApi<TOperationStatistics>;
type TApiGetOperationsStatisticsSignalHeaders = TAccessInfo;

export class ApiGetOperationsStatistics extends AccessInterceptor {
	private readonly _url = `${envs.FT_URL_NEGOTIATION}`;
	private readonly _headers = signal<Nullable<TApiGetOperationsStatisticsSignalHeaders>>(null);

	private readonly _resource = resource({
		request: this._headers,
		loader: (args) => this._fetchGetOperationsStatistics(args),
	});

	private async _fetchGetOperationsStatistics(params: ResourceLoaderParams<Nullable<TApiGetOperationsStatisticsSignalHeaders>>) {
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
			const response = await this._HttpRequest<TApiGetOperationsStatisticsResponse>({
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
				message: 'No se pudo obtener las estadísticas de las operaciones',
				description: 'Estamos teniendo problemas para obtener las estadísticas de las operaciones, por favor, intente más tarde.',
			});

			return null;
		}
	}

	public readonly response = this._resource.value;
	public readonly isLoading = this._resource.isLoading;

	public getOperationsStatistics(params: TApiGetOperationsStatisticsSignalHeaders): void {
		this._headers.set(params);
	}
}