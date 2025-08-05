import { resource, ResourceLoaderParams, signal } from '@angular/core';
import { envs } from '@envs/envs';
import { AccessInterceptor } from '@dashboard/interceptors/access-interceptor';
import { catchHandlerError } from '@shared/handlers/catch-handler-error';
import { apiDeferTime } from '@shared/utils/api-defer-time';
import { toast } from 'ngx-sonner';

export type TApiPostUpdateNegotiationParametersBody = {
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

type TApiPostUpdateNegotiationParametersResponse = TApi<boolean>;

export type TApiPostUpdateNegotiationParametersSignalBody = TAccessInfo & Partial<TApiPostUpdateNegotiationParametersBody>;

export class ApiPostUpdateNegotiationParameters extends AccessInterceptor {
	private readonly _url = `${envs.FT_URL_FINANCIER_PROVIDER}`;
	private readonly _queryParams = signal<Nullable<TApiPostUpdateNegotiationParametersSignalBody & { isApproved: boolean }>>(null);

	private readonly _resource = resource({
		request: this._queryParams,
		loader: (args) => this._fetchPostUpdateNegotiationParameters(args),
	});

	private async _fetchPostUpdateNegotiationParameters(params: ResourceLoaderParams<Nullable<TApiPostUpdateNegotiationParametersSignalBody>>) {
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
			const response = await this._HttpRequest<TApiPostUpdateNegotiationParametersResponse>({
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
				toast.message('Actualización de parámetros exitosa', {
					description: 'La actualización de parámetros se ha realizado correctamente.',
				});
			}

			return response.ok;
		} catch (error) {
			catchHandlerError({
				error,
				message: 'No se pudo actualizar los parámetros',
				description: 'Estamos teniendo problemas para actualizar los parámetros, por favor, intente más tarde.',
			});

			return null;
		}
	}

	public readonly response = this._resource.value;
	public readonly isLoading = this._resource.isLoading;

	public postUpdateNegotiationParameters(params: TApiPostUpdateNegotiationParametersSignalBody): void {
		this._queryParams.set({ ...params, isApproved: true });
	}
}
