import { resource, ResourceLoaderParams, signal } from '@angular/core';
import { envs } from '@envs/envs';
import { AccessInterceptor } from '@dashboard/interceptors/access-interceptor';
import { catchHandlerError } from '@shared/handlers/catch-handler-error';
import { apiDeferTime } from '@shared/utils/api-defer-time';
import { toast } from 'ngx-sonner';

export type TApiPostRejectFinancingRequestBody = {
	idProvider: number;
	paramsBusinessFinancier?: {
		minDaysFinancing: number;
		maxDaysFinancing: number;
		amountAsigned: number; // Spelling
		interestPercentage: number;
		amountAsignedMonthUpdate: number; //Spelling
		operationPercentage: number;
	};
};

type TApiPostRejectFinancingRequestResponse = TApi<boolean>;

export type TApiPostRejectFinancingRequestSignalBody = TAccessInfo & Partial<TApiPostRejectFinancingRequestBody>;

export class ApiPostRejectFinancingRequest extends AccessInterceptor {
	private readonly _url = `${envs.FT_URL_FINANCIER_PROVIDER}`;
	private readonly _queryParams = signal<Nullable<TApiPostRejectFinancingRequestSignalBody & { isApprove: boolean }>>(null);

	private readonly _resource = resource({
		request: this._queryParams,
		loader: (args) => this._fetchPostRejectFinancingRequest(args),
	});

	private async _fetchPostRejectFinancingRequest(params: ResourceLoaderParams<Nullable<TApiPostRejectFinancingRequestSignalBody>>) {
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
			const response = await this._HttpRequest<TApiPostRejectFinancingRequestResponse>({
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

			if (response.ok) {
				toast.message('Solicitud de financiamiento rechazada', {
					description: 'La solicitud se ha rechazado correctamente.',
				});
			}

			return response.ok;
		} catch (error) {
			catchHandlerError({
				error,
				message: 'No se pudo aprobar la solicitud de financiamiento',
				description: 'Estamos teniendo problemas para aprobar la solicitud de financiamiento, por favor, intente más tarde.',
			});

			return null;
		}
	}

	public readonly response = this._resource.value;
	public readonly isLoading = this._resource.isLoading;

	public postRejectFinancingRequest(params: TApiPostRejectFinancingRequestSignalBody): void {
		this._queryParams.set({ ...params, isApprove: false });
	}
}
