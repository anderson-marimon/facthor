import { resource, ResourceLoaderParams, signal } from '@angular/core';
import { envs } from '@app/envs/envs';
import { AccessInterceptor } from '@dashboard/interceptors/access-interceptor';

type TInvoiceListParams = Nullable<{
	page: number;
	size: number;
	SortByMostRecent: boolean;
}>;

type TApiInvoiceList = Nullable<TApi<any>>;

export class ApiGelInvoiceList extends AccessInterceptor {
	private readonly _url = `${envs.FT_URL_CLIENT_UPLOAD}${envs.FT_URN}`;
	private readonly _params = signal<TInvoiceListParams>(null);

	private readonly _resource = resource({
		request: this._params,
		loader: (params) => this.interceptInternalCodes(this._fetchInvoiceList(params)),
	});

	private async _fetchInvoiceList(params: ResourceLoaderParams<TInvoiceListParams>): Promise<TApiInvoiceList> {
		if (params.request === null) return null;

		// const path = `${this._url}${envs.}`
		return null;
	}
}
