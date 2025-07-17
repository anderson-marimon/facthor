import { resource, ResourceLoaderParams, signal } from '@angular/core';
import { envs } from '@app/envs/envs';
import { EDisbursementStatus } from '@dashboard/common/enums/disbursement-status';
import { AccessInterceptor } from '@dashboard/interceptors/access-interceptor';
import { catchHandlerError } from '@shared/handlers/catch-handler-error';
import { apiDeferTime } from '@shared/utils/api-defer-time';
import { cleanQuery } from '@shared/utils/clean-query';

export type TApiGetProofDisbursementDetailsQueryParams = {
	IdDisbursement: string;
	IdOperationDisbursementState: number;
	IdOperation: string;
} & TPaginator;

export type TProofDisbursementDetail = {
	amount: number;
	description: number;
	id: number;
	idOperationDisbursementType: number;
	idOperationDisbursementTypeName: string;
	idOperationDisbusementState: EDisbursementStatus; // Spelling
	idOperationDisbusementStateName: string; // Spelling
};

type TApiGetProofDisbursementDetailResponse = TApi<{
	countItems: number;
	countPages: number;
	data: TProofDisbursementDetail[];
}>;

export type TApiGetProofDisbursementDetailsQuerySignalParams = TAccessInfo & Partial<TApiGetProofDisbursementDetailsQueryParams>;

export class ApiGetProofDisbursementDetails extends AccessInterceptor {
	private readonly _url = `${envs.FT_URL_NEGOTIATION}`;
	private readonly _queryParams = signal<Nullable<TApiGetProofDisbursementDetailsQuerySignalParams>>(null);

	private readonly _resource = resource({
		request: this._queryParams,
		loader: (args) => this._fetchGetProofDisbursementDetail(args),
	});

	private async _fetchGetProofDisbursementDetail(params: ResourceLoaderParams<Nullable<TApiGetProofDisbursementDetailsQuerySignalParams>>) {
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
			const response = await this._HttpRequest<TApiGetProofDisbursementDetailResponse>({
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
				message: 'No se pudo obtener los comprobantes',
				description: 'Estamos teniendo problemas para obtener los comprobante, por favor, intente más tarde.',
			});

			return null;
		}
	}

	public readonly response = this._resource.value;
	public readonly isLoading = this._resource.isLoading;

	public getProofDisbursementDetails(params: TApiGetProofDisbursementDetailsQuerySignalParams): void {
		this._queryParams.set(params);
	}
}
