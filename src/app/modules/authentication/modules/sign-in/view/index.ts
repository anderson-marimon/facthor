import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiSignInPost } from '@authentication/modules/sign-in/api/sign-in-post';
import { FormValidator } from '@authentication/services/form-validator';
import { FrsButtonModule } from '@fresco-ui/frs-button';
import { FrsFieldModule } from '@fresco-ui/frs-field';
import { FrsInputModule } from '@fresco-ui/frs-input';
import { LoadingIcon } from '@shared/icons/loading-icon/loading-icon';
import { FacthorLogo } from '@shared/logos/facthor-logo/facthor-logo';

@Component({
	selector: 'authentication-sign-in-page',
	templateUrl: 'index.html',
	viewProviders: [ApiSignInPost],
	imports: [FacthorLogo, FrsFieldModule, FrsInputModule, FrsButtonModule, LoadingIcon, ReactiveFormsModule, RouterLink],
})
export default class SignInPage {
	private readonly _apiSingIn = inject(ApiSignInPost);
	private readonly _formBuilder = inject(FormBuilder);
	private readonly _validator = inject(FormValidator);

	protected readonly _loader = this._apiSingIn.loader;
	protected readonly _username = this._formBuilder.control('', [Validators.required, this._validator.dni()]);
	protected readonly _password = this._formBuilder.control('', [Validators.required]);

	protected readonly _form = this._formBuilder.group({
		username: this._username,
		password: this._password,
	});

	protected _onClickSingIn(): void {
		if (this._loader()) return;

		const form = this._form;
		if (form.invalid) return form.markAllAsTouched();

		this._apiSingIn.signIn({
			username: form.value.username!,
			password: form.value.password!,
		});
	}
}
