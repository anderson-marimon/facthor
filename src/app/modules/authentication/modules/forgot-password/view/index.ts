import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiForgotPasswordPost } from '@authentication/modules/forgot-password/api/forgot-password-post';
import { FrsButtonModule } from '@fresco-ui/frs-button';
import { FrsFieldModule } from '@fresco-ui/frs-field';
import { FrsInputModule } from '@fresco-ui/frs-input';
import { LoadingIcon } from '@shared/icons/loading-icon/loading-icon';
import { FacthorLogo } from '@shared/logos/facthor-logo/facthor-logo';
import { distinctUntilChanged } from 'rxjs';

@Component({
	selector: 'authentication-forgot-password-page',
	templateUrl: 'index.html',
	viewProviders: [ApiForgotPasswordPost],
	imports: [FacthorLogo, FrsFieldModule, FrsInputModule, FrsButtonModule, LoadingIcon, ReactiveFormsModule, RouterLink],
})
export default class ForgotPasswordPage {
	private readonly _router = inject(Router);
	private readonly _destroyRef = inject(DestroyRef);
	private readonly _apiForgotPassword = inject(ApiForgotPasswordPost);
	private readonly _formBuilder = inject(FormBuilder);

	protected readonly _loader = this._apiForgotPassword.loader;
	protected readonly _wasSended = this._apiForgotPassword.wasSended;
	protected readonly _email = this._formBuilder.control('', [Validators.required, Validators.email]);

	protected readonly _form = this._formBuilder.group({
		email: this._email,
	});

	constructor() {
		this._syncForgotPassword();
	}

	private _syncForgotPassword(): void {
		toObservable(this._wasSended)
			.pipe(takeUntilDestroyed(this._destroyRef), distinctUntilChanged())
			.subscribe((value) => {
				if (value !== true) return;
				this._router.navigate(['authentication/sign-in']);
			});
	}

	protected _onClickSingIn(): void {
		if (this._loader()) return;

		const form = this._form;
		if (form.invalid) return form.markAllAsTouched();

		this._apiForgotPassword.forgotPassword({ email: form.value.email! });
	}
}
