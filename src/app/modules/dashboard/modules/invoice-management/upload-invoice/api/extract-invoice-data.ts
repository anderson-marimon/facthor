import { resource, ResourceLoaderParams, signal } from '@angular/core';
import { envs } from '@app/envs/envs';
import { AccessInterceptor } from '@dashboard/interceptors/access-interceptor';
import { TFile } from '@fresco-ui/frs-file-input/frs-file-input';
import { getBase64FromTFile } from '@shared/utils/get-base64-from-t-file';
import { toast } from 'ngx-sonner';

type TUploadInvoiceFile = {
	id: string;
	fileContent: string;
};

type TAccessInfo = {
	accessToken: string;
	accessModule: string;
	accessService: string;
};

type TZipFileErrors = {
	id: string;
	errors: string[];
};

type TExtractedInvoiceData = Nullable<{
	zipFilesProcessed: Record<string, any>[];
	zipFileError: TZipFileErrors[];
}>;

type TApiExtractedInvoiceData = TApi<TExtractedInvoiceData>;

export class ApiPostExtractInvoiceData extends AccessInterceptor {
	private readonly _url = `${envs.FT_URL_CLIENT_UPLOAD}`;
	private readonly _files = signal<Nullable<TAccessInfo & { files: TUploadInvoiceFile[] }>>(null);

	private readonly _resource = resource({
		request: this._files,
		loader: (files) => this._fetchPostUploadFiles(files),
	});

	private async _fetchPostUploadFiles(params: ResourceLoaderParams<Nullable<TAccessInfo & { files: TUploadInvoiceFile[] }>>) {
		if (params.request && params.request.files.length === null) return null;
		const { accessModule = '', accessToken = '', accessService = '', files = [] } = params.request!;

		if (!accessService) {
			console.warn('No se esta proveyendo la ruta del servicio.');
			return null;
		}

		try {
			const path = `${this._url}${accessService}`;

			const response = await this._HttpRequest<TApiExtractedInvoiceData>({
				path,
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${accessToken}`,
					'x-module': `${accessModule}`,
				},
				signal: params.abortSignal,
				body: JSON.stringify({ files: files }),
			});

			return response.data;
		} catch (err) {
			const error = err instanceof Error ? err : new Error(String(err));

			toast.message('Envío de documentos fallido', {
				description: error.message || 'Por favor, intenta nuevamente.',
			});

			return null;
		}
	}

	public revisionData = this._resource.value;
	public isLoading = this._resource.isLoading;

	public extractInvoiceData(args: TAccessInfo & { files: TFile[] }): void {
		const { accessToken, accessModule, accessService, files } = args!;

		const filesToSend = files.map((file) => ({
			id: crypto.randomUUID(),
			fileContent: getBase64FromTFile(file),
		}));

		this._files.set({
			accessToken,
			accessModule,
			accessService,
			files: filesToSend,
		});
	}
}
