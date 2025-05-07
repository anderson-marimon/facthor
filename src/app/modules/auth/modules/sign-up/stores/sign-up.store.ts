import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { devReduxTool } from '@tools/dev-redux.tool';

export interface SignUpFormState {
	roleForm: Record<string, any>;
	businessForm: Record<string, any>;
	documentsForm: Record<string, any>;
	accountForm: Record<string, any>;
}

@Injectable()
export class SignUpFormStore extends ComponentStore<SignUpFormState> {
	public readonly roleForm = this.select((state) => state.roleForm);
	public readonly businessForm = this.select((state) => state.businessForm);
	public readonly documentsForm = this.select((state) => state.documentsForm);
	public readonly accountForm = this.select((state) => state.roleForm);

	constructor() {
		super({
			roleForm: {},
			businessForm: {},
			documentsForm: {},
			accountForm: {},
		});

		devReduxTool(this, 'SIGN_UP_FORM_STORE');
	}

	public setRoleForm = this.updater((state, roleForm: Record<string, any>) => ({
		...state,
		roleForm,
	}));

	public setBusinessForm = this.updater((state, businessForm: Record<string, any>) => ({
		...state,
		businessForm,
	}));

	public setDocumentsForm = this.updater((state, documentsForm: Record<string, any>) => ({
		...state,
		documentsForm,
	}));

	public setAccountForm = this.updater((state, accountForm: Record<string, any>) => ({
		...state,
		accountForm,
	}));
}
