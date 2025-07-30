import { resource, ResourceLoaderParams, signal } from '@angular/core';
import { envs } from '@app/envs/envs';
import { AccessInterceptor } from '@dashboard/interceptors/access-interceptor';
import { catchHandlerError } from '@shared/handlers/catch-handler-error';
import { apiDeferTime } from '@shared/utils/api-defer-time';
import { cleanQuery } from '@shared/utils/clean-query';

type TApiGetBankAccountParams = TAccessInfo & {
	idOperation: number;
};

export type TBankAccount = {
	idOperation: number;
	idBusiness: number;
	identificationType: string;
	identificationNumber: number;
	businessTradename: string;
	bankName: string;
	accountType: string;
	accountNumber: string;
};

type TApiGetBankAccountResponse = TApi<TBankAccount>;

export class ApiGetBankAccount extends AccessInterceptor {
	private readonly _url = `${envs.FT_URL_NEGOTIATION}`;
	private readonly _body = signal<Nullable<TApiGetBankAccountParams>>(null);

	private readonly _resource = resource({
		request: this._body,
		loader: (args) => this._fetchGetBankAccount(args),
	});

	private async _fetchGetBankAccount(params: ResourceLoaderParams<Nullable<TApiGetBankAccountParams>>) {
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
			const response = await this._HttpRequest<TApiGetBankAccountResponse>({
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
				message: 'No se pudo obtener la cuenta bancaria',
				description: 'Estamos teniendo problemas para obtener la cuenta bancaria, por favor, intente más tarde.',
			});
			return null;
		}
	}

	public readonly response = this._resource.value;
	public readonly isLoading = this._resource.isLoading;

	public GetBankAccount(params: TApiGetBankAccountParams): void {
		this._body.set(params);
	}
}
