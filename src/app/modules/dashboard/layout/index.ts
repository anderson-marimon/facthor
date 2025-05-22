import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TUserConfig } from '@dashboard/api/user-configuration';
import { AsideNav } from '@dashboard/components/aside-nav/aside-nav';
import { TopBar } from '@dashboard/components/top-bar/top-bar';
import { StoreUserConfig } from '@dashboard/stores/user-config';
import { TransitionView } from '@dashboard/transition';

@Component({
	selector: 'dashboard-layout',
	templateUrl: 'index.html',
	imports: [RouterOutlet, AsideNav, TransitionView, TopBar],
})
export default class DashboardLayout {
	private readonly _storeUserConfig = inject(StoreUserConfig);
	protected readonly _configuration = signal<TUserConfig>(null);

	constructor() {
		this._addObservable();
	}

	private _addObservable(): void {
		this._storeUserConfig.userConfig.subscribe((config) => {
			this._configuration.set(config);
		});
	}
}
