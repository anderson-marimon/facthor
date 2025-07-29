import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ERoleExecution } from '@dashboard/common/enums/role-execution';
import { AccessViewInformation } from '@dashboard/common/extension/access-information-view';
import { ApiPostApproveOperations } from '@dashboard/modules/operations-management/approve-operations/api/post-approve-operations';
import { UploadProofDisbursementTableFilters } from '@dashboard/modules/operations-management/upload-proof-disbursement/components/table-filters/table-filters';
import {
	ApiGetActiveOperationList,
	TActiveOperation,
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
import { FrsDialogRef } from '@fresco-ui/frs-dialog/frs-service';
import { UploadProofReserveDisbursementModal } from '@dashboard/modules/operations-management/upload-proof-disbursement/components/upload-proof-reserve-disbursement-modal/upload-proof-reserve-disbursement-modal';
import { ApiGetOrderInvoiceList } from '@dashboard/modules/operations-management/view-operations-details/api/get-order-invoice-list';
import { EOrderStatus } from '@dashboard/common/enums/order-status';
import { ApiPostUploadProofDisbursementReserveFinancier } from '@dashboard/modules/operations-management/upload-proof-disbursement/api/post-upload-proof-disbursement-reverse-financier';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';

const HEADERS = ['n.orden', 'nit del emisor', 'emisor', 'receptor', 'estado', 'total a financiar', 'fecha de operación', 'detalles'];

@Component({
	selector: 'operations-management-upload-proof-disbursement',
	templateUrl: 'index.html',
	providers: [
		ApiGetActiveOperationList,
		ApiGetOrderStatuses,
		ApiPostApproveOperations,
		ApiGetOrderInvoiceList,
		ApiPostUploadProofDisbursementReserveFinancier,
	],
	imports: [
		CommonModule,
		EmptyResult,
		GeneralLoader,
		FrsButtonModule,
		InheritTable,
		InheritTableFooter,
		OrderStatus,
		UploadProofDisbursementTableFilters,
	],
})
export default class OperationsManagementUploadProofDisbursement extends AccessViewInformation {
	private readonly _apiGetOrderStatuses = inject(ApiGetOrderStatuses);
	private readonly _apiGetActiveOperationList = inject(ApiGetActiveOperationList);
	private readonly _apiGetOrderInvoiceList = inject(ApiGetOrderInvoiceList);
	private readonly _apiPostUploadProofDisbursementReserveFinancier = inject(ApiPostUploadProofDisbursementReserveFinancier);
	private readonly _dialogRef = inject(FrsDialogRef);

	protected readonly _getActiveOperationListParams = signal<Partial<TApiGetActiveOperationsListQuerySignalParams>>({});
	protected readonly _headers = HEADERS;
	protected readonly _eRoleExecution = ERoleExecution;
	protected readonly _operationSelected = signal(0);

	protected readonly _operations = this._apiGetActiveOperationList.response;
	protected readonly _operationsFiltered = signal<TActiveOperation[]>([]);
	protected readonly _isLoadingApiGetInvoiceList = this._apiGetActiveOperationList.isLoading;
	protected readonly _UploadProofDisbursementReserveFinancierResult = this._apiPostUploadProofDisbursementReserveFinancier.response;
	protected readonly _isLoadingApiPostUploadProofDisbursementReserveFinancier = this._apiPostUploadProofDisbursementReserveFinancier.isLoading;

	constructor() {
		super();
		this._addObservables();
		this._getOrderStatuses();
		this._getInitActiveOperationList();
	}

	private _addObservables(): void {
		toObservable(this._UploadProofDisbursementReserveFinancierResult)
			.pipe(takeUntilDestroyed(this._destroyRef))
			.subscribe((result) => {
				if (result) {
					this._dialogRef.closeDialog();
					this._getInitActiveOperationList();
				}
			});

		toObservable(this._operations)
			.pipe(takeUntilDestroyed(this._destroyRef))
			.subscribe((operation) => {
				if (operation) {
					if (
						this._roleExecution()?.id === this._eRoleExecution.FINANCIER &&
						this._getActiveOperationListParams().IdOperationState === 19
					) {
						this._operationsFiltered.set(operation.data.filter((item) => item.idPayerOperationState === 17));
					} else {
						this._operationsFiltered.set(operation.data);
					}
				}
			});
	}

	private _getOrderStatuses(): void {
		this._apiGetOrderStatuses.getOrderStatuses({ accessToken: this._accessToken() });
	}

	private _getInitActiveOperationList(): void {
		this._getActiveOperationListParams.set({
			accessToken: this._accessToken(),
			accessModule: this._accessModule(),
			accessService: this._accessServices()?.GET_OPERATIONS_ACTIVE_SERVICE,
			IdOperationState: this._roleExecution()?.id === this._eRoleExecution.FINANCIER ? 13 : 17,
			RoleToFind: this._roleExecution()?.id,
			Page: 1,
			Size: 14,
		});

		this._apiGetActiveOperationList.getActiveOperationsList(this._getActiveOperationListParams());
	}

	protected _onClickUploadProofDisbursement(operation: TActiveOperation): void {
		this._operationSelected.set(operation.id);

		if (operation.idOperationState === EOrderStatus.PENDING_RESERVE_DISBURSEMENT) {
			this._dialogRef.openDialog({
				content: UploadProofReserveDisbursementModal,
				data: {
					fnGetOrderInvoiceList: this._getOrderInvoiceListForModal.bind(this),
					orderInvoices: this._apiGetOrderInvoiceList.response,
					isLoadingOrderInvoiceList: this._apiGetOrderInvoiceList.isLoading,

					fnUploadProofDisbursementReserveFinancier: this._postUploadProofDisbursementReserveFinancierFormModal.bind(this),
					isLoadingApiPostUploadProofDisbursementReserveFinancier: this._isLoadingApiPostUploadProofDisbursementReserveFinancier,
				},
				title: 'Subir comprobante',
			});
		} else {
		}
	}

	protected _getOrderInvoiceListForModal(): void {
		this._apiGetOrderInvoiceList.getOrderInvoiceList({
			accessToken: this._accessToken(),
			accessModule: this._accessModule(),
			accessService: this._accessServices()?.GET_OPERATION_DETAIL_SERVICE,
			idOperation: this._operationSelected(),
			idOperationDetailState: 14,
			Page: 1,
			Size: 14,
		});
	}

	protected _postUploadProofDisbursementReserveFinancierFormModal(params: {
		description: string;
		invoices: number[];
		proofDisbursement: string;
	}): void {
		this._apiPostUploadProofDisbursementReserveFinancier.UploadProofDisbursementReserveFinancier({
			accessToken: this._accessToken(),
			accessModule: this._accessModule(),
			accessService: this._accessServices()?.UPLOAD_PROOF_DISBURSEMENT_RESERVE_FINANCIER_SERVICE,
			idOperation: this._operationSelected(),
			description: params.description,
			idsOperationDetails: params.invoices,
			proofDisbursementBase64: params.proofDisbursement,
		});
	}

	protected _getActiveOperationListForPaginator(page: number): void {
		this._getActiveOperationListParams.set({
			...this._getActiveOperationListParams(),
			Page: page,
		});

		this._apiGetActiveOperationList.getActiveOperationsList(this._getActiveOperationListParams());
	}

	protected _getActiveOperationListForFilter(queryFilters: Partial<Omit<TApiGetActiveOperationsListQueryParams, 'Size'>>): void {
		this._getActiveOperationListParams.set({
			...this._getActiveOperationListParams(),
			...queryFilters,
		});

		this._apiGetActiveOperationList.getActiveOperationsList(this._getActiveOperationListParams());
	}
}
