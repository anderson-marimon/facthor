import { resource, ResourceLoaderParams, signal } from '@angular/core';
import { envs } from '@app/envs/envs';
import { AccessInterceptor } from '@dashboard/interceptors/access-interceptor';
import { catchHandlerError } from '@shared/handlers/catch-handler-error';

type TApiGetOrderStatusesResponse = TApi<{ label: string; value: number }[]>;

export class ApiGetOrderStatuses extends AccessInterceptor {
	private readonly _url = `${envs.FT_URL_NEGOTIATION}${envs.FT_URN}`;
	private readonly _accessToken = signal<Nullable<{ accessToken: string }>>(null);

	private readonly _resource = resource({
		request: this._accessToken,
		loader: (args) => this._fetchGetOrderStatuses(args),
	});

	private async _fetchGetOrderStatuses(params: ResourceLoaderParams<Nullable<{ accessToken: string }>>) {
		const accessToken = params.request;
		if (!accessToken) return null;

		const path = `${this._url}/MasterData/GetOperationState`;

		try {
			const response = await this._HttpRequest<TApiGetOrderStatusesResponse>({
				path,
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${accessToken.accessToken}`,
				},
				signal: params.abortSignal,
			});

			return response.data;
		} catch (error) {
			catchHandlerError({
				error,
				message: 'No se pudo obtener los estados de las ordenes',
				description: 'Estamos teniendo problemas para obtener los estados de las ordenes, por favor, intente más tarde.',
			});
			return [];
		}
	}

	public readonly response = this._resource.value;
	public readonly isLoading = this._resource.isLoading;

	public getOrderStatuses(params: { accessToken: string }): void {
		this._accessToken.set(params);
	}
}
