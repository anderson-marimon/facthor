import { AccessInterceptor } from '@dashboard/interceptors/access-interceptor';
import { envs } from '@envs/envs';
import { inject, resource, ResourceLoaderParams, signal } from '@angular/core';
import { cleanQuery } from '@shared/utils/clean-query';
import { apiDeferTime } from '@shared/utils/api-defer-time';
import { catchHandlerError } from '@shared/handlers/catch-handler-error';
import { TApiGetActiveOperationsListQuerySignalParams } from '@dashboard/modules/operations-management/view-operations/api/get-active-operations-list';
import { StorePayerOperationsHistory } from '@dashboard/modules/operation-history-management/payer-history/stores/payer-operations-history';
import { StoreActiveOperations } from '@dashboard/modules/operations-management/view-operations/stores/active-operations';

export type TApiGetPayerOperationsHistoryQueryParams = {
	IdBusiness: number;
	LegalName: string;
	Tradename: string;
	IdentitificationNumber: string; // Spelling
	IdOperationState: number;
	OrderNumber: string;
	StartOperationDate: string;
	EndOperationDate: string;
} & TPaginator;

export type TOperationHistory = {
	id: number;
	providerLegalName: string;
	providerTradename: string;
	providerIdentificationType: string;
	providerIdentificationNumber: number;
	financierLegalName: string;
	financierTradename: string;
	financierIdentificationType: string;
	financierIdentificationNumber: number;
	idPayer: number;
	payerLegalName: string;
	payerTradename: string;
	payerIdentificationType: string;
	payerIdentificationNumber: number;
	idOperationState: number;
	operationStateName: string;
	idProviderOperationState: number;
	providerOperationStateName: string;
	idPayerOperationState: number;
	payerOperationStateName: string;
	orderNumber: string;
	totalInvoiceAmountRequired: number;
	totalInvoiceReadjustmentAmount: number;
	totalInvoiceAmount: number;
	totalAmountToFinance: number;
	totalReserveAmount: number;
	totalInterestAmount: number;
	totalPlatformInterestAmount: number;
	totalDeductionsAmount: number;
	totalPayableAmount: number;
	minDaysFinancing: number;
	maxDaysFinancing: number;
	operationPercentage: number;
	interestPercentage: number;
	monthlyInterestRate: number;
	daillyInterestRate: number; // Spelling
	platformInterestPercentage: number;
	platformMonthlyInterestRate: number;
	platformDaillyInterestRate: number; // Spelling
	totalInterestPercentage: number;
	totalMonthlyInterestRate: number;
	totalDaillyInterestRate: number; // Spelling
	operationDate: string;
};

type TApiGetPayerOperationsHistoryResponse = TApi<{
	countItems: number;
	countPages: number;
	data: TOperationHistory[];
}>;

export type TApiGetPayerOperationsHistoryQuerySignalParams = TAccessInfo & Partial<TApiGetPayerOperationsHistoryQueryParams>;

export class ApiGetPayerOperationsHistory extends AccessInterceptor {
	private readonly _storePayerOperationsHistory = inject(StorePayerOperationsHistory);
	private readonly _storeActiveOperations = inject(StoreActiveOperations);
	private readonly _url = `${envs.FT_URL_NEGOTIATION}`;
	private readonly _queryParams = signal<Nullable<TAccessInfo>>(null);

	private readonly _resource = resource({
		request: this._queryParams,
		loader: (args) => this._fetchGetPayerOperationsHistory(args),
	});

	private async _fetchGetPayerOperationsHistory(params: ResourceLoaderParams<Nullable<TApiGetPayerOperationsHistoryQuerySignalParams>>) {
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
			const response = await this._HttpRequest<TApiGetPayerOperationsHistoryResponse>({
				path,
				method: accessService.method,
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${accessToken}`,
					'x-module': `${accessModule}`,
				},
				signal: params.abortSignal,
			});

			this._storePayerOperationsHistory.setPayerOperationsHistory(response.data.data);
			this._storeActiveOperations.setActiveOperationList(response.data.data);
			
			return response.data;
		} catch (error) {
			catchHandlerError({
				error,
				message: 'No se pudo obtener el historial de operaciones del pagador',
				description: 'Estamos teniendo problemas para obtener el historial de operaciones del pagador, por favor, intente más tarde.',
			});

			return null;
		}
	}

	public readonly response = this._resource.value;
	public readonly isLoading = this._resource.isLoading;

	public getPayerOperationsHistory(params: TApiGetActiveOperationsListQuerySignalParams): void {
		this._queryParams.set(params);
	}
}