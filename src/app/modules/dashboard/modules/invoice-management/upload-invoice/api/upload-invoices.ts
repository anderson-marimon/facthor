import { resource, ResourceLoaderParams, signal } from '@angular/core';
import { envs } from '@app/envs/envs';
import { AccessInterceptor } from '@dashboard/interceptors/access-interceptor';
import { TFile } from '@fresco-ui/frs-file-input/frs-file-input';
import { catchHandlerError } from '@shared/handlers/catch-handler-error';
import { getBase64FromTFile } from '@shared/utils/get-base64-from-t-file';

type TUploadInvoice = {
	id: string;
	fileContent: string;
};

type TApiPostUploadInvoicesBody = {
	files: TUploadInvoice[];
};

type TApiPostUploadInvoicesSignalBody = TAccessInfo & TApiPostUploadInvoicesBody;
type TApiPostUploadInvoicesResponse = TApi<boolean>;

export class ApiPostUploadInvoices extends AccessInterceptor {
	private readonly _url = `${envs.FT_URL_CLIENT_UPLOAD}`;
	private readonly _body = signal<Nullable<TApiPostUploadInvoicesSignalBody>>(null);

	private readonly _resource = resource({
		request: this._body,
		loader: (params) => this._fetchPostUploadInvoices(params),
	});

	private async _fetchPostUploadInvoices(args: ResourceLoaderParams<Nullable<TApiPostUploadInvoicesSignalBody>>) {
		if (args.request === null) return null;
		const { accessToken = '', accessModule = '', accessService, files } = args.request;

		if (!accessService?.service) {
			console.error('The service route is not being provided.');
			return null;
		}

		if (!accessService?.method) {
			console.error('The service method is not being provided.');
			return null;
		}

		try {
			return await this._HttpRequest<TApiPostUploadInvoicesResponse>({
				path: `${this._url}${accessService.service}`,
				method: accessService.method,
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${accessToken}`,
					'x-module': `${accessModule}`,
				},
				signal: args.abortSignal,
				body: JSON.stringify({ files }),
			});
		} catch (error) {
			catchHandlerError({ error, message: 'No se pudo subir las facturas', description: 'Por favor, intenta nuevamente.' });

			return null;
		}
	}

	public readonly isLoading = this._resource.isLoading;
	public readonly response = this._resource.value;

	public uploadInvoice(args: TAccessInfo & { files: TFile[] }): void {
		const { files, ...accessInformation } = args;

		const invoices = files.map((file) => ({
			id: file.fileId,
			fileContent: getBase64FromTFile(file),
		}));

		this._body.set({
			...accessInformation,
			files: invoices,
		});
	}
}
