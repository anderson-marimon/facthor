import { resource, ResourceLoaderParams, signal } from '@angular/core';
import { envs } from '@app/envs/envs';
import { TFile } from '@fresco-ui/frs-file-input/frs-file-input';
import { getBase64FromTFile } from '@shared/utils/get-base64-from-t-file';
import { toast } from 'ngx-sonner';

export class ApiPostResendDocuments {
	private readonly _url = `${envs.FT_URL_REGISTER}${envs.FT_URN}`;
	private readonly _resendDocumentsForm = signal<Record<string, any>>({});
	private readonly _resource = resource({ request: this._resendDocumentsForm, loader: (body) => this._resendDocuments(body) });

	private async _resendDocuments(_body: ResourceLoaderParams<Record<string, any>>): Promise<boolean> {
		if (Object.keys(this._resendDocumentsForm()).length === 0) return false;

		const path = `${this._url}${envs.FT_REGISTER_UPDATE_FAILED_LEGAL_DOCUMENT}`;
		const { token, ...body } = _body.request;

		try {
			const response = await fetch(path, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					'x-update-token': `${token}`,
				},
				signal: _body.abortSignal,
				body: JSON.stringify(body),
			});

			const { ok, message }: TApi<boolean> = await response.json();

			if (!ok) {
				throw new Error(message);
			}

			toast.message('Envío exitoso', {
				description: 'Los documentos se han enviado correctamente.',
			});

			return ok;
		} catch (err) {
			const error = err instanceof Error ? err : new Error(String(err));

			toast.message('Envío de documentos fallido', {
				description: error.message || 'Por favor, intenta nuevamente.',
			});

			return false;
		}
	}

	public readonly isLoading = this._resource.isLoading;
	public readonly response = this._resource.value;

	public resendDocuments(_form: Record<string, any>): void {
		const form = {
			token: _form['token'],
			providerLegalDocuments: [
				..._form['documents'].map((file: TFile[]) => ({
					idLegalDocumentType: parseInt(file[0].fileId),
					legalDocumentBase64: getBase64FromTFile(file[0]),
				})),
			],
		};

		this._resendDocumentsForm.set(form);
	}
}
