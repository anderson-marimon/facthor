import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SignUpFormStore } from '@auth/modules/sign-up/stores/sign-up.store';

type TRecord = Record<string, any>;

@Component({
	selector: 'sign-up-form-summary',
	imports: [CommonModule],
	templateUrl: 'form-summary.html',
})
export class SignUpFormSummary {
	private readonly _destroyRef = inject(DestroyRef);
	private readonly _signUpFormStore = inject(SignUpFormStore);

	protected _roleForm: TRecord = {};
	protected _businessForm: TRecord = {};
	protected _documentsForm: TRecord = {};
	protected _accountForm: TRecord = {};

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
}
