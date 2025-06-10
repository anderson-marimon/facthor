import { resource, ResourceLoaderParams, signal } from '@angular/core';
import { envs } from '@app/envs/envs';
import { AccessInterceptor } from '@dashboard/interceptors/access-interceptor';
import { catchHandlerError } from '@shared/handlers/catch-handler-error';
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

export class ApiGetInvoiceList extends AccessInterceptor {
	private readonly _url = `${envs.FT_URL_CLIENT_UPLOAD}`;
	private readonly _queryParams = signal<Nullable<Partial<TApiGetInvoiceListQueryParams> & TAccessInfo>>(null);

	private readonly _resource = resource({
		request: this._queryParams,
		loader: (args) => this._fetchGetInvoiceList(args),
	});

	private async _fetchGetInvoiceList(args: ResourceLoaderParams<Nullable<Partial<TApiGetInvoiceListQueryParams> & TAccessInfo>>) {
		if (!args) return null;

		const { accessToken = '', accessModule = '', accessService = '', ...queryParams } = args.request!;

		if (!accessService) {
			console.warn('No se esta proveyendo la ruta del servicio.');
			return null;
		}

		const _queryParams = new URLSearchParams(cleanQuery(queryParams)).toString();
		const path = `${this._url}${accessService}?${_queryParams}`;

		try {
			await new Promise((resolve) => setTimeout(resolve, 1800));
			const response = await this._HttpRequest<TApiGetInvoiceListResponse>({
				path,
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${accessToken}`,
					'x-module': `${accessModule}`,
				},
				signal: args.abortSignal,
			});

			return response.data;
		} catch (error) {
			console.log(error);

			catchHandlerError({
				error,
				message: 'Error al cagar las facturas',
				description: 'Estamos teniendo problemas para obtener las facturas, por favor intenta nuevamente.',
			});

			return null;
		}
	}

	public readonly response = this._resource.value;
	public readonly isLoading = this._resource.isLoading;

	public getInvoiceList(args: Partial<TApiGetInvoiceListQueryParams> & TAccessInfo): void {
		this._queryParams.set(args);
	}
}
