import { Injectable } from '@angular/core';
import { devReduxTool } from '@tools/dev-redux.tool';
import { ComponentStore } from '@ngrx/component-store';

export type TUserState = {
	user: Record<string, any>;
};

@Injectable()
export class AccessInformationStore extends ComponentStore<TUserState> {
	constructor() {
		super(AccessInformationStore._getInitialState());
		this._persistence();

		devReduxTool(this, 'ACCESS_INFORMATION_STORE');
	}

	private readonly _storageKey = 'ACCESS_INFORMATION_STORE';
	public readonly user = this.select((store) => store.user);

	public setUser = this.updater((store, user: Record<string, any>) => ({
		...store,
		user,
	}));

	public clearUser = this.updater((store) => {
		sessionStorage.removeItem(this._storageKey);
		return { ...store, user: {} };
	});

	private _persistence(): void {
		this.user.subscribe((user) => {
			sessionStorage.setItem(this._storageKey, JSON.stringify({ user }));
		});
	}

	private static _getInitialState(): TUserState {
		const data = sessionStorage.getItem('ACCESS_INFORMATION_STORE');

		try {
			return data ? JSON.parse(data) : { user: {} };
		} catch {
			return { user: {} };
		}
	}
}
