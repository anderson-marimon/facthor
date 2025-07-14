import { DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { TIdentity, TRoleExecution } from '@dashboard/api/user-configuration';
import { EAccessInformation } from '@dashboard/common/enums/access-information';
import { TAccessServices } from '@dashboard/common/enums/services';

export abstract class AccessViewInformation {
	protected readonly _destroyRef = inject(DestroyRef);
	protected readonly _activateRoute = inject(ActivatedRoute);
	protected readonly _accessToken = signal('');
	protected readonly _accessModule = signal('');
	protected readonly _accessServices = signal<Nullable<TAccessServices>>(null);
	protected readonly _sessionKey = signal('');
	protected readonly _roleExecution = signal<Nullable<TRoleExecution>>(null);
	protected readonly _identity = signal<Nullable<TIdentity>>(null);

	constructor() {
		this._getAccessInformation();
	}

	private _getAccessInformation(): void {
		this._activateRoute.data.pipe(takeUntilDestroyed(this._destroyRef)).subscribe((data) => {
			this._accessToken.set(data[EAccessInformation.TOKEN]);
			this._accessModule.set(data[EAccessInformation.MODULE]);
			this._accessServices.set(data[EAccessInformation.SERVICES]);
			this._identity.set(data[EAccessInformation.IDENTITY]);
			this._roleExecution.set(data[EAccessInformation.ROLE_EXECUTION]);
			this._sessionKey.set(data[EAccessInformation.SESSION_KEY]);
		});
	}
}
