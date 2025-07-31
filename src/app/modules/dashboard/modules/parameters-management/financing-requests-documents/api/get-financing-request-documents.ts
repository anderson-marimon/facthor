import { envs } from '@envs/envs';
import { resource, ResourceLoaderParams, signal } from '@angular/core';
import { cleanQuery } from '@shared/utils/clean-query';
import { apiDeferTime } from '@shared/utils/api-defer-time';
import { catchHandlerError } from '@shared/handlers/catch-handler-error';
import { TApiGetFinancierOperationsHistoryQuerySignalParams } from '@dashboard/modules/operation-history-management/financier-history/api/get-financier-operations-history';
import { AccessInterceptor } from '@dashboard/interceptors/access-interceptor';

export type TApiGetFinancingRequestDocumentsQueryParams = {
	IdBusiness: number;
};

export type TFinancingRequestDocument = {
	id: number;
	documentType: string;
};
export type TApiGetFinancingRequestDocumentsResponse = TApi<{
	idBusiness: number;
	legalDocuments: TFinancingRequestDocument[];
}>;

export type TApiGetFinancingRequestDocumentsQuerySignalParams = TAccessInfo & Partial<TApiGetFinancingRequestDocumentsQueryParams>;

export class ApiGetFinancingRequestDocuments extends AccessInterceptor {
	private readonly _url = `${envs.FT_URL_FINANCIER_PROVIDER}`;
	private readonly _queryParams = signal<Nullable<TApiGetFinancingRequestDocumentsQuerySignalParams>>(null);

	private readonly _resource = resource({
		request: this._queryParams,
		loader: (args) => this._fetchGetFinancingRequestDocuments(args),
	});

	private async _fetchGetFinancingRequestDocuments(params: ResourceLoaderParams<Nullable<TApiGetFinancierOperationsHistoryQuerySignalParams>>) {
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
			const response = await this._HttpRequest<TApiGetFinancingRequestDocumentsResponse>({
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
				message: 'No se pudo obtener la lista de documentos',
				description: 'Estamos teniendo problemas para obtener la lista de documentos, por favor, intente más tarde.',
			});

			return null;
		}
	}

	public readonly response = this._resource.value;
	public readonly isLoading = this._resource.isLoading;

	public getFinancingRequestDocuments(params: TApiGetFinancingRequestDocumentsQuerySignalParams): void {
		this._queryParams.set(params);
	}
}