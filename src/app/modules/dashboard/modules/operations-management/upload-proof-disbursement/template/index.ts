import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ERoleExecution } from '@dashboard/common/enums/role-execution';
import { AccessViewInformation } from '@dashboard/common/extension/access-information-view';
import { ApiPostApproveOperations } from '@dashboard/modules/operations-management/approve-operations/api/post-approve-operations';
import { UploadProofDisbursementTableFilters } from '@dashboard/modules/operations-management/upload-proof-disbursement/components/table-filters/table-filters';
import {
	ApiGetActiveOperationList,
	TApiGetActiveOperationsListQueryParams,
	TApiGetActiveOperationsListQuerySignalParams,
} from '@dashboard/modules/operations-management/view-operations/api/get-active-operations-list';
import { ApiGetOrderStatuses } from '@dashboard/modules/operations-management/view-operations/api/get-order-statuses';
import { FrsButtonModule } from '@fresco-ui/frs-button';
import { EmptyResult } from '@shared/components/empty-result/empty-result';
import { GeneralLoader } from '@shared/components/general-loader/general-loader';
import { InheritTableFooter } from '@shared/components/inherit-table-footer/inherit-table-footer';
import { InheritTable } from '@shared/components/inherit-table/inherit-table';
import { OrderStatus } from '@shared/components/order-status/order-status';
import { FileX2 } from 'lucide-angular';

const HEADERS = ['n.orden', 'nit del emisor', 'emisor', 'receptor', 'estado', 'total a financiar', 'fecha de operación', 'detalles'];

@Component({
	selector: 'operations-management-upload-proof-disbursement',
	templateUrl: 'index.html',
	providers: [ApiGetActiveOperationList, ApiGetOrderStatuses, ApiPostApproveOperations],
	imports: [
		CommonModule,
		EmptyResult,
		GeneralLoader,
		FrsButtonModule,
		InheritTable,
		InheritTableFooter,
		OrderStatus,
		RouterLink,
		UploadProofDisbursementTableFilters,
	],
})
export default class OperationsManagementUploadProofDisbursement extends AccessViewInformation {
	private readonly _apiGetOrderStatuses = inject(ApiGetOrderStatuses);
	private readonly _apiGetActiveOperationList = inject(ApiGetActiveOperationList);
	private readonly _getActiveOperationListParams = signal<Partial<TApiGetActiveOperationsListQuerySignalParams>>({});

	protected readonly _notResultIcon = FileX2;
	protected readonly _headers = HEADERS;
	protected readonly _eRoleExecution = ERoleExecution;

	protected readonly _operations = this._apiGetActiveOperationList.response;
	protected readonly _isLoadingApiGetInvoiceList = this._apiGetActiveOperationList.isLoading;

	constructor() {
		super();
		this._getOrderStatuses();
		this._getInitActiveOperationList();
	}

	private _getOrderStatuses(): void {
		this._apiGetOrderStatuses.getOrderStatuses({ accessToken: this._accessToken() });
	}

	private _getInitActiveOperationList(): void {
		this._getActiveOperationListParams.set({
			accessToken: this._accessToken(),
			accessModule: this._accessModule(),
			accessService: this._accessServices()?.GET_OPERATIONS_ACTIVE_SERVICE,
			RoleToFind: this._roleExecution()?.id,
			IdOperationState: this._roleExecution()?.id === this._eRoleExecution.FINANCIER ? 13 : 17,
			Page: 1,
			Size: 14,
		});

		this._apiGetActiveOperationList.getActiveOperationsList(this._getActiveOperationListParams());
	}

	protected _getActiveOperationListForPaginator(page: number): void {
		this._apiGetActiveOperationList.getActiveOperationsList({
			...this._getActiveOperationListParams(),
			Page: page,
		});
	}

	protected _getActiveOperationListForFilter(queryFilters: Partial<Omit<TApiGetActiveOperationsListQueryParams, 'Size'>>): void {
		this._getActiveOperationListParams.set({
			...this._getActiveOperationListParams(),
			...queryFilters,
		});

		this._apiGetActiveOperationList.getActiveOperationsList(this._getActiveOperationListParams());
	}
}
