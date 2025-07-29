import { resource, ResourceLoaderParams, signal } from '@angular/core';
import { envs } from '@app/envs/envs';
import { AccessInterceptor } from '@dashboard/interceptors/access-interceptor';
import { catchHandlerError } from '@shared/handlers/catch-handler-error';
import { apiDeferTime } from '@shared/utils/api-defer-time';
import { toast } from 'ngx-sonner';

type TApiPostUploadProofDisbursementFinancierBody = TAccessInfo & {
	idOperation: number;
	description: string;
	proofDisbursementBase64: string;
};

type TApiPostUploadProofDisbursementFinancierResponse = TApi<boolean>;

export class ApiPostUploadProofDisbursementFinancier extends AccessInterceptor {
	private readonly _url = `${envs.FT_URL_NEGOTIATION}`;
	private readonly _body = signal<Nullable<TApiPostUploadProofDisbursementFinancierBody>>(null);

	private readonly _resource = resource({
		request: this._body,
		loader: (args) => this._fetchPostUploadProofDisbursementFinancier(args),
	});

	private async _fetchPostUploadProofDisbursementFinancier(params: ResourceLoaderParams<Nullable<TApiPostUploadProofDisbursementFinancierBody>>) {
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
			const response = await this._HttpRequest<TApiPostUploadProofDisbursementFinancierResponse>({
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
				toast.message('Comprobante subido correctamente', { description: 'El comprobante de desembolso fue subido exitosamente.' });
			}

			return response.data;
		} catch (error) {
			catchHandlerError({
				error,
				message: 'No se pudo subir el comprobante',
				description: 'Estamos teniendo problemas para subir el comprobante de desembolso, por favor, intente más tarde.',
			});
			return null;
		}
	}

	public readonly response = this._resource.value;
	public readonly isLoading = this._resource.isLoading;

	public UploadProofDisbursementFinancier(params: TApiPostUploadProofDisbursementFinancierBody): void {
		this._body.set(params);
	}
}
