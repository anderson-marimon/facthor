import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormValidator } from '@auth/modules/sign-up/services/form-validator';
import { FrsFieldModule } from '@fresco-ui/frs-field';
import { FrsInputModule } from '@fresco-ui/frs-input';

@Component({
	selector: 'sign-up-account-form',
	templateUrl: 'form-account.html',
	imports: [FrsFieldModule, FrsInputModule, ReactiveFormsModule],
})
export class SignUpAccountForm {
	private readonly _formBuilder = inject(FormBuilder);
	private readonly _formValidator = inject(FormValidator);
	private readonly _destroyRef = inject(DestroyRef);
	private readonly _passwordC = signal('');

	protected readonly _firstName = this._formBuilder.control('', [Validators.required, this._formValidator.name()]);
	protected readonly _surName = this._formBuilder.control('', [Validators.required, this._formValidator.name()]);
	protected readonly _lastName = this._formBuilder.control('', [Validators.required, this._formValidator.name()]);
	protected readonly _surLastName = this._formBuilder.control('', [Validators.required, this._formValidator.name()]);
	protected readonly _dniNumber = this._formBuilder.control('', [Validators.required, this._formValidator.dni()]);
	protected readonly _email = this._formBuilder.control('', [Validators.required, Validators.email]);
	protected readonly _password = this._formBuilder.control('', [Validators.required, this._formValidator.password()]);
	protected readonly _confirmPassword = this._formBuilder.control('', [Validators.required, this._formValidator.confirmPassword(this._passwordC)]);

	protected readonly _form = this._formBuilder.group({
		firsName: this._firstName,
		surName: this._surName,
		lastName: this._lastName,
		surLastName: this._surLastName,
		dniNumber: this._dniNumber,
		email: this._email,
		password: this._password,
		confirmPassword: this._confirmPassword,
	});

	constructor() {
		this._syncPassword();
	}

	private _syncPassword(): void {
		this._password.valueChanges.pipe(takeUntilDestroyed(this._destroyRef)).subscribe((value) => {
			this._passwordC.set(value || '');
		});
	}

	public getAccountForm(): FormGroup {
		return this._form;
	}
}
