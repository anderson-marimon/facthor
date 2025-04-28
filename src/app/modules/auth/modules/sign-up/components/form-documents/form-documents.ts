import { Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BANK_TYPE_OPTIONS } from '@auth/modules/sign-up/common/bank-select-options';
import { FormValidator } from '@auth/modules/sign-up/services/form-validator';
import { FrsFieldModule } from '@fresco-ui/frs-field';
import { FrsInputModule } from '@fresco-ui/frs-input';
import { FrsSelectModule } from '@fresco-ui/frs-select';
import { TSelectOption } from '@fresco-ui/frs-select/frs-select';

@Component({
	selector: 'sign-up-documents-form',
	templateUrl: 'form-documents.html',
	viewProviders: [],
	imports: [FrsFieldModule, FrsInputModule, FrsSelectModule, ReactiveFormsModule],
})
export class SignUpDocumentsForm {
	private readonly _formBuilder = inject(FormBuilder);
	private readonly _formValidator = inject(FormValidator);
	private readonly _bankAccountTypeToValidate = signal<TSelectOption[]>([]);

	// Inputs data
	protected readonly _bankNameOptions = [] as TSelectOption[];
	protected readonly _bankAccountTypeOptions = BANK_TYPE_OPTIONS;

	// Disable controls
	protected readonly _disableBankAccountNumber = signal<boolean>(false);

	// Documents controls
	protected readonly _bankName = this._formBuilder.control<TSelectOption[]>([], [Validators.required]);
	protected readonly _bankAccountType = this._formBuilder.control<TSelectOption[]>([], [Validators.required]);
	protected readonly _bankAccountNumber = this._formBuilder.control('', [
		Validators.required,
		this._formValidator.bancAccountNumber(this._bankAccountTypeToValidate()),
	]);

	constructor() {
		this._syncBankAccountType();
	}

	private _onBankAccountTypeChange(bankAccountType: TSelectOption[]): void {
		this._bankAccountTypeToValidate.set(bankAccountType);
		this._bankAccountNumber.setValidators([Validators.required, this._formValidator.bancAccountNumber(this._bankAccountTypeToValidate())]);
		this._bankAccountNumber.updateValueAndValidity();
		this._disableBankAccountNumber.set(bankAccountType.length === 0);
	}

	private _syncBankAccountType(): void {
		effect(() => {
			this._bankAccountType.valueChanges.subscribe((bankAccountType) => {
				this._onBankAccountTypeChange(bankAccountType!);
			});
		});
	}
}
