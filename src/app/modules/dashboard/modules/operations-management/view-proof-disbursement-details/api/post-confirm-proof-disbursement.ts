import { resource, ResourceLoaderParams, signal } from '@angular/core';
import { envs } from '@app/envs/envs';
import { AccessInterceptor } from '@dashboard/interceptors/access-interceptor';
import { catchHandlerError } from '@shared/handlers/catch-handler-error';
import { apiDeferTime } from '@shared/utils/api-defer-time';

export type TApiPostConfirmProofDisbursementBody = {
	idOperationDisbursement: number;
};

type TApiPostConfirmProofDisbursementResponse = TApi<boolean>;

export type TApiPostConfirmProofDisbursementSignalBody = TAccessInfo & Partial<TApiPostConfirmProofDisbursementBody & { confirm: boolean }>;

export class ApiPostConfirmProofDisbursement extends AccessInterceptor {
	private readonly _url = `${envs.FT_URL_NEGOTIATION}`;
	private readonly _queryParams = signal<Nullable<TApiPostConfirmProofDisbursementSignalBody>>(null);

	private readonly _resource = resource({
		request: this._queryParams,
		loader: (args) => this._fetchPostConfirmProofDisbursement(args),
	});

	private async _fetchPostConfirmProofDisbursement(params: ResourceLoaderParams<Nullable<TApiPostConfirmProofDisbursementSignalBody>>) {
		const request = params.request;
		if (!request) return null;

		const { accessToken, accessModule, accessService, ...body } = request;

		if (!accessService?.service) {
			console.error('The service route is not being provided.');
			return null;
		}

		if (!accessService?.method) {
			console.error('The service method is not being provided.');
			return null;
		}

		const path = `${this._url}${accessService.service}`;

		try {
			await apiDeferTime();
			const response = await this._HttpRequest<TApiPostConfirmProofDisbursementResponse>({
				path,
				method: accessService.method,
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${accessToken}`,
					'x-module': `${accessModule}`,
				},
				body: JSON.stringify(body),
				signal: params.abortSignal,
			});

			return response.data;
		} catch (error) {
			catchHandlerError({
				error,
				message: 'No se pudo confirmar el comprobantes',
				description: 'Estamos teniendo problemas para confirmar el comprobante, por favor, intente más tarde.',
			});

			return null;
		}
	}

	public readonly response = this._resource.value;
	public readonly isLoading = this._resource.isLoading;

	public postConfirmProofDisbursement(params: TApiPostConfirmProofDisbursementSignalBody): void {
		this._queryParams.set({ ...params, confirm: true });
	}
}
