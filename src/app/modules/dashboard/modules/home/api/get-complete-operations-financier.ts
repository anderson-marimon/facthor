import { AccessInterceptor } from '@dashboard/interceptors/access-interceptor';
import { envs } from '@envs/envs';
import { resource, ResourceLoaderParams, signal } from '@angular/core';
import { cleanQuery } from '@shared/utils/clean-query';
import { apiDeferTime } from '@shared/utils/api-defer-time';
import { catchHandlerError } from '@shared/handlers/catch-handler-error';

type TFinancierStatistics = {
	totalOperationFinanciedCount: number;
	totalOperationFinanciedAmount: number;
	monthlyOperationsFinancied: TMonthlyOperation[];
	totalInterestOperations: number;
	totalOperationPendingReserveCount: number;
	totalOperationReserveAmount: number;
	totalOperationCount: number;
	totalOperationAmount: number;
	monthlyOperations: TMonthlyOperation[];
};

type TMonthlyOperation = {
	month: string;
	idMonth: number;
	operationsCount: number;
};

type TApiGetCompleteOperationsFinancierResponse = TApi<TFinancierStatistics>;
type TApiGetCompleteOperationsFinancierSignalHeaders = TAccessInfo;

export class ApiGetCompleteOperationsFinancier extends AccessInterceptor {
	private readonly _url = `${envs.FT_URL_NEGOTIATION}`;
	private readonly _headers = signal<Nullable<TApiGetCompleteOperationsFinancierSignalHeaders>>(null);

	private readonly _resource = resource({
		request: this._headers,
		loader: (args) => this._fetchGetCompleteOperationsFinancier(args),
	});

	private async _fetchGetCompleteOperationsFinancier(params: ResourceLoaderParams<Nullable<TApiGetCompleteOperationsFinancierSignalHeaders>>) {
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
			const response = await this._HttpRequest<TApiGetCompleteOperationsFinancierResponse>({
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
				message: 'No se pudo obtener el historial de operaciones del financiador',
				description: 'Estamos teniendo problemas para obtener el historial de operaciones del financiador, por favor, intente más tarde.',
			});

			return null;
		}
	}

	public readonly response = this._resource.value;
	public readonly isLoading = this._resource.isLoading;

	public getCompleteOperationsFinancier(params: TApiGetCompleteOperationsFinancierSignalHeaders): void {
		this._headers.set(params);
	}
}