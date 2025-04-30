import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiFormGetBanks } from '@auth/modules/sign-up/api/form-get-banks';
import { BANK_TYPE_OPTIONS } from '@auth/modules/sign-up/common/bank-select-options';
import { FormValidator } from '@auth/modules/sign-up/services/form-validator';
import { FrsFieldModule } from '@fresco-ui/frs-field';
import { FrsFileInputModule } from '@fresco-ui/frs-file-input';
import { FrsInputModule } from '@fresco-ui/frs-input';
import { FrsSelectModule } from '@fresco-ui/frs-select';
import { TSelectOption } from '@fresco-ui/frs-select/frs-select';

@Component({
	selector: 'sign-up-documents-form',
	templateUrl: 'form-documents.html',
	viewProviders: [ApiFormGetBanks],
	imports: [FrsFieldModule, FrsFileInputModule, FrsInputModule, FrsSelectModule, ReactiveFormsModule],
})
export class SignUpDocumentsForm {
	private readonly _formBuilder = inject(FormBuilder);
	private readonly _formValidator = inject(FormValidator);
	private readonly _apiFormGetBanks = inject(ApiFormGetBanks);
	private readonly _bankAccountTypeToValidate = signal<TSelectOption[]>([]);
	private readonly _files = signal<Record<string, File[]>>({});

	// Inputs data
	protected readonly _bankNameOptions = this._apiFormGetBanks.banks;
	protected readonly _bankAccountTypeOptions = BANK_TYPE_OPTIONS;

	// Disable controls
	protected readonly _disableBankAccountNumber = signal<boolean>(false);

	// Bank information
	protected readonly _bankName = this._formBuilder.control<TSelectOption[]>([], [Validators.required]);
	protected readonly _bankAccountType = this._formBuilder.control<TSelectOption[]>([], [Validators.required]);
	protected readonly _bankAccountNumber = this._formBuilder.control('', [
		Validators.required,
		this._formValidator.bankAccountNumber(this._bankAccountTypeToValidate),
	]);
	protected readonly _bankCertification = this._formBuilder.control<File[] | null>(null, [Validators.required]);

	// Business Documents
	protected readonly _rut = this._formBuilder.control<File[] | null>(null, [Validators.required]);
	protected readonly _chamberOfCommerce = this._formBuilder.control<File[] | null>(null, [Validators.required]);
	protected readonly _legalRepresentativeDni = this._formBuilder.control<File[] | null>(null, [Validators.required]);
	protected readonly _financialStatements = this._formBuilder.control<File[] | null>(null, [Validators.required]);

	protected readonly _form = this._formBuilder.group({
		bank: this._bankName,
		accountType: this._bankAccountType,
		accountNumber: this._bankAccountNumber,
		bankCertification: this._bankCertification,
		rut: this._rut,
		chamberOfCommerce: this._chamberOfCommerce,
		legalRepresentativeDni: this._legalRepresentativeDni,
		financialStatements: this._financialStatements,
	});

	constructor() {
		this._syncBankAccountType();
	}

	private _syncBankAccountType(): void {
		this._bankAccountType.valueChanges.subscribe((bankAccountType) => {
			this._onBankAccountTypeChange(bankAccountType ?? []);
		});
	}
	private _onBankAccountTypeChange(bankAccountType: TSelectOption[]): void {
		this._bankAccountTypeToValidate.set(bankAccountType);
		this._disableBankAccountNumber.set(bankAccountType.length === 0);
	}

	private _updateFileValidator(key: string, multiple = false): void {
		let control: FormControl;

		switch (key) {
			case 'bankCertification':
				control = this._bankCertification;
				break;
			case 'rut':
				control = this._rut;
				break;
			case 'chamberOfCommerce':
				control = this._chamberOfCommerce;
				break;
			case 'legalRepresentativeDni':
				control = this._legalRepresentativeDni;
				break;
			case 'financialStatements':
				control = this._financialStatements;
				break;
			default:
				return;
		}

		const getFiles = () => this._files()[key] ?? [];
		const validator = multiple ? this._formValidator.pdfFiles(getFiles) : this._formValidator.pdfFile(getFiles);
		control.setValidators([Validators.required, validator]);
		control.updateValueAndValidity();
	}

	protected _onFileUpload(key: string, files: File[], multiple = false): void {
		this._files.update((current) => ({ ...current, [key]: files }));
		this._updateFileValidator(key, multiple);
	}

	protected _onBankCertificationUpload(files: File[]): void {
		this._onFileUpload('bankCertification', files);
	}

	protected _onRutUpload(files: File[]): void {
		this._onFileUpload('rut', files);
	}

	protected _onChamberOfCommerceUpload(files: File[]): void {
		this._onFileUpload('chamberOfCommerce', files);
	}

	protected _onLegalRepresentativeDniUpload(files: File[]): void {
		this._onFileUpload('legalRepresentativeDni', files);
	}

	protected _onFinancialStatementsUpload(files: File[]): void {
		this._onFileUpload('financialStatements', files, true);
	}

	public getForm(): FormGroup {
		return this._form;
	}
}
