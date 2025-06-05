import { resource, ResourceLoaderParams, signal } from '@angular/core';
import { envs } from '@app/envs/envs';
import { AccessInterceptor } from '@dashboard/interceptors/access-interceptor';
import { catchHandlerError } from '@shared/handlers/catch-handler-error';

export type TInvoiceStatus = {
	label: string;
	value: number;
};

type TApiGetInvoiceStatuses = TApi<TInvoiceStatus[]>;

export class ApiGetInvoiceStatuses extends AccessInterceptor {
	private readonly _url = `${envs.FT_URL_CLIENT_UPLOAD}${envs.FT_URN}`;
	private readonly _accessToken = signal<Nullable<{ accessToken: string }>>(null);

	private readonly _resource = resource({
		request: this._accessToken,
		loader: (args) => this._fetchGetInvoiceStatuses(args),
	});

	private async _fetchGetInvoiceStatuses(args: ResourceLoaderParams<any>) {
		if (!args.request) return [];

		const { accessToken } = args.request;

		try {
			const path = `${this._url}/MasterData/GetInvoiceState`;

			const response = await this._HttpRequest<TApiGetInvoiceStatuses>({
				path,
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${accessToken}`,
				},
				signal: args.abortSignal,
			});

			return response.data;
		} catch (error) {
			catchHandlerError({ error, message: '', description: '' });
			return [];
		}
	}

	public readonly response = this._resource.value;
	public readonly isLoading = this._resource.isLoading;

	public getInvoiceStatuses(args: { accessToken: string }): void {
		this._accessToken.set(args);
	}
}
