import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { devReduxTool } from '@tools/dev-redux.tool';

export type TUserState = {
	signInInformation: Record<string, any>;
};

@Injectable()
export class StoreSignInFormation extends ComponentStore<TUserState> {
	constructor() {
		super({ signInInformation: {} });
		devReduxTool(this, 'ACCESS_INFORMATION_STORE');
	}

	public readonly singInInformation = this.select((store) => store.signInInformation);

	public readonly setSignInInformation = this.updater((store, user: Record<string, any>) => {
		return { ...store, signInInformation: user };
	});

	public readonly getSingInInformation = this.updater((store) => {
		return { ...store, signInInformation: {} };
	});
}
