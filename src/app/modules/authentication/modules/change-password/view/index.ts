import { afterNextRender, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiChangePasswordPost } from '@authentication/modules/change-password/api/change-password-post';
import { FormValidator } from '@authentication/services/form-validator';
import { FrsButtonModule } from '@fresco-ui/frs-button';
import { FrsFieldModule } from '@fresco-ui/frs-field';
import { FrsInputModule } from '@fresco-ui/frs-input';
import { LoadingIcon } from '@shared/icons/loading-icon/loading-icon';
import { FacthorLogo } from '@shared/logos/facthor-logo/facthor-logo';
import { distinctUntilChanged } from 'rxjs';

@Component({
	selector: 'authentication-change-password-page',
	templateUrl: 'index.html',
	viewProviders: [ApiChangePasswordPost],
	imports: [FacthorLogo, FrsFieldModule, FrsInputModule, FrsButtonModule, LoadingIcon, ReactiveFormsModule],
})
export default class ChangePasswordPage {
	private readonly _router = inject(Router);
	private readonly _destroyRef = inject(DestroyRef);
	private readonly _apiChangePassword = inject(ApiChangePasswordPost);
	private readonly _formBuilder = inject(FormBuilder);
	private readonly _validator = inject(FormValidator);
	private readonly _activatedRoute = inject(ActivatedRoute);
	private readonly _password = signal('');
	private readonly _token = signal<string>('');

	protected readonly _loader = this._apiChangePassword.loader;
	protected readonly _wasSent = this._apiChangePassword.wasSent;
	protected readonly _newPassword = this._formBuilder.control('', [Validators.required, this._validator.password()]);
	protected readonly _confirmNewPassword = this._formBuilder.control('', [Validators.required, this._validator.confirmPassword(this._password)]);

	protected readonly _form = this._formBuilder.group({
		newPassword: this._newPassword,
		confirmNewPassword: this._confirmNewPassword,
	});

	constructor() {
		this._syncWasSent();
		this._syncPasswordInput();

		afterNextRender(() => {
			this._getTokenFromQueryParams();
		});
	}

	private _syncPasswordInput(): void {
		this._newPassword.valueChanges.pipe(takeUntilDestroyed(this._destroyRef), distinctUntilChanged()).subscribe((password) => {
			this._password.set(password ?? '');
		});
	}

	private _syncWasSent(): void {
		toObservable(this._wasSent)
			.pipe(takeUntilDestroyed(this._destroyRef), distinctUntilChanged())
			.subscribe((wasSent) => {
				if (wasSent !== true) return;
				this._router.navigate(['authentication/sign-in']);
			});
	}

	private _getTokenFromQueryParams(): void {
		const { token } = this._activatedRoute.snapshot.queryParams;
		this._token.set(token);
	}

	protected _onClickSingIn(): void {
		if (this._loader()) return;

		const form = this._form;
		if (form.invalid) return form.markAllAsTouched();

		this._apiChangePassword.changePassword({
			newPassword: form.value.newPassword!,
			token: this._token(),
		});
	}
}
