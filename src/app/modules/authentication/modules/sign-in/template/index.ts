import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiPostSignIn } from '@authentication/modules/sign-in/api/post-sign-in';
import { StoreSignInFormation } from '@authentication/modules/sign-in/stores/access-information';
import { FormValidator } from '@authentication/services/form-validator';
import { FrsButtonModule } from '@fresco-ui/frs-button';
import { FrsFieldModule } from '@fresco-ui/frs-field';
import { FrsInputModule } from '@fresco-ui/frs-input';
import { LoadingIcon } from '@shared/icons/loading-icon/loading-icon';
import { FacthorLogo } from '@shared/logos/facthor-logo/facthor-logo';
import { distinctUntilChanged } from 'rxjs';

@Component({
	selector: 'authentication-sign-in-page',
	templateUrl: 'index.html',
	viewProviders: [StoreSignInFormation, ApiPostSignIn],
	imports: [FacthorLogo, FrsFieldModule, FrsInputModule, FrsButtonModule, LoadingIcon, ReactiveFormsModule, RouterLink],
})
export default class SignInPage {
	private readonly _destroyRef = inject(DestroyRef);
	private readonly _apiPostSingIn = inject(ApiPostSignIn);
	private readonly _accessInformation = inject(StoreSignInFormation);
	private readonly _formBuilder = inject(FormBuilder);
	private readonly _validator = inject(FormValidator);
	private readonly _router = inject(Router);
	private readonly _tryAgain = signal(true);

	protected readonly _isLoadingApiPostSignIn = this._apiPostSingIn.isLoading;
	protected readonly _userData = this._apiPostSingIn.response;
	// protected readonly _username = this._formBuilder.control('', [Validators.required, this._validator.dni()]);
	protected readonly _username = this._formBuilder.control('', [Validators.required]);
	protected readonly _password = this._formBuilder.control('', [Validators.required]);

	protected readonly _form = this._formBuilder.group({
		username: this._username,
		password: this._password,
	});

	constructor() {
		this._addObservable();
	}

	private _addObservable(): void {
		toObservable(this._userData)
			.pipe(takeUntilDestroyed(this._destroyRef), distinctUntilChanged())
			.subscribe((user) => {
				if (user) {
					this._tryAgain.set(false);
					this._accessInformation.setSignInInformation(user!);
					this._router.navigate(['dashboard'], { replaceUrl: true });
				}
			});
	}

	protected _onClickSingIn(): void {
		if (this._isLoadingApiPostSignIn()) return;
		if (!this._tryAgain()) return;

		const form = this._form;
		if (form.invalid) return form.markAllAsTouched();

		this._apiPostSingIn.signIn({
			username: form.value.username!,
			password: form.value.password!,
		});
	}
}
