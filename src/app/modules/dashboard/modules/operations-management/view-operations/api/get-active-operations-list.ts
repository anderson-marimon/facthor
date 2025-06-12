import { resource, ResourceLoaderParams, signal } from '@angular/core';
import { envs } from '@app/envs/envs';
import { EOrderStatus } from '@dashboard/common/enums/order-status';
import { AccessInterceptor } from '@dashboard/interceptors/access-interceptor';
import { catchHandlerError } from '@shared/handlers/catch-handler-error';
import { apiDeferTime } from '@shared/utils/api-defer-time';
import { cleanQuery } from '@shared/utils/clean-query';

export type TApiGetActiveOperationsListQueryParams = {
	RoleToFind: number;
	LegalName: string;
	Tradename: string;
	IdentitificationNumber: string; // Spelling
	IdOperationState: number;
	OrderNumber: string;
	ExpeditionDateStart: string;
	ExpeditionDateEnd: string;
	Page: number;
	Size: number;
} & TPaginator;

type TOperation = {
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
	idOperationState: EOrderStatus;
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

type TApiGetActiveOperationListResponse = TApi<{
	countItems: number;
	countPages: number;
	data: TOperation[];
}>;

export type TApiGetActiveOperationsListQuerySignalParams = TAccessInfo & Partial<TApiGetActiveOperationsListQueryParams>;

export class ApiGetActiveOperationList extends AccessInterceptor {
	private readonly _url = `${envs.FT_URL_NEGOTIATION}`;
	private readonly _queryParams = signal<Nullable<TApiGetActiveOperationsListQuerySignalParams>>(null);

	private readonly _resource = resource({
		request: this._queryParams,
		loader: (args) => this._fetchGetActiveOperationList(args),
	});

	private async _fetchGetActiveOperationList(params: ResourceLoaderParams<Nullable<TApiGetActiveOperationsListQuerySignalParams>>) {
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

		if (!queryParams?.RoleToFind) {
			console.error('The role execution is not being provided.');
			return null;
		}

		const _queryParams = new URLSearchParams(cleanQuery(queryParams)).toString();
		const path = `${this._url}${accessService.service}?${_queryParams}`;

		try {
			await apiDeferTime();
			const response = await this._HttpRequest<TApiGetActiveOperationListResponse>({
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
				message: 'Error al obtener las operaciones activas',
				description: 'Estamos teniendo problemas para obtener las operaciones activas, por favor, intente más tarde.',
			});

			return null;
		}
	}

	public readonly response = this._resource.value;
	public readonly isLoading = this._resource.isLoading;

	public getActiveOperationsList(params: TApiGetActiveOperationsListQuerySignalParams): void {
		this._queryParams.set(params);
	}
}
