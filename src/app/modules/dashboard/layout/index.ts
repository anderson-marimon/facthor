import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ApiGetUserConfiguration } from '@dashboard/api/user-configuration';
import { AsideNav } from '@dashboard/components/aside-nav/aside-nav';
import { TopBar } from '@dashboard/components/top-bar/top-bar';
import { TransitionView } from '@dashboard/transition';

@Component({
	selector: 'dashboard-layout',
	templateUrl: 'index.html',
	providers: [ApiGetUserConfiguration],
	imports: [RouterOutlet, AsideNav, TransitionView, TopBar],
})
export default class DashboardLayout {
	private readonly _apiGetUserConfiguration = inject(ApiGetUserConfiguration);
	protected readonly _configuration = this._apiGetUserConfiguration.configuration;

	constructor() {
		this._fetchUserConfiguration();
	}

	private _fetchUserConfiguration(): void {
		this._apiGetUserConfiguration.getUserConfiguration();
	}
}
