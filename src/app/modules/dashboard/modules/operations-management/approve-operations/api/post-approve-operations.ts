import { resource, ResourceLoaderParams, signal } from '@angular/core';
import { envs } from '@app/envs/envs';
import { AccessInterceptor } from '@dashboard/interceptors/access-interceptor';
import { catchHandlerError } from '@shared/handlers/catch-handler-error';
import { apiDeferTime } from '@shared/utils/api-defer-time';
import { toast } from 'ngx-sonner';

type TApiPostApproveOperationsBodySignal = TAccessInfo & {
	operations: number[];
	isApproved: boolean;
};

type TApiPostApproveOperationsResponse = TApi<boolean>;

export class ApiPostApproveOperations extends AccessInterceptor {
	private readonly _url = `${envs.FT_URL_NEGOTIATION}`;
	private readonly _body = signal<Nullable<TApiPostApproveOperationsBodySignal>>(null);

	private readonly _resource = resource({
		request: this._body,
		loader: (args) => this._fetchPostApproveOperations(args),
	});

	private async _fetchPostApproveOperations(params: ResourceLoaderParams<Nullable<TApiPostApproveOperationsBodySignal>>) {
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
			const response = await this._HttpRequest<TApiPostApproveOperationsResponse>({
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
				toast.message('Operaciones aprobadas correctamente', { description: 'La operación u operaciones fueron aprobadas con éxito.' });
			}

			return response.data;
		} catch (error) {
			catchHandlerError({
				error,
				message: 'Error al aprobar las operaciones',
				description: 'Estamos teniendo aprobar las operaciones, por favor, intente más tarde.',
			});
			return null;
		}
	}

	public readonly response = this._resource.value;
	public readonly isLoading = this._resource.isLoading;

	public postApproveOperations(params: TApiPostApproveOperationsBodySignal): void {
		this._body.set(params);
	}
}
