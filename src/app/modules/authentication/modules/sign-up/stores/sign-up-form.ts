import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { devReduxTool } from '@tools/dev-redux.tool';

export interface TSignUpFormState {
	roleForm: Record<string, any>;
	businessForm: Record<string, any>;
	documentsForm: Record<string, any>;
	accountForm: Record<string, any>;
}

@Injectable()
export class SignUpFormStore extends ComponentStore<TSignUpFormState> {
	public readonly roleForm = this.select((store) => store.roleForm);
	public readonly businessForm = this.select((store) => store.businessForm);
	public readonly documentsForm = this.select((store) => store.documentsForm);
	public readonly accountForm = this.select((store) => store.roleForm);

	constructor() {
		super({
			roleForm: {},
			businessForm: {},
			documentsForm: {},
			accountForm: {},
		});

		devReduxTool(this, 'SIGN_UP_FORM_STORE');
	}

	public setRoleForm = this.updater((store, roleForm: Record<string, any>) => ({
		...store,
		roleForm,
	}));

	public setBusinessForm = this.updater((store, businessForm: Record<string, any>) => ({
		...store,
		businessForm,
	}));

	public setDocumentsForm = this.updater((store, documentsForm: Record<string, any>) => ({
		...store,
		documentsForm,
	}));

	public setAccountForm = this.updater((store, accountForm: Record<string, any>) => ({
		...store,
		accountForm,
	}));
}
