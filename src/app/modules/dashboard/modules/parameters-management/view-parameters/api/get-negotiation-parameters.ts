import { envs } from '@envs/envs';
import { resource, ResourceLoaderParams, signal } from '@angular/core';
import { cleanQuery } from '@shared/utils/clean-query';
import { apiDeferTime } from '@shared/utils/api-defer-time';
import { catchHandlerError } from '@shared/handlers/catch-handler-error';
import { TApiGetFinancierOperationsHistoryQuerySignalParams } from '@dashboard/modules/operation-history-management/financier-history/api/get-financier-operations-history';
import { AccessInterceptor } from '@dashboard/interceptors/access-interceptor';

export type TApiGetNegotiationParametersQueryParams = {
	IdFinancier: number;
	IdProvider: number;
	FinancierName: string;
	ProviderName: string;
	Date: string;
} & TPaginator;

export type TNegotiationParameter = {
	idFinancier: number;
	financierName: string;
	idProvider: number;
	providerName: string;
	date: string;
	minDaysFinancing: number;
	maxDaysFinancing: number;
	amountAsigned: number; // Spelling
	amountBalance: number;
	interestPercentage: number;
	monthlyInterestRate: number;
	daillyInterestRate: number; // Spelling
	operationPercentage: number;
	amountAsignedMonthUpdate: number; // Spelling
	state: boolean;
};
export type TApiGetNegotiationParametersResponse = TApi<{
	countItems: number;
	countPages: number;
	data: TNegotiationParameter[];
}>;

export type TApiGetNegotiationParametersQuerySignalParams = TAccessInfo & Partial<TApiGetNegotiationParametersQueryParams>;

export class ApiGetNegotiationParameters extends AccessInterceptor {
	private readonly _url = `${envs.FT_URL_FINANCIER_PROVIDER}`;
	private readonly _queryParams = signal<Nullable<TApiGetNegotiationParametersQuerySignalParams>>(null);

	private readonly _resource = resource({
		request: this._queryParams,
		loader: (args) => this._fetchGetNegotiationParameters(args),
	});

	private async _fetchGetNegotiationParameters(params: ResourceLoaderParams<Nullable<TApiGetFinancierOperationsHistoryQuerySignalParams>>) {
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
			const response = await this._HttpRequest<TApiGetNegotiationParametersResponse>({
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
				message: 'No se pudo obtener la lista de parámetros',
				description: 'Estamos teniendo problemas para obtener la lista de parámetros de negociación, por favor, intente más tarde.',
			});

			return null;
		}
	}

	public readonly response = this._resource.value;
	public readonly isLoading = this._resource.isLoading;

	public getNegotiationParameters(params: TApiGetNegotiationParametersQuerySignalParams): void {
		this._queryParams.set(params);
	}
}