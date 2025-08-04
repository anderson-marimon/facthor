import { resource, ResourceLoaderParams, signal } from '@angular/core';
import { envs } from '@envs/envs';
import { AccessInterceptor } from '@dashboard/interceptors/access-interceptor';
import { catchHandlerError } from '@shared/handlers/catch-handler-error';
import { apiDeferTime } from '@shared/utils/api-defer-time';
import { toast } from 'ngx-sonner';

export type TApiPostApproveFinancingRequestBody = {
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

type TApiPostApproveFinancingRequestResponse = TApi<boolean>;

export type TApiPostApproveFinancingRequestSignalBody = TAccessInfo & Partial<TApiPostApproveFinancingRequestBody>;

export class ApiPostApproveFinancingRequest extends AccessInterceptor {
	private readonly _url = `${envs.FT_URL_FINANCIER_PROVIDER}`;
	private readonly _queryParams = signal<Nullable<TApiPostApproveFinancingRequestSignalBody & { isApproved: boolean }>>(null);

	private readonly _resource = resource({
		request: this._queryParams,
		loader: (args) => this._fetchPostApproveFinancingRequest(args),
	});

	private async _fetchPostApproveFinancingRequest(params: ResourceLoaderParams<Nullable<TApiPostApproveFinancingRequestSignalBody>>) {
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
			const response = await this._HttpRequest<TApiPostApproveFinancingRequestResponse>({
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
				toast.message('Solicitud de financiamiento aprobada', {
					description: 'La asignación de parámetros y aprobación se ha realizado correctamente.',
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

	public postApproveFinancingRequest(params: TApiPostApproveFinancingRequestSignalBody): void {
		this._queryParams.set({ ...params, isApproved: true });
	}
}
