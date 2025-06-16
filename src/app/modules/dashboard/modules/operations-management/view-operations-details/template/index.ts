import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { TRoleExecution } from '@dashboard/api/user-configuration';
import { EAccessInformation } from '@dashboard/common/enums/access-information';
import { ERoleExecution } from '@dashboard/common/enums/role-execution';
import { TAccessServices } from '@dashboard/common/enums/services';
import { ActiveOperationsDetailsFinancierDetails } from '@dashboard/modules/operations-management/view-operations-details/components/financier-details/financier-details';
import { ActiveOperationsDetailsOperationDetails } from '@dashboard/modules/operations-management/view-operations-details/components/operation-details/operation-details';
import { ActiveOperationsDetailsProviderDetails } from '@dashboard/modules/operations-management/view-operations-details/components/provider-details/provider-details';
import { TActiveOperation } from '@dashboard/modules/operations-management/view-operations/api/get-active-operations-list';
import { StoreActiveOperations } from '@dashboard/modules/operations-management/view-operations/stores/active-operations';
import { ViewCard } from '@shared/components/view-card/view-card';

@Component({
	selector: 'operations-management-view-operations-details',
	templateUrl: 'index.html',
	imports: [
		ActiveOperationsDetailsFinancierDetails,
		ActiveOperationsDetailsProviderDetails,
		ActiveOperationsDetailsOperationDetails,
		CommonModule,
		ViewCard,
	],
})
export default class OperationsManagementViewOperationsDetails {
	private readonly _destroyRef = inject(DestroyRef);
	private readonly _activateRoute = inject(ActivatedRoute);
	private readonly _storeActiveOperations = inject(StoreActiveOperations);
	private readonly _accessToken = signal('');
	private readonly _accessModule = signal('');
	private readonly _sessionKey = signal('');
	private readonly _accessServices = signal<Nullable<TAccessServices>>(null);

	protected readonly _eRoleExecution = ERoleExecution;
	protected readonly _roleExecution = signal<Nullable<TRoleExecution>>(null);
	protected readonly _activeCurrentOperation = signal<Nullable<TActiveOperation>>(null);

	constructor() {
		this._getAccessInformation();
		this._addObservable();
	}

	private _getAccessInformation(): void {
		this._activateRoute.data.pipe(takeUntilDestroyed(this._destroyRef)).subscribe((data) => {
			this._accessToken.set(data[EAccessInformation.TOKEN]);
			this._accessModule.set(data[EAccessInformation.MODULE]);
			this._accessServices.set(data[EAccessInformation.SERVICES]);
			this._roleExecution.set(data[EAccessInformation.ROLE_EXECUTION]);
			this._sessionKey.set(data[EAccessInformation.SESSION_KEY]);
		});
	}

	private _addObservable(): void {
		this._activateRoute.queryParams.pipe(takeUntilDestroyed(this._destroyRef)).subscribe(({ operation }) => {
			const activeOperations = this._storeActiveOperations.getActiveOperationList();
			const currentOperation = activeOperations.find((activeOperation) => activeOperation.id === Number(operation));
			this._activeCurrentOperation.set(currentOperation || null);
		});
	}
}
