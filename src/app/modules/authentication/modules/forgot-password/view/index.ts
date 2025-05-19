import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiPostForgotPassword } from '@authentication/modules/forgot-password/api/forgot-password-post';
import { FrsButtonModule } from '@fresco-ui/frs-button';
import { FrsFieldModule } from '@fresco-ui/frs-field';
import { FrsInputModule } from '@fresco-ui/frs-input';
import { LoadingIcon } from '@shared/icons/loading-icon/loading-icon';
import { FacthorLogo } from '@shared/logos/facthor-logo/facthor-logo';
import { distinctUntilChanged } from 'rxjs';

@Component({
	selector: 'authentication-forgot-password-page',
	templateUrl: 'index.html',
	viewProviders: [ApiPostForgotPassword],
	imports: [FacthorLogo, FrsFieldModule, FrsInputModule, FrsButtonModule, LoadingIcon, ReactiveFormsModule, RouterLink],
})
export default class ForgotPasswordPage {
	private readonly _router = inject(Router);
	private readonly _destroyRef = inject(DestroyRef);
	private readonly _apiPutForgotPassword = inject(ApiPostForgotPassword);
	private readonly _formBuilder = inject(FormBuilder);

	protected readonly _loader = this._apiPutForgotPassword.loader;
	protected readonly _wasSent = this._apiPutForgotPassword.wasSent;
	protected readonly _email = this._formBuilder.control('', [Validators.required, Validators.email]);

	protected readonly _form = this._formBuilder.group({
		email: this._email,
	});

	constructor() {
		this._syncWasSent();
	}

	private _syncWasSent(): void {
		toObservable(this._wasSent)
			.pipe(takeUntilDestroyed(this._destroyRef), distinctUntilChanged())
			.subscribe((wasSent) => {
				if (wasSent !== true) return;
				this._router.navigate(['authentication/sign-in'], { replaceUrl: true });
			});
	}

	protected _onClickSingIn(): void {
		if (this._loader()) return;

		const form = this._form;
		if (form.invalid) return form.markAllAsTouched();

		this._apiPutForgotPassword.forgotPassword({ email: form.value.email! });
	}
}
