import { Injectable } from '@angular/core';
import { TUserConfig } from '@dashboard/api/user-configuration';
import { ComponentStore } from '@ngrx/component-store';
import { devReduxTool } from '@tools/dev-redux.tool';

type TStoreUserConfig = {
	userConfig: TUserConfig;
};

@Injectable()
export class StoreUserConfig extends ComponentStore<TStoreUserConfig> {
	public readonly userConfig = this.select((store) => store.userConfig);

	constructor() {
		super({
			userConfig: null,
		});

		devReduxTool(this, 'USER_CONFIG_STORE');
	}

	public setUserConfig = this.updater((store, userConfig: TUserConfig) => ({
		...store,
		userConfig,
	}));
}
