import { afterNextRender, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiPutRenewUpdateFilesToken } from '@authentication/modules/resend-documents/api/put-renew-update-files-token';
import { ApiPostResendDocuments } from '@authentication/modules/resend-documents/api/post-resend-documents';
import { ApiGetVerifyUpdateFilesToken } from '@authentication/modules/resend-documents/api/get-verify-update-files-token';
import { FormValidator } from '@authentication/services/form-validator';
import { FrsButtonModule } from '@fresco-ui/frs-button';
import { FrsDialogRef } from '@fresco-ui/frs-dialog/frs-service';
import { FrsFieldModule } from '@fresco-ui/frs-field';
import { FrsFileInputModule } from '@fresco-ui/frs-file-input';
import { TFile } from '@fresco-ui/frs-file-input/frs-file-input';
import { LoadingIcon } from '@shared/icons/loading-icon/loading-icon';
import { FacthorLogoAnimated } from '@shared/logos/facthor-logo-animated/facthor-logo-animated';
import { combineLatest, distinctUntilChanged } from 'rxjs';
import { ApiGetFailedLegalDocumentsGet, TFiledDocuments } from '../api/get-failed-legal-documents-get';

type TFileControlKey = 'bankCertification' | 'rut' | 'chamberOfCommerce' | 'legalRepresentativeDni' | 'financialStatements';

@Component({
	selector: 'authentication-resend-documents-page',
	templateUrl: 'index.html',
	viewProviders: [ApiGetFailedLegalDocumentsGet, ApiPostResendDocuments, ApiPutRenewUpdateFilesToken, ApiGetVerifyUpdateFilesToken],
	imports: [FacthorLogoAnimated, FrsFieldModule, FrsFileInputModule, FrsButtonModule, LoadingIcon, ReactiveFormsModule],
})
export default class ChangePasswordPage {
	private readonly _router = inject(Router);
	private readonly _destroyRef = inject(DestroyRef);
	private readonly _dialogRef = inject(FrsDialogRef);
	private readonly _apiGetVerifyUpdateFilesToken = inject(ApiGetVerifyUpdateFilesToken);
	private readonly _apiGetFailedLegalDocuments = inject(ApiGetFailedLegalDocumentsGet);
	private readonly _apiPutResendDocuments = inject(ApiPostResendDocuments);
	private readonly _apiPutRenewUpdateFilesToken = inject(ApiPutRenewUpdateFilesToken);
	private readonly _formBuilder = inject(FormBuilder);
	private readonly _activatedRoute = inject(ActivatedRoute);
	private readonly _validator = inject(FormValidator);
	private readonly _token = signal<string>('');

	protected readonly _initialLoader = signal(true);
	protected readonly _isValidToken = this._apiGetVerifyUpdateFilesToken.response;
	protected readonly _isLoadingVerifyToken = this._apiGetVerifyUpdateFilesToken.isLoading;

	protected readonly _failedDocuments = this._apiGetFailedLegalDocuments.response;
	protected readonly _isLoadingFailedDocuments = this._apiGetFailedLegalDocuments.isLoading;

	protected readonly _wasRenewTokenSend = this._apiPutRenewUpdateFilesToken.response;
	protected readonly _isLoadingRenewToken = this._apiPutRenewUpdateFilesToken.isLoading;

	protected readonly _isLoadingApiPutResendDocuments = this._apiPutResendDocuments.isLoading;
	protected readonly _wasSentApiPutResendDocuments = this._apiPutResendDocuments.response;

	protected readonly _files = signal<Record<string, TFile[]>>({});
	protected readonly _fileControls: Record<TFileControlKey, FormControl<Nullable<TFile[]>>> = {
		chamberOfCommerce: this._formBuilder.control<Nullable<TFile[]>>([], [Validators.required]),
		rut: this._formBuilder.control<Nullable<TFile[]>>([], [Validators.required]),
		bankCertification: this._formBuilder.control<Nullable<TFile[]>>([], [Validators.required]),
		legalRepresentativeDni: this._formBuilder.control<Nullable<TFile[]>>([], [Validators.required]),
		financialStatements: this._formBuilder.control<Nullable<TFile[]>>([], [Validators.required]),
	};

