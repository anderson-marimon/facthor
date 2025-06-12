import { resource, ResourceLoaderParams, signal } from '@angular/core';
import { envs } from '@app/envs/envs';
import { AccessInterceptor } from '@dashboard/interceptors/access-interceptor';
import { catchHandlerError } from '@shared/handlers/catch-handler-error';
import { apiDeferTime } from '@shared/utils/api-defer-time';
import { cleanQuery } from '@shared/utils/clean-query';

export type TApiGetInvoiceListQueryParams = {
	SortByMostRecent: boolean;
	InvoiceNumber: string;
	CUFE: string;
	IdState: number;
	ClientLegalName: string;
	ClientIdentification: number;
	ExpeditionDate: string;
	ExpirationDate: string;
} & TPaginator;

export type TRadianEvent = {
	id: string;
	idRadianEvent: number;
	radianEventName: string;
	cudeEvent: string; // Error de ortografía
	issueDate: string;
	issueTime: string;
};

export type TInvoice = {
	id: string;
	idState: number;
	stateName: string;
	billerLegalName: string;
	billerIdentification: number;
	clientLegalName: string;
	clientIdentification: number;
	invoiceNumber: string;
	expeditionDate: string;
	expeditionTime: string;
	expirationDate: string;
	payableAmount: number;
	currencyCode: string;
	creationDate: string;
	lastModificationDate: string;
	radianEvents: TRadianEvent[];
};

type TApiGetInvoiceListResponse = TApi<{
	countItems: number;
	countPages: number;
	data: TInvoice[];
}>;

export type TApiGetInvoiceListQuerySignalParams = TAccessInfo & Partial<TApiGetInvoiceListQueryParams>;

export class ApiGetInvoiceList extends AccessInterceptor {
	private readonly _url = `${envs.FT_URL_CLIENT_UPLOAD}`;
	private readonly _queryParams = signal<Nullable<TApiGetInvoiceListQuerySignalParams>>(null);

	private readonly _resource = resource({
		request: this._queryParams,
		loader: (args) => this._fetchGetInvoiceList(args),
	});

	private async _fetchGetInvoiceList(params: ResourceLoaderParams<Nullable<TApiGetInvoiceListQuerySignalParams>>) {
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
			const response = await this._HttpRequest<TApiGetInvoiceListResponse>({
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
			console.log(error);

			catchHandlerError({
				error,
				message: 'Error al cagar las facturas',
				description: 'Estamos teniendo problemas para obtener las facturas, por favor intente más tarde.',
			});

			return null;
		}
	}

	public readonly response = this._resource.value;
	public readonly isLoading = this._resource.isLoading;

	public getInvoiceList(params: TApiGetInvoiceListQuerySignalParams): void {
		this._queryParams.set(params);
	}
}
