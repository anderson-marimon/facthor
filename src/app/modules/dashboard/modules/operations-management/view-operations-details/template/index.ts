import { trigger, transition, style, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { TRoleExecution } from '@dashboard/api/user-configuration';
import { EAccessInformation } from '@dashboard/common/enums/access-information';
import { ERoleExecution } from '@dashboard/common/enums/role-execution';
import { TAccessServices } from '@dashboard/common/enums/services';
import { ApiGetOperationStateTraceability } from '@dashboard/modules/operations-management/view-operations-details//api/get-operation-state-traceability';
import { ApiGetOperationDetail } from '@dashboard/modules/operations-management/view-operations-details/api/get-operation-detail';
import { ActiveOperationsDetailsFinancierDetails } from '@dashboard/modules/operations-management/view-operations-details/components/financier-details/financier-details';
import { ActiveOperationsDetailsOperationDetails } from '@dashboard/modules/operations-management/view-operations-details/components/operation-details/operation-details';
import { ActiveOperationsDetailsOrderOperationsTable } from '@dashboard/modules/operations-management/view-operations-details/components/order-operations-table/order-operations-table';
import { ActiveOperationsDetailsOrderTraceabilityDrawer } from '@dashboard/modules/operations-management/view-operations-details/components/order-traceability-drawer/order-traceability-drawer';
import { ActiveOperationsDetailsProviderDetails } from '@dashboard/modules/operations-management/view-operations-details/components/provider-details/provider-details';
import { TActiveOperation } from '@dashboard/modules/operations-management/view-operations/api/get-active-operations-list';
import { StoreActiveOperations } from '@dashboard/modules/operations-management/view-operations/stores/active-operations';
import { FrsButtonModule } from '@fresco-ui/frs-button';
import { ViewCard } from '@shared/components/view-card/view-card';

@Component({
	selector: 'operations-management-view-operations-details',
	templateUrl: 'index.html',
	animations: [
		trigger('slideEffect', [
			transition(':enter', [
				style({ transform: 'translateX(-100%)' }),
				animate('600ms cubic-bezier(0.25, 1, 0.5, 1)', style({ transform: 'translateX(0)' })),
			]),
			transition(':leave', [animate('600ms cubic-bezier(0.25, 1, 0.5, 1)', style({ transform: 'translateX(-100%)' }))]),
		]),
	],
	providers: [ApiGetOperationDetail, ApiGetOperationStateTraceability],
	imports: [
		ActiveOperationsDetailsFinancierDetails,
		ActiveOperationsDetailsProviderDetails,
		ActiveOperationsDetailsOperationDetails,
		ActiveOperationsDetailsOrderOperationsTable,
		ActiveOperationsDetailsOrderTraceabilityDrawer,
		CommonModule,
		FrsButtonModule,
		ViewCard,
	],
})
export default class OperationsManagementViewOperationsDetails {
	private readonly _destroyRef = inject(DestroyRef);
	private readonly _activateRoute = inject(ActivatedRoute);
	private readonly _storeActiveOperations = inject(StoreActiveOperations);
	private readonly _apiGetOperationDetails = inject(ApiGetOperationDetail);
	private readonly _apiGetOperationStateTraceability = inject(ApiGetOperationStateTraceability);

	private _accessToken = '';
	private _accessModule = '';
	private _accessServices: Nullable<TAccessServices> = null;
	private _operationId = '';

	protected readonly _eRoleExecution = ERoleExecution;
	protected readonly _roleExecution = signal<Nullable<TRoleExecution>>(null);
	protected readonly _activeCurrentOperation = signal<Nullable<TActiveOperation>>(null);
	protected readonly _operations = this._apiGetOperationDetails.response;
	protected readonly _isLoadingApiGetInvoiceList = this._apiGetOperationDetails.isLoading;
	protected readonly _orderTraceability = this._apiGetOperationStateTraceability.response;
	protected readonly _isLoadingApiGetOperationTraceability = this._apiGetOperationStateTraceability.isLoading;
	protected readonly _isOpenTraceabilityDrawer = signal(false);

	constructor() {
		this._getAccessInformation();
		this._getOperationsDetailsList();
		this._addObservable();
	}

	private _getAccessInformation(): void {
		this._activateRoute.data.pipe(takeUntilDestroyed(this._destroyRef)).subscribe((data) => {
			this._accessToken = data[EAccessInformation.TOKEN];
			this._accessModule = data[EAccessInformation.MODULE];
			this._accessServices = data[EAccessInformation.SERVICES];
			this._roleExecution.set(data[EAccessInformation.ROLE_EXECUTION]);
		});

		this._activateRoute.queryParams.pipe(takeUntilDestroyed(this._destroyRef)).subscribe(({ operation = '' }) => {
			this._operationId = operation;
		});
	}

	private _getOperationsDetailsList(): void {
		this._apiGetOperationDetails.getOperationDetails({
			accessToken: this._accessToken,
			accessModule: this._accessModule,
			accessService: this._accessServices?.GET_OPERATION_DETAIL_SERVICE,
			idOperation: this._operationId,
		});
	}

	private _addObservable(): void {
		this._activateRoute.queryParams.pipe(takeUntilDestroyed(this._destroyRef)).subscribe(({ operation }) => {
			const activeOperations = this._storeActiveOperations.getActiveOperationList();
			const currentOperation = activeOperations.find((activeOperation) => activeOperation.id === Number(operation));
			this._activeCurrentOperation.set(currentOperation || null);
		});
	}

	protected _getOperationStateTraceability(): void {
		if (this._isLoadingApiGetOperationTraceability()) return;

		this._isOpenTraceabilityDrawer.set(true);
		this._apiGetOperationStateTraceability.getOperationStateTraceability({
			accessToken: this._accessToken,
			accessModule: this._accessModule,
			accessService: this._accessServices?.GET_OPERATION_STATE_TRACEABILITY_SERVICE,
			idOperation: this._operationId,
		});
	}

	protected _onEmitCloseRadianEventsDrawer(): void {
		this._isOpenTraceabilityDrawer.set(false);
	}
}
