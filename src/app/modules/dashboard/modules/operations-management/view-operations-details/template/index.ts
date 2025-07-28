import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ERoleExecution } from '@dashboard/common/enums/role-execution';
import { AccessViewInformation } from '@dashboard/common/extension/access-information-view';
import { ApiGetOrderInvoiceList } from '@dashboard/modules/operations-management/view-operations-details/api/get-order-invoice-list';
import { ApiGetOrderInvoiceRadianEvents } from '@dashboard/modules/operations-management/view-operations-details/api/get-order-invoice-radian-events';
import { ApiGetOrderInvoiceStateTraceability } from '@dashboard/modules/operations-management/view-operations-details/api/get-order-invoice-state-traceability';
import { ApiGetOrderStateTraceability } from '@dashboard/modules/operations-management/view-operations-details/api/get-order-state-traceability';
import { ActiveOperationsDetailsFinancierDetails } from '@dashboard/modules/operations-management/view-operations-details/components/financier-details/financier-details';
import { ActiveOperationsDetailsOrderMinimumDetails } from '@dashboard/modules/operations-management/view-operations-details/components/order-minimum-details/order-minimum-details';
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
	providers: [ApiGetOrderInvoiceList, ApiGetOrderStateTraceability, ApiGetOrderInvoiceRadianEvents, ApiGetOrderInvoiceStateTraceability],
	imports: [
		ActiveOperationsDetailsFinancierDetails,
		ActiveOperationsDetailsProviderDetails,
		ActiveOperationsDetailsOrderMinimumDetails,
		ActiveOperationsDetailsOrderOperationsTable,
		ActiveOperationsDetailsOrderTraceabilityDrawer,
		CommonModule,
		FrsButtonModule,
		ViewCard,
	],
})
export default class OperationsManagementViewOperationsDetails extends AccessViewInformation {
	private readonly _storeActiveOperations = inject(StoreActiveOperations);
	private readonly _apiGetOperationDetails = inject(ApiGetOrderInvoiceList);
	private readonly _apiGetOperationStateTraceability = inject(ApiGetOrderStateTraceability);
	private readonly _apiGetOrderInvoiceRadianEvents = inject(ApiGetOrderInvoiceRadianEvents);
	private readonly _apiGetOrderInvoiceStateTraceability = inject(ApiGetOrderInvoiceStateTraceability);

	private readonly _operationId = signal('');

	protected readonly _eRoleExecution = ERoleExecution;
	protected readonly _activeCurrentOperation = signal<Nullable<TActiveOperation>>(null);
	protected readonly _operations = this._apiGetOperationDetails.response;
	protected readonly _isLoadingApiGetInvoiceList = this._apiGetOperationDetails.isLoading;
	protected readonly _orderTraceability = this._apiGetOperationStateTraceability.response;
	protected readonly _isLoadingApiGetOperationTraceability = this._apiGetOperationStateTraceability.isLoading;
	protected readonly _isOpenTraceabilityDrawer = signal(false);

	constructor() {
		super();
		this.getQueryParams();
		this._getOrderInvoiceList();
		this._addObservable();
	}

	private getQueryParams(): void {
		this._activateRoute.queryParams.pipe(takeUntilDestroyed(this._destroyRef)).subscribe(({ operation = '' }) => {
			this._operationId.set(operation);
		});
	}

	private _getOrderInvoiceList(): void {
		this._apiGetOperationDetails.getOrderInvoiceList({
			accessToken: this._accessToken(),
			accessModule: this._accessModule(),
			accessService: this._accessServices()?.GET_OPERATION_DETAIL_SERVICE,
			idOperation: Number(this._operationId()),
		});
	}

	private _addObservable(): void {
		this._activateRoute.queryParams.pipe(takeUntilDestroyed(this._destroyRef)).subscribe(({ operation }) => {
			const activeOperations = this._storeActiveOperations.getActiveOperationList();
			const currentOperation = activeOperations.find((activeOperation) => activeOperation.id === Number(operation));
			this._activeCurrentOperation.set(currentOperation || null);
		});
	}

	protected _getOrderStateTraceability(): void {
		if (this._isLoadingApiGetOperationTraceability()) return;

		this._isOpenTraceabilityDrawer.set(true);
		this._apiGetOperationStateTraceability.getOrderStateTraceability({
			accessToken: this._accessToken(),
			accessModule: this._accessModule(),
			accessService: this._accessServices()?.GET_OPERATION_STATE_TRACEABILITY_SERVICE,
			idOperation: this._operationId(),
		});
	}

	protected _getOrderInvoiceRadianEvents(orderInvoiceId: string): void {
		this._apiGetOrderInvoiceRadianEvents.getOrderInvoiceRadianEvent({
			accessToken: this._accessToken(),
			accessModule: this._accessModule(),
			accessService: this._accessServices()?.GET_OPERATION_DETAIL_RADIAN_EVENTS_SERVICE,
			idOperation: this._operationId(),
			idOperationDetail: orderInvoiceId,
		});
	}

	protected _getOrderInvoiceStateTraceability(orderInvoiceId: string): void {
		this._apiGetOrderInvoiceStateTraceability.getOrderInvoiceStateTraceability({
			accessToken: this._accessToken(),
			accessModule: this._accessModule(),
			accessService: this._accessServices()?.GET_OPERATION_DETAIL_STATE_TRACEABILITY_SERVICE,
			idOperation: this._operationId(),
			idOperationDetail: orderInvoiceId,
		});
	}

	protected _onEmitCloseRadianEventsDrawer(): void {
		this._isOpenTraceabilityDrawer.set(false);
	}
}
