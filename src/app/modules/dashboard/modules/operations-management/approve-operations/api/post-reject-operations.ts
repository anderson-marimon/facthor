import { resource, ResourceLoaderParams, signal } from '@angular/core';
import { envs } from '@app/envs/envs';
import { AccessInterceptor } from '@dashboard/interceptors/access-interceptor';
import { catchHandlerError } from '@shared/handlers/catch-handler-error';
import { apiDeferTime } from '@shared/utils/api-defer-time';
import { toast } from 'ngx-sonner';

type TApiPostRejectOperationsBodySignal = TAccessInfo & {
	operations: number[];
	isApproved: boolean;
};

type TApiPostRejectOperationsResponse = TApi<boolean>;

export class ApiPostRejectOperations extends AccessInterceptor {
	private readonly _url = `${envs.FT_URL_NEGOTIATION}`;
	private readonly _body = signal<Nullable<TApiPostRejectOperationsBodySignal>>(null);

	private readonly _resource = resource({
		request: this._body,
		loader: (args) => this._fetchPostRejectOperations(args),
	});

	private async _fetchPostRejectOperations(params: ResourceLoaderParams<Nullable<TApiPostRejectOperationsBodySignal>>) {
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
			const response = await this._HttpRequest<TApiPostRejectOperationsResponse>({
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

			if (response.ok) {
				toast.message('Operaciones rechazadas correctamente', { description: 'La operación u operaciones fueron rechazadas con éxito.' });
			}

			return response.data;
		} catch (error) {
			catchHandlerError({
				error,
				message: 'No se pudo rechazar las operaciones',
				description: 'Estamos teniendo problemas para rechazar las operaciones, por favor, intente más tarde.',
			});
			return null;
		}
	}

	public readonly response = this._resource.value;
	public readonly isLoading = this._resource.isLoading;

	public postRejectOperations(params: TApiPostRejectOperationsBodySignal): void {
		this._body.set(params);
	}
}
