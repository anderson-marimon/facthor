import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ERoleExecution } from '@dashboard/common/enums/role-execution';
import { AccessViewInformation } from '@dashboard/common/extension/access-information-view';
import { ApiGetOrderStatuses } from '@dashboard/modules/operations-management/view-operations/api/get-order-statuses';
import {
	ApiGetProofDisbursement,
	TApiGetProofDisbursementQuerySignalParams,
} from '@dashboard/modules/operations-management/view-proof-disbursement/api/get-proof-disbursement';
import { ViewProofDisbursementTableFilters } from '@dashboard/modules/operations-management/view-proof-disbursement/components/table-filters/table-filters';
import { FrsButtonModule } from '@fresco-ui/frs-button';
import { EmptyResult } from '@shared/components/empty-result/empty-result';
import { GeneralLoader } from '@shared/components/general-loader/general-loader';
import { InheritTableFooter } from '@shared/components/inherit-table-footer/inherit-table-footer';
import { InheritTable } from '@shared/components/inherit-table/inherit-table';
import { OrderStatus } from '@shared/components/order-status/order-status';
import { Eye, FileX2, LucideAngularModule } from 'lucide-angular';

const HEADERS = ['n.orden', 'nit del emisor', 'emisor', 'estado', 'fecha de operación', 'valor de la orden', 'detalles'];

@Component({
	selector: 'operation-management-view-proof-disbursement',
	templateUrl: 'index.html',
	providers: [ApiGetProofDisbursement, ApiGetOrderStatuses],
	imports: [
		CommonModule,
		EmptyResult,
		FrsButtonModule,
		GeneralLoader,
		InheritTable,
		InheritTableFooter,
		LucideAngularModule,
		OrderStatus,
		RouterLink,
		ViewProofDisbursementTableFilters,
	],
})
export default class OperationManagementViewProofDisbursement extends AccessViewInformation {
	private readonly _apiGetProofDisbursement = inject(ApiGetProofDisbursement);
	private readonly _apiGetOrderStatuses = inject(ApiGetOrderStatuses);
	private readonly _excludeOperationFinished = signal(false);
	private readonly _getProofDisbursementParams = signal<Partial<TApiGetProofDisbursementQuerySignalParams>>({});

	protected readonly _eyeIcon = Eye;
	protected readonly _notResultIcon = FileX2;
	protected readonly _headers = HEADERS;
	protected readonly _eRoleExecution = ERoleExecution;

	protected readonly _isLoadingApiGetProofDisbursement = this._apiGetProofDisbursement.isLoading;
	protected readonly _proofDisbursements = this._apiGetProofDisbursement.response;

	constructor() {
		super();
		this._getRouteData();
		this._getOrderStatuses();
		this._getInitProofDisbursement();
	}

	private _getRouteData(): void {
		const excludeOperationFinished = this._activateRoute.routeConfig?.data?.['ExcludeOperationFinished'];
		this._excludeOperationFinished.set(excludeOperationFinished);
	}

	private _getInitProofDisbursement(): void {
		this._getProofDisbursementParams.set({
			accessToken: this._accessToken(),
			accessModule: this._accessModule(),
			accessService: this._accessServices()?.GET_OPERATIONS_DISBURSEMENT_SERVICE,
			RoleToFind: this._roleExecution()?.id,
			ExcludeOperationFinished: this._excludeOperationFinished(),
			Page: 1,
			Size: 14,
		});

		this._apiGetProofDisbursement.getProofDisbursements(this._getProofDisbursementParams());
	}

	private _getOrderStatuses(): void {
		this._apiGetOrderStatuses.getOrderStatuses({ accessToken: this._accessToken() });
	}

	protected _getProofDisbursementForPaginator(page: number): void {
		this._apiGetProofDisbursement.getProofDisbursements({
			...this._getProofDisbursementParams(),
			Page: page,
		});
	}

	protected _getProofDisbursementForFilter(queryFilters: Partial<Omit<TApiGetProofDisbursementQuerySignalParams, 'Size'>>): void {
		this._getProofDisbursementParams.set({
			...this._getProofDisbursementParams(),
			...queryFilters,
		});

		this._apiGetProofDisbursement.getProofDisbursements(this._getProofDisbursementParams());
	}
}
