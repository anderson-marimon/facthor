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
} & TAccessInfo;

type TApiPostUploadInvoicesResponse = TApi<boolean>;

export class ApiPostUploadInvoices extends AccessInterceptor {
	private readonly _url = `${envs.FT_URL_CLIENT_UPLOAD}`;
	private readonly _invoices = signal<Nullable<TApiPostUploadInvoicesBody>>(null);

	private readonly _resource = resource({
		request: this._invoices,
		loader: (params) => this._fetchPostUploadInvoices(params),
	});

	private async _fetchPostUploadInvoices(args: ResourceLoaderParams<Nullable<TApiPostUploadInvoicesBody>>) {
		if (args.request === null) return null;
		const { accessToken, accessModule, accessService, files } = args.request;

		if (!accessService) {
			console.warn('No se esta proveyendo la ruta del servicio.');
			return null;
		}

		try {
			const response = await this._HttpRequest<TApiPostUploadInvoicesResponse>({
				path: `${this._url}${accessService}`,
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${accessToken}`,
					'x-module': `${accessModule}`,
				},
				signal: args.abortSignal,
				body: JSON.stringify({ files }),
			});

			return response;
		} catch (error) {
			catchHandlerError({ error, message: 'Error al subir las facturas', description: 'Por favor, intenta nuevamente.' });
			return null;
		}
	}

	public readonly isLoading = this._resource.isLoading;
	public readonly response = this._resource.value;

	public uploadInvoice(args: { files: TFile[] } & TAccessInfo): void {
		const { files, ...accessInformation } = args;

		const invoices = files.map((file) => ({
			id: file.fileId,
			fileContent: getBase64FromTFile(file),
		}));

		this._invoices.set({
			...accessInformation,
			files: invoices,
		});
	}
}

// "error": [
//         {
//             "id": "985fe3a0-9fe3-4e3c-973b-06209d52acfa",
//             "errors": [
//                 "La factura contenida en el archivo .zip no se pudo procesar debido a que esta ya se existe en el sistema"
//             ]
//         },
//         {
//             "id": "6a67d00c-b1cc-4e91-8e68-0a6af4daed96",
//             "errors": [
//                 "La factura contenida en el archivo .zip no se pudo procesar debido a que esta ya se existe en el sistema"
//             ]
//         },
//         {
//             "id": "0aa87bbc-4566-43a2-a89f-fa64276f6022",
//             "errors": [
//                 "La factura contenida en el archivo .zip no se pudo procesar debido a que esta ya se existe en el sistema"
//             ]
//         },
//         {
//             "id": "48a7e98c-d869-4753-8b00-fb0f3b4c69dc",
//             "errors": [
//                 "La factura contenida en el archivo .zip no se pudo procesar debido a que esta ya se existe en el sistema"
//             ]
//         }
//     ],
