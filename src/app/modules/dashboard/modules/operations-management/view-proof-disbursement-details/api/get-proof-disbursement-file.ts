import { resource, ResourceLoaderParams, signal } from '@angular/core';
import { envs } from '@app/envs/envs';
import { AccessInterceptor } from '@dashboard/interceptors/access-interceptor';
import { catchHandlerError } from '@shared/handlers/catch-handler-error';
import { apiDeferTime } from '@shared/utils/api-defer-time';
import { cleanQuery } from '@shared/utils/clean-query';

export type TApiGetProofDisbursementFileQueryParams = {
	IdOperationDisbursement: string;
};

type TApiGetProofDisbursementFileResponse = Blob;

export type TApiGetProofDisbursementFileQuerySignalParams = TAccessInfo & Partial<TApiGetProofDisbursementFileQueryParams>;

export class ApiGetProofDisbursementFile extends AccessInterceptor {
	private readonly _url = `${envs.FT_URL_NEGOTIATION}`;
	private readonly _queryParams = signal<Nullable<TApiGetProofDisbursementFileQuerySignalParams>>(null);

	private readonly _resource = resource({
		request: this._queryParams,
		loader: (args) => this._fetchGetProofDisbursementFile(args),
	});

	private async _fetchGetProofDisbursementFile(params: ResourceLoaderParams<Nullable<TApiGetProofDisbursementFileQuerySignalParams>>) {
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
			const response = await this._HttpFileRequest<TApiGetProofDisbursementFileResponse>({
				path,
				method: accessService.method,
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/pdf',
					Authorization: `Bearer ${accessToken}`,
					'x-module': `${accessModule}`,
				},
				signal: params.abortSignal,
				responseType: 'blob',
			});

			const url = URL.createObjectURL(response);
			return url;
		} catch (error) {
			catchHandlerError({
				error,
				message: 'No se pudo obtener el PDF del comprobantes',
				description: 'Estamos teniendo problemas para obtener el PDF del comprobante, por favor, intente más tarde.',
			});

			return null;
		}
	}

	public readonly response = this._resource.value;
	public readonly isLoading = this._resource.isLoading;

	public getProofDisbursementFile(params: TApiGetProofDisbursementFileQuerySignalParams): void {
		this._queryParams.set(params);
	}

	public reset(): void {
		this._queryParams.set(null);
	}
}
