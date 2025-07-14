import { resource, ResourceLoaderParams, signal } from '@angular/core';
import { envs } from '@app/envs/envs';
import { AccessInterceptor } from '@dashboard/interceptors/access-interceptor';
import { TFactoryCalculatorParameters } from '@dashboard/modules/operations-management/create-operation/api/post-get-operation-summary';
import { catchHandlerError } from '@shared/handlers/catch-handler-error';
import { apiDeferTime } from '@shared/utils/api-defer-time';

type TAPiPostCreateOperationRequestSignal = TAccessInfo & {
	idFinancier: number;
	invoices: string[];
	factoringCalculatorParameters: TFactoryCalculatorParameters;
};

export class ApiPostCreateOperation extends AccessInterceptor {
	private readonly _url = `${envs.FT_URL_NEGOTIATION}`;
	private readonly _request = signal<Nullable<TAPiPostCreateOperationRequestSignal>>(null);

	private readonly _resource = resource({
		request: this._request,
		loader: (args) => this._fetchPostCreateOperation(args),
	});

	protected async _fetchPostCreateOperation(params: ResourceLoaderParams<Nullable<TAPiPostCreateOperationRequestSignal>>) {
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
			const response = await this._HttpRequest<TApi<boolean>>({
				path,
				method: accessService.method,
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${accessToken}`,
					'x-module': `${accessModule}`,
				},
				signal: params.abortSignal,
				body: JSON.stringify(body),
			});

			return response;
		} catch (error) {
			catchHandlerError({
				error,
				message: 'No se pudo obtener crear operación',
				description: 'Estamos teniendo problemas para crear la operación, por favor intente más tarde.',
			});

			return null;
		}
	}

	public readonly response = this._resource.value;
	public readonly isLoading = this._resource.isLoading;

	public _postCreateOperation(params: TAPiPostCreateOperationRequestSignal): void {
		this._request.set(params);
	}
}
