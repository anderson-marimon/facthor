import { Injectable } from '@angular/core';
import { TSubmodulePermission, TUserConfig } from '@dashboard/api/user-configuration';
import { ComponentStore } from '@ngrx/component-store';
import { devReduxTool } from '@tools/dev-redux.tool';

type TStoreUserConfig = {
	userConfig: TUserConfig | null;
	permissions: string[];
};

@Injectable()
export class StoreUserConfig extends ComponentStore<TStoreUserConfig> {
	constructor() {
		super({ userConfig: null, permissions: [] });
		devReduxTool(this, 'USER_CONFIG_STORE');
	}

	public readonly userConfig = this.select((state) => state.userConfig);
	public readonly permissions = this.select((state) => state.permissions);

	private readonly setUserConfig = this.updater((state, userConfig: TUserConfig) => {
		const permissions = this._extractPermissions(userConfig?.permissions);

		return { ...state, userConfig, permissions };
	});

	private _extractPermissions(modules: TSubmodulePermission[] = []): string[] {
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

	public getServicesByRoute(targetRoute: string): Record<string, TUserServices> {
		const permissions = this.get().userConfig?.permissions ?? [];
		let accessServices: Record<string, TUserServices> = {};

		const recurse = (submodules: TSubmodulePermission[]) => {
			for (const submodule of submodules) {
				if (submodule.route === targetRoute && submodule.services?.length) {
					accessServices = submodule.services.reduce((acc, service) => {
						acc[service.code] = {
							service: service.urn,
							method: service.method,
						};
						return acc;
					}, {} as Record<string, TUserServices>);
					return;
				}
				if (submodule.submodules?.length) {
					recurse(submodule.submodules);
				}
			}
		};

		recurse(permissions);
		return accessServices;
	}

	public getModuleByRoute(targetRoute: string): string {
		const permissions = this.get().userConfig?.permissions ?? [];
		let accessModule = '';

		for (const module of permissions) {
			for (const subModule of module.submodules) {
				if (subModule.route === targetRoute) {
					accessModule = subModule.code;
				}
			}
		}

		return accessModule;
	}

	public readonly loadUserConfig = (config: TUserConfig): Promise<boolean> => {
		this.setUserConfig(config);
		return Promise.resolve(true);
	};

	public readonly hasAccess = (route: string) => this.select((state) => state.permissions.includes(route));
	public readonly hasConfig = () => this.select((state) => !!state.userConfig && !!state.permissions.length);
}
