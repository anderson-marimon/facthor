import { Injectable } from '@angular/core';
import { TSubmodulePermission, TUserConfig } from '@dashboard/api/user-configuration';
import { ComponentStore } from '@ngrx/component-store';
import { devReduxTool } from '@tools/dev-redux.tool';

type TStoreUserConfig = {
	userConfig: TUserConfig | null;
	flatRoutes: string[];
};

@Injectable()
export class StoreUserConfig extends ComponentStore<TStoreUserConfig> {
	constructor() {
		super({ userConfig: null, flatRoutes: [] });
		devReduxTool(this, 'USER_CONFIG_STORE');
	}

	public readonly userConfig = this.select((state) => state.userConfig);
	public readonly permissions = this.select((state) => state.flatRoutes);

	private readonly setUserConfig = this.updater((state, userConfig: TUserConfig) => {
		const flatRoutes = StoreUserConfig.flattenRoutes(userConfig?.permissions);
		return { ...state, userConfig, flatRoutes };
	});

	private static flattenRoutes(modules: TSubmodulePermission[] = []): string[] {
		const flat: string[] = [];
		const recurse = (items: TSubmodulePermission[]) => {
			for (const item of items) {
				if (item.route) flat.push(item.route);
				if (item.submodules?.length) recurse(item.submodules);
			}
		};
		recurse(modules);
		return flat;
	}

	public readonly loadUserConfig = (config: TUserConfig): Promise<boolean> => {
		this.setUserConfig(config);
		return Promise.resolve(true);
	};

	public readonly hasAccess = (route: string) => this.select((state) => state.flatRoutes.includes(route));

	public readonly hasConfig = () => this.select((state) => !!state.userConfig && !!state.flatRoutes.length);
}
