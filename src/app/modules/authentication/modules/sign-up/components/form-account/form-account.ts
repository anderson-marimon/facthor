import { afterNextRender, Component, DestroyRef, inject, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormValidator } from '@authentication/modules/sign-up/services/form-validator';
import { SignUpFormStore } from '@authentication/modules/sign-up/stores/sign-up.store';
import { FrsFieldModule } from '@fresco-ui/frs-field';
import { FrsInputModule } from '@fresco-ui/frs-input';
import { debounceTime, distinctUntilChanged, take } from 'rxjs';

@Component({
	selector: 'sign-up-account-form',
	templateUrl: 'form-account.html',
	imports: [FrsFieldModule, FrsInputModule, ReactiveFormsModule],
})
export class SignUpAccountForm {
	private readonly _signUpFormStore = inject(SignUpFormStore);
	private readonly _destroyRef = inject(DestroyRef);
	private readonly _formBuilder = inject(FormBuilder);
	private readonly _validator = inject(FormValidator);
	private readonly _passwordC = signal('');

	public readonly formChange = output<boolean>();

	protected readonly _firstName = this._formBuilder.control('', [Validators.required, this._validator.name()]);
	protected readonly _surName = this._formBuilder.control('', [this._validator.name(true)]);
	protected readonly _lastName = this._formBuilder.control('', [Validators.required, this._validator.name()]);
	protected readonly _surLastName = this._formBuilder.control('', [Validators.required, this._validator.name()]);
	protected readonly _dniNumber = this._formBuilder.control('', [Validators.required, this._validator.dni()]);
	protected readonly _email = this._formBuilder.control('', [Validators.required, Validators.email]);
	protected readonly _password = this._formBuilder.control('', [Validators.required, this._validator.password()]);
	protected readonly _confirmPassword = this._formBuilder.control('', [Validators.required, this._validator.confirmPassword(this._passwordC)]);

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
		afterNextRender(() => {
			this._fillForm();
		});

		this._syncForm();
		this._syncPassword();
	}

	private _syncForm(): void {
		this._form.valueChanges
			.pipe(
				takeUntilDestroyed(this._destroyRef),
				debounceTime(300),
				distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
			)
			.subscribe((form) => {
				this._signUpFormStore.setAccountForm(form);
				this.formChange.emit(this._form.invalid);
			});
	}

	private _syncPassword(): void {
		this._password.valueChanges.pipe(takeUntilDestroyed(this._destroyRef)).subscribe((value) => {
			this._passwordC.set(value || '');
		});
	}

	private _fillForm(): void {
		this._signUpFormStore
			.select((state) => state.accountForm)
			.pipe(take(1), distinctUntilChanged())
			.subscribe((form) => {
				if (!form || Object.keys(form).length === 0) return;

				this._firstName.setValue(form['firsName']);
				this._surName.setValue(form['surName']);
				this._lastName.setValue(form['lastName']);
				this._surLastName.setValue(form['surLastName']);
				this._dniNumber.setValue(form['dniNumber']);
				this._email.setValue(form['email']);
				this._password.setValue(form['password']);
				this._confirmPassword.setValue(form['confirmPassword']);
			});
	}

	public getForm(): FormGroup {
		return this._form;
	}
}
