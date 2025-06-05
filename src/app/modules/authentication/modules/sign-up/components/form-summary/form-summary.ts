import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ApiPostSignUp } from '@authentication/modules/sign-up/api/post-sign-up';
import { SignUpFormStore } from '@authentication/modules/sign-up/stores/sign-up-form';
import { FrsDialogRef } from '@fresco-ui/frs-dialog/frs-service';
import { TFile } from '@fresco-ui/frs-file-input/frs-file-input';
import { PdfViewer } from '@shared/components/pdf-viewer/pdf-viewer';

type TRecord = Record<string, any>;

@Component({
	selector: 'sign-up-form-summary',
	imports: [CommonModule],
	templateUrl: 'form-summary.html',
})
export class SignUpFormSummary {
	private readonly _destroyRef = inject(DestroyRef);
	private readonly _apiPostSignUp = inject(ApiPostSignUp);
	private readonly _signUpFormStore = inject(SignUpFormStore);
	private readonly _dialogRef = inject(FrsDialogRef);

	protected _roleForm: TRecord = {};
	protected _businessForm: TRecord = {};
	protected _documentsForm: TRecord = {};
	protected _accountForm: TRecord = {};
	protected _showPassword = signal(false);

	constructor() {
		this._signUpFormStore
			.select((store) => store)
			.pipe(takeUntilDestroyed(this._destroyRef))
			.subscribe(({ roleForm, businessForm, documentsForm, accountForm }) => {
				this._roleForm = roleForm;
				this._businessForm = businessForm;
				this._documentsForm = documentsForm;
				this._accountForm = accountForm;
			});
	}

	protected _onClickFile(fileName: string): void {
		const file = this._documentsForm[fileName][0] as TFile;

		this._dialogRef.openDialog({
			title: 'modal para visualizar pdf del pdf',
			content: PdfViewer,
			data: file.base64,
		});
	}

	protected _onClickPassword(): void {
		this._showPassword.update((prev) => !prev);
	}

	public sendForm(): void {
		this._apiPostSignUp.signUp({
			role: this._roleForm,
			business: this._businessForm,
			documents: this._documentsForm,
			account: this._accountForm,
		});
	}
}
