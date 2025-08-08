import { resource, ResourceLoaderParams, signal } from '@angular/core';
import { envs } from '@app/envs/envs';
import { AccessInterceptor } from '@dashboard/interceptors/access-interceptor';
import { TFile } from '@fresco-ui/frs-file-input/frs-file-input';
import { getBase64FromTFile } from '@shared/utils/get-base64-from-t-file';
import { catchHandlerError } from '@shared/handlers/catch-handler-error';

type TUploadInvoiceFile = {
	id: string;
	fileContent: string;
};

export type TZipErrorFiles = {
	id: string;
	errors: string[];
};

export type TZipProcessedFiles = {
	id: string;
	invoice: {
		cufe: string;
		currencyCode: string;
		expeditionDate: string;
		expeditionTime: string;
		expirationDate: string;
		id: string;
		ownerIdentification: number;
		ownerIdentificationCode: number;
		ownerName: string;
		payableAmount: number;
		payerIdentification: number;
		payerIdentificationCode: number;
		payerName: string;
		paymentMethodCode: number;
		paymentTypeCode: number;
	};
};

type TExtractedInvoiceData = Nullable<{
	zipFilesProcessed: TZipProcessedFiles[];
	zipFileErrors: TZipErrorFiles[];
}>;

type TApiPostExtractInvoiceDataSignalBody = TAccessInfo & { files: TUploadInvoiceFile[] };
type TApiExtractedInvoiceDataResponse = TApi<TExtractedInvoiceData>;

export class ApiPostExtractInvoiceData extends AccessInterceptor {
	private readonly _url = `${envs.FT_URL_CLIENT_UPLOAD}`;
	private readonly _body = signal<Nullable<TApiPostExtractInvoiceDataSignalBody>>(null);

	private readonly _resource = resource({
		request: this._body,
		loader: (args) => this._fetchPostUploadFiles(args),
	});

	private async _fetchPostUploadFiles(params: ResourceLoaderParams<Nullable<TApiPostExtractInvoiceDataSignalBody>>) {
		if (params.request && params.request.files.length === null) return null;

		const { accessModule, accessToken, accessService, files } = params.request!;

		if (!accessService?.service) {
			console.error('The service route is not being provided.');
			return null;
		}

		if (!accessService?.method) {
			console.error('The service method is not being provided.');
			return null;
		}

		try {
			const path = `${this._url}${accessService.service}`;

			const response = await this._HttpRequest<TApiExtractedInvoiceDataResponse>({
				path,
				method: accessService.method,
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${accessToken}`,
					'x-module': `${accessModule}`,
				},
				signal: params.abortSignal,
				body: JSON.stringify({ files: files }),
			});

			return response.data;
		} catch (error) {
			catchHandlerError({
				error,
				message: 'No se pudo extraer los datos de la factura.',
				description: 'Estamos teniendo problemas para extraer los datos de las facturas, por favor, intente más tarde.',
			});

			return null;
		}
	}

	public isLoading = this._resource.isLoading;
	public response = this._resource.value;

	public extractInvoiceData(args: TAccessInfo & { files: TFile[] }): void {
		const { accessToken, accessModule, accessService, files } = args!;

		const filesToSend = files.map((file) => ({
			id: file.fileId,
			fileContent: getBase64FromTFile(file),
		}));

		this._body.set({
			accessToken,
			accessModule,
			accessService,
			files: filesToSend,
		});
	}
}
