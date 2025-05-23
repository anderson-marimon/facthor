import { Inject, inject, Injectable, PLATFORM_ID } from '@angular/core';
import { devReduxTool } from '@tools/dev-redux.tool';
import { ComponentStore } from '@ngrx/component-store';
import { isPlatformBrowser } from '@angular/common';

export type TUserState = {
	user: Record<string, any>;
};

@Injectable()
export class AccessInformationStore extends ComponentStore<TUserState> {
	constructor() {
		super(AccessInformationStore._getInitialState(inject(PLATFORM_ID)));
		this._persistence();
		devReduxTool(this, 'ACCESS_INFORMATION_STORE');
	}

	private readonly _platformId = inject(PLATFORM_ID);
	private readonly _storageKey = 'ACCESS_INFORMATION_STORE';
	public readonly user = this.select((store) => store.user);

	private _persistence(): void {
		if (!isPlatformBrowser(this._platformId)) return;

		this.user.subscribe((user) => {
			sessionStorage.setItem(this._storageKey, JSON.stringify({ user }));
		});
	}

	private static _getInitialState(platformId: Object): TUserState {
		if (!isPlatformBrowser(platformId)) {
			return { user: {} };
		}

		const data = sessionStorage.getItem('ACCESS_INFORMATION_STORE');

		try {
			return data ? JSON.parse(data) : { user: {} };
		} catch {
			return { user: {} };
		}
	}

	public setUser = this.updater((store, user: Record<string, any>) => ({
		...store,
		user,
	}));

	public clearUser = this.updater((store) => {
		if (isPlatformBrowser(this._platformId)) {
			sessionStorage.removeItem(this._storageKey);
		}
		return { ...store, user: {} };
	});
}
