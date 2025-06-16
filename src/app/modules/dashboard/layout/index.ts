import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { TIdentity, TModulePermission, TRoleExecution } from '@dashboard/api/user-configuration';
import { EAccessInformation } from '@dashboard/common/enums/access-information';
import { AsideNav } from '@dashboard/components/aside-nav/aside-nav';
import { TopBar } from '@dashboard/components/top-bar/top-bar';
import { TransitionView } from '@shared/transition';

@Component({
	selector: 'dashboard-layout',
	templateUrl: 'index.html',
	imports: [RouterOutlet, AsideNav, TransitionView, TopBar],
})
export default class DashboardLayout {
	private readonly _destroyRef = inject(DestroyRef);
	private readonly _activateRoute = inject(ActivatedRoute);

	protected readonly _permissionList = signal<TModulePermission[]>([]);
	protected readonly _roleExecution = signal<Nullable<TRoleExecution>>(null);
	protected readonly _identity = signal<Nullable<TIdentity>>(null);

	constructor() {
		this._getAccessInformation();
	}

	private _getAccessInformation(): void {
		this._activateRoute.data.pipe(takeUntilDestroyed(this._destroyRef)).subscribe((data) => {
			this._identity.set(data[EAccessInformation.IDENTITY]);
			this._roleExecution.set(data[EAccessInformation.ROLE_EXECUTION]);
			this._permissionList.set(data[EAccessInformation.PERMISSION_LIST]);
		});
	}
}
