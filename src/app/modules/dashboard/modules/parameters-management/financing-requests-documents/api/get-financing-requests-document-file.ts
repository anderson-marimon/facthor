import { resource, ResourceLoaderParams, signal } from '@angular/core';
import { envs } from '@app/envs/envs';
import { AccessInterceptor } from '@dashboard/interceptors/access-interceptor';
import { catchHandlerError } from '@shared/handlers/catch-handler-error';
import { cleanQuery } from '@shared/utils/clean-query';

export type TApiGetFinancingRequestDocumentFileQueryParams = {
	IdDocument: number;
};

type TApiGetFinancingRequestDocumentFileResponse = Blob;

export type TApiGetFinancingRequestDocumentFileQuerySignalParams = TAccessInfo & Partial<TApiGetFinancingRequestDocumentFileQueryParams>;

export class ApiGetFinancingRequestDocumentFile extends AccessInterceptor {
	private readonly _url = `${envs.FT_URL_FINANCIER_PROVIDER}`;
	private readonly _queryParams = signal<Nullable<TApiGetFinancingRequestDocumentFileQuerySignalParams>>(null);

	private readonly _resource = resource({
		request: this._queryParams,
		loader: (args) => this._fetchGetFinancingRequestDocumentFile(args),
	});

	private async _fetchGetFinancingRequestDocumentFile(
		params: ResourceLoaderParams<Nullable<TApiGetFinancingRequestDocumentFileQuerySignalParams>>
	) {
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
			const response = await this._HttpFileRequest<TApiGetFinancingRequestDocumentFileResponse>({
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

	public getFinancingRequestDocumentFile(params: TApiGetFinancingRequestDocumentFileQuerySignalParams): void {
		this._queryParams.set(params);
	}

	public reset(): void {
		this._queryParams.set(null);
	}
}
