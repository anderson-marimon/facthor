import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ERoleExecution } from '@dashboard/common/enums/role-execution';
import { AccessViewInformation } from '@dashboard/common/extension/access-information-view';
import { ApiGetOrderStatuses } from '@dashboard/modules/operations-management/view-operations/api/get-order-statuses';
import {
	ApiGetProofDisbursementDetails,
	TApiGetProofDisbursementDetailsQuerySignalParams,
} from '@dashboard/modules/operations-management/view-proof-disbursement-details/api/get-proof-disbursement-details';
import { ViewProofDisbursementDetailsTableFilters } from '@dashboard/modules/operations-management/view-proof-disbursement-details/components/table-filters/table-filters';
import { FrsButtonModule } from '@fresco-ui/frs-button';
import { EmptyResult } from '@shared/components/empty-result/empty-result';
import { GeneralLoader } from '@shared/components/general-loader/general-loader';
import { InheritTableFooter } from '@shared/components/inherit-table-footer/inherit-table-footer';
import { InheritTable } from '@shared/components/inherit-table/inherit-table';
import { OrderStatus } from '@shared/components/order-status/order-status';
import { FileX2, LucideAngularModule } from 'lucide-angular';

const HEADERS = ['tipo de desembolso', 'estado de desembolso', 'monto', 'description', 'documento'];

@Component({
	selector: 'operation-management-view-proof-disbursement-details',
	templateUrl: 'index.html',
	providers: [ApiGetProofDisbursementDetails, ApiGetOrderStatuses],
	imports: [
		CommonModule,
		EmptyResult,
		FrsButtonModule,
		GeneralLoader,
		InheritTable,
		InheritTableFooter,
		LucideAngularModule,
		OrderStatus,
		ViewProofDisbursementDetailsTableFilters,
	],
})
export default class OperationManagementViewProofDisbursementDetails extends AccessViewInformation {
	private readonly _apiGetProofDisbursement = inject(ApiGetProofDisbursementDetails);
	private readonly _apiGetOrderStatuses = inject(ApiGetOrderStatuses);
	private readonly _operationId = signal('');
	private readonly _getProofDisbursementDetailsParams = signal<Partial<TApiGetProofDisbursementDetailsQuerySignalParams>>({});

	protected readonly _notResultIcon = FileX2;
	protected readonly _headers = HEADERS;
	protected readonly _eRoleExecution = ERoleExecution;

	protected readonly _isLoadingApiGetProofDisbursementDetails = this._apiGetProofDisbursement.isLoading;
	protected readonly _proofDisbursementDetails = this._apiGetProofDisbursement.response;

	constructor() {
		super();
		this._getQueryParams();
		this._getOrderStatuses();
		this._getInitProofDisbursementDetails();
	}

	private _getQueryParams(): void {
		this._activateRoute.queryParams.pipe(takeUntilDestroyed(this._destroyRef)).subscribe(({ operation = '' }) => {
			this._operationId.set(operation);
		});
	}

	private _getInitProofDisbursementDetails(): void {
		this._getProofDisbursementDetailsParams.set({
			accessToken: this._accessToken(),
			accessModule: this._accessModule(),
			accessService: this._accessServices()?.GET_PROOF_DISBURSEMENT_SERVICE,
			IdOperation: this._operationId(),
			Page: 1,
			Size: 14,
		});

		this._apiGetProofDisbursement.getProofDisbursementDetails(this._getProofDisbursementDetailsParams());
	}

	private _getOrderStatuses(): void {
		this._apiGetOrderStatuses.getOrderStatuses({ accessToken: this._accessToken() });
	}

	protected _getProofDisbursementDetailsForPaginator(page: number): void {
		this._apiGetProofDisbursement.getProofDisbursementDetails({
			...this._getProofDisbursementDetailsParams(),
			Page: page,
		});
	}

	protected _getProofDisbursementDetailsForFilter(queryFilters: Partial<Omit<TApiGetProofDisbursementDetailsQuerySignalParams, 'Size'>>): void {
		this._getProofDisbursementDetailsParams.set({
			...this._getProofDisbursementDetailsParams(),
			...queryFilters,
		});

		this._apiGetProofDisbursement.getProofDisbursementDetails(this._getProofDisbursementDetailsParams());
	}
}
