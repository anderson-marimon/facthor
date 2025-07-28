import { resource, ResourceLoaderParams, signal } from '@angular/core';
import { envs } from '@app/envs/envs';
import { AccessInterceptor } from '@dashboard/interceptors/access-interceptor';
import { catchHandlerError } from '@shared/handlers/catch-handler-error';
import { apiDeferTime } from '@shared/utils/api-defer-time';
import { cleanQuery } from '@shared/utils/clean-query';

type TOrderInvoiceListParams = {
	idOperation: number;
	idOperationDetailState?: number;
} & Partial<TPaginator>;

export type TOrderInvoice = {
	id: number;
	idInvoice: string;
	invoiceCufe: string;
	invoiceNumber: string;
	currencyCode: string;
	invoiceAmountRequired: number;
	invoiceReadjustmentAmount: number;
	invoiceAmount: number;
	amountToFinance: number;
	reserveAmount: number;
	interestAmount: number;
	platformInterestAmount: number;
	deductionsAmount: number;
	payableAmount: number;
	expeditionDate: string;
	expirationDate: string;
	legitimateHolderLegalName: string;
	legitimateHolderTradename: string;
	legitimateHolderIdentificationType: string;
	legitimateHolderIdentificationNumber: number;
	legitimateHolderIdentificationTypeName: string;
	idOperationDetailState: number;
	operationDetailStateName: string;
	isApprovedByProvider: boolean;
	idProviderOperationDetailState: number;
	providerOperationDetailStateName: string;
	isApprovedByFinancier: boolean;
	idFinancierOperationDetailState: number;
	financierOperationDetailStateName: string;
	isApprovedByPayer: boolean;
	idPayerOperationDetailState: number;
	payerOperationDetailStateName: string;
};

export type TApiGetOrderInvoiceListResponse = TApi<{
	countItems: number;
	countPages: number;
	data: TOrderInvoice[];
}>;

type TApiGetOrderInvoiceListQuerySignalParams = TAccessInfo & TOrderInvoiceListParams;

export class ApiGetOrderInvoiceList extends AccessInterceptor {
	private readonly _url = `${envs.FT_URL_NEGOTIATION}`;
	private readonly _queryParams = signal<Nullable<TApiGetOrderInvoiceListQuerySignalParams>>(null);

	private readonly _resource = resource({
		request: this._queryParams,
		loader: (args) => this._fetchGetOrderInvoiceList(args),
	});

	private async _fetchGetOrderInvoiceList(params: ResourceLoaderParams<Nullable<TApiGetOrderInvoiceListQuerySignalParams>>) {
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
			const response = await this._HttpRequest<TApiGetOrderInvoiceListResponse>({
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
				message: 'No se pudo obtener el detalle de la operación',
				description: 'Estamos teniendo problemas para obtener el detalle, por favor, intente más tarde.',
			});

			return null;
		}
	}

	public readonly response = this._resource.value;
	public readonly isLoading = this._resource.isLoading;

	public getOrderInvoiceList(params: TApiGetOrderInvoiceListQuerySignalParams): void {
		this._queryParams.set(params);
	}
}
