import { afterNextRender, Component, DestroyRef, inject, input, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiGetFormBanks } from '@authentication/modules/sign-up/api/get-form-banks';
import { BANK_TYPE_OPTIONS } from '@authentication/modules/sign-up/common/bank-select-options';
import { FormValidator } from '@authentication/services/form-validator';
import { SignUpFormStore } from '@authentication/modules/sign-up/stores/sign-up-form';
import { FrsFieldModule } from '@fresco-ui/frs-field';
import { FrsFileInputModule } from '@fresco-ui/frs-file-input';
import { TFile } from '@fresco-ui/frs-file-input/frs-file-input';
import { FrsInputModule } from '@fresco-ui/frs-input';
import { FrsSelectModule } from '@fresco-ui/frs-select';
import { TSelectOption } from '@fresco-ui/frs-select/frs-select';
import { debounceTime, distinctUntilChanged, take } from 'rxjs';

type TFileControlKey = 'bankCertification' | 'rut' | 'chamberOfCommerce' | 'legalRepresentativeDni' | 'financialStatements';

@Component({
	selector: 'sign-up-documents-form',
	templateUrl: 'form-documents.html',
	viewProviders: [ApiGetFormBanks],
	imports: [FrsFieldModule, FrsFileInputModule, FrsInputModule, FrsSelectModule, ReactiveFormsModule],
})
export class SignUpDocumentsForm {
	private readonly _signUpFormStore = inject(SignUpFormStore);
	private readonly _destroyRef = inject(DestroyRef);
	private readonly _formBuilder = inject(FormBuilder);
	private readonly _validator = inject(FormValidator);
	private readonly _apiGetFormBanks = inject(ApiGetFormBanks);
	private readonly _bankAc = signal<TSelectOption[]>([]);

	public readonly formChange = output<boolean>();
	public readonly selectedRole = input<string>('');

	protected readonly _files = signal<Record<string, TFile[]>>({});
	protected readonly _bankNameOptions = this._apiGetFormBanks.response;
	protected readonly _bankAccountTypeOptions = BANK_TYPE_OPTIONS;
	protected readonly _disableBankAccountNumber = signal<boolean>(false);
	protected readonly _bankName = this._formBuilder.control<TSelectOption[]>([], Validators.required);
	protected readonly _bankAccountType = this._formBuilder.control<TSelectOption[]>([], Validators.required);
	protected readonly _bankAccountNumber = this._formBuilder.control('', [Validators.required, this._validator.bankNumber(this._bankAc)]);

	protected readonly _fileControls: Record<TFileControlKey, FormControl<TFile[]>> = {
		bankCertification: this._formBuilder.control<TFile[]>([], { nonNullable: true }),
		rut: this._formBuilder.control<TFile[]>([], { nonNullable: true }),
		chamberOfCommerce: this._formBuilder.control<TFile[]>([], { nonNullable: true }),
		legalRepresentativeDni: this._formBuilder.control<TFile[]>([], { nonNullable: true }),
		financialStatements: this._formBuilder.control<TFile[]>([], { nonNullable: true }),
	};

	protected readonly _form = this._formBuilder.group({
		bank: this._bankName,
		accountType: this._bankAccountType,
		accountNumber: this._bankAccountNumber,
		...this._fileControls,
	});

	constructor() {
		afterNextRender(() => this._fillForm());

		this._syncBankAccountType();
		this._syncFormChanges();
	}

	private _syncFormChanges(): void {
		this._form.valueChanges
			.pipe(
				takeUntilDestroyed(this._destroyRef),
				debounceTime(300),
				distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
			)
			.subscribe((form) => {
				this._signUpFormStore.setDocumentsForm({
					...form,
					...this._files(),
				});

				this.formChange.emit(this._filesValidator());
			});
	}

	private _syncBankAccountType(): void {
		this._bankAccountType.valueChanges.subscribe((type) => {
			this._bankAc.set(type ?? []);
			this._disableBankAccountNumber.set((type?.length ?? 0) === 0);
		});
	}

	private _fillForm(): void {
		this._signUpFormStore
			.select((store) => store.documentsForm)
			.pipe(take(1), distinctUntilChanged())
			.subscribe((form) => {
				if (!form || Object.keys(form).length === 0) return;

				this._bankName.setValue(form['bank']);
				this._bankAccountType.setValue(form['accountType']);
				this._bankAccountNumber.setValue(form['accountNumber']);

				this._files.set({
					['bankCertificationFile']: form['bankCertificationFile'],
					['rutFile']: form['rutFile'],
					['chamberOfCommerceFile']: form['chamberOfCommerceFile'],
					['legalRepresentativeDniFile']: form['legalRepresentativeDniFile'],
				});

				if (this.selectedRole() !== '2') {
					this._files.update((prev) => ({
						...prev,
						['financialStatementsFile']: form['financialStatementsFile'],
					}));
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

	protected _getFileControl(key: TFileControlKey): FormControl<TFile[]> {
		return this._fileControls[key];
	}

	private _filesValidator(): boolean {
		const files = this._files();
		const requiredKeys = Object.keys(this._fileControls) as TFileControlKey[];

		const allFilesValid = requiredKeys.every((key) => {
			const keyWithSuffix = `${key}File`;
			if (this.selectedRole() === '2') {
				if (keyWithSuffix === 'financialStatementsFile') return true;
			}

			const fileList = files[keyWithSuffix];
			return Array.isArray(fileList) && fileList.length > 0;
		});

		return !(allFilesValid && this._form.valid);
	}

	public getForm(): FormGroup {
		return this._form;
	}
}
