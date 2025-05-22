import { Component, inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';
import { ApiGetUserConfiguration } from '@dashboard/api/user-configuration';
import { AsideNav } from '@dashboard/components/aside-nav/aside-nav';
import { TopBar } from '@dashboard/components/top-bar/top-bar';
import { StoreUserConfig } from '@dashboard/stores/user-config';
import { TransitionView } from '@dashboard/transition';

@Component({
	selector: 'dashboard-layout',
	templateUrl: 'index.html',
	viewProviders: [ApiGetUserConfiguration],
	providers: [StoreUserConfig],
	imports: [RouterOutlet, AsideNav, TransitionView, TopBar],
})
export default class DashboardLayout {
	private readonly _apiGetUserConfiguration = inject(ApiGetUserConfiguration);
	private readonly _storeUserConfig = inject(StoreUserConfig);

	protected readonly _configuration = this._apiGetUserConfiguration.configuration;

	constructor() {
		this._addObservable();
		this._fetchUserConfiguration();
	}

	private _addObservable(): void {
		toObservable(this._configuration).subscribe((configuration) => {
			if (!configuration) return;
			this._storeUserConfig.setUserConfig(configuration);
		});
	}

	private _fetchUserConfiguration(): void {
		this._apiGetUserConfiguration.getUserConfiguration();
	}
}