	protected readonly _form = this._formBuilder.group({ ...this._fileControls });

	constructor() {
		this._getTokenFromQueryParams();
		this._addObservables();

		afterNextRender(() => {
			this._verifyToken();
		});
	}

	private _getTokenFromQueryParams(): void {
		const { token } = this._activatedRoute.snapshot.queryParams;
		this._token.set(token || '');
	}

	private _verifyToken(): void {
		this._apiGetVerifyUpdateFilesToken.verifyUpdateFileToken(this._token());
		this._initialLoader.set(false);
	}

	private _getFailedLegalDocuments(): void {
		this._apiGetFailedLegalDocuments.getFailedLegalDocuments(this._token());
	}

	private _setFileControls(failedDocuments: TFiledDocuments): void {
		const controls = Object.values(this._fileControls);

		failedDocuments.forEach((_, index) => {
			controls.slice(index, index);
		});

		controls.forEach((control) => control.disable());
	}

	private _addObservables(): void {
		combineLatest([toObservable(this._wasSentApiPutResendDocuments), toObservable(this._wasRenewTokenSend)])
			.pipe(takeUntilDestroyed(this._destroyRef), distinctUntilChanged())
			.subscribe(([wasDocumentSent, wasRenewSent]) => {
				if (wasDocumentSent === true || wasRenewSent === true) {
					this._router.navigate(['authentication/sign-in'], { replaceUrl: true });
					this._dialogRef.closeDialog();
				}
			});

		toObservable(this._isValidToken)
			.pipe(takeUntilDestroyed(this._destroyRef), distinctUntilChanged())
			.subscribe((isValidToken) => {
				if (isValidToken) {
					this._getFailedLegalDocuments();
				}
			});

		toObservable(this._failedDocuments)
			.pipe(takeUntilDestroyed(this._destroyRef), distinctUntilChanged())
			.subscribe((documents = []) => {
				if (documents.length > 0) {
					this._setFileControls(documents);
				}
			});
	}

	protected _onUploadFile(files: TFile[], key: TFileControlKey, multiple = false): void {
		const control = this._fileControls[key];
		if (!control) return;

		const validator = multiple ? this._validator.pdfFiles(files) : this._validator.pdfFile(files);

		control.setValidators([Validators.required, validator]);
		control.updateValueAndValidity();

		this._files.update((prev) => ({
			...prev,
			[`${key}File`]: files,
		}));
	}

	protected _getFileControl(key: TFileControlKey): FormControl<Nullable<TFile[]>> {
		return this._fileControls[key];
	}

	protected _onClickRefreshToken(): void {
		if (this._isLoadingVerifyToken()) return;

		if (!this._isValidToken()) {
			this._dialogRef.openAlertDialog({
				title: `¿Estás seguro de renovar la solicitud?`,
				description: 'Te enviaremos un nuevo enlace por correo electrónico.',
				actionButtonText: 'Renovar',
				loading: this._isLoadingRenewToken,
				action: () => {
					this._apiPutRenewUpdateFilesToken.renewUpdateFileToken(this._token());
				},
			});
			return;
		}
	}

	protected _onClick(): void {
		if (this._form.invalid) {
			this._form.markAllAsTouched();
			return;
		}

		const filesLength = Object.keys(this._files()).length;
		if (filesLength !== Object.keys(this._form.value).length) {
			console.warn('Longitud de documentos fallidos no coincide con los controles.');
			return;
		}

		this._apiPutResendDocuments.resendDocuments({
			token: this._token(),
			documents: Object.values(this._files()),
		});
	}
}
