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
import UploadProofDisbursementModal from '@dashboard/modules/operations-management/upload-proof-disbursement/components/upload-proof-disbursement-modal/upload-proof-disbursement-modal';
import { ApiPostUploadProofDisbursementFinancier } from '@dashboard/modules/operations-management/upload-proof-disbursement/api/post-upload-proof-disbursement-financier';
import { merge } from 'rxjs';
import { ApiPostUploadProofDisbursementPayer } from '@dashboard/modules/operations-management/upload-proof-disbursement/api/post-upload-proof-disbursement-payer';
import { ApiGetBankAccount } from '@dashboard/modules/operations-management/upload-proof-disbursement/api/get-bank-account';
import { BankAccountModal } from '@dashboard/modules/operations-management/upload-proof-disbursement/components/bank-account-modal/bank-account-modal';

const HEADERS = ['n.orden', 'nit del emisor', 'emisor', 'receptor', 'estado', 'total a financiar', 'fecha de operación', 'detalles'];

@Component({
	selector: 'operations-management-upload-proof-disbursement',
	templateUrl: 'index.html',
	providers: [
		ApiGetActiveOperationList,
		ApiGetOrderStatuses,
		ApiPostApproveOperations,
		ApiGetOrderInvoiceList,
		ApiPostUploadProofDisbursementFinancier,
		ApiPostUploadProofDisbursementReserveFinancier,
		ApiPostUploadProofDisbursementPayer,
		ApiGetBankAccount,
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
	private readonly _apiPostUploadProofDisbursementFinancier = inject(ApiPostUploadProofDisbursementFinancier);
	private readonly _apiPostUploadProofDisbursementPayer = inject(ApiPostUploadProofDisbursementPayer);
	private readonly _apiGetBankAccount = inject(ApiGetBankAccount);
	private readonly _dialogRef = inject(FrsDialogRef);

	protected readonly _getActiveOperationListParams = signal<Partial<TApiGetActiveOperationsListQuerySignalParams>>({});
	protected readonly _headers = HEADERS;
	protected readonly _eRoleExecution = ERoleExecution;
	protected readonly _operationSelected = signal(0);
	protected readonly _operationsFiltered = signal<TActiveOperation[]>([]);

	protected readonly _operations = this._apiGetActiveOperationList.response;
	protected readonly _isLoadingApiGetInvoiceList = this._apiGetActiveOperationList.isLoading;

	protected readonly _uploadProofDisbursementReserveFinancierResult = this._apiPostUploadProofDisbursementReserveFinancier.response;
	protected readonly _isLoadingApiPostUploadProofDisbursementReserveFinancier = this._apiPostUploadProofDisbursementReserveFinancier.isLoading;

	protected readonly _uploadProofDisbursementFinancierResult = this._apiPostUploadProofDisbursementFinancier.response;
	protected readonly _isLoadingApiPostUploadProofDisbursementFinancier = this._apiPostUploadProofDisbursementFinancier.isLoading;

	protected readonly _uploadProofDisbursementPayerResult = this._apiPostUploadProofDisbursementPayer.response;
	protected readonly _isLoadingApiPostUploadProofDisbursementPayer = this._apiPostUploadProofDisbursementPayer.isLoading;

	protected readonly _bankAccount = this._apiGetBankAccount.response;
	protected readonly _isLoadingApiGetBankAccount = this._apiGetBankAccount.isLoading;

	constructor() {
		super();
		this._addObservables();
		this._getOrderStatuses();
		this._getInitActiveOperationList();
	}

	private _addObservables(): void {
		merge(
			toObservable(this._uploadProofDisbursementReserveFinancierResult),
			toObservable(this._uploadProofDisbursementFinancierResult),
			toObservable(this._uploadProofDisbursementPayerResult)
		)
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

		if (this._roleExecution()?.id === this._eRoleExecution.FINANCIER) {
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
				this._dialogRef.openDialog({
					content: UploadProofDisbursementModal,
					data: {
						fnUploadProofDisbursementFinancier: this._postUploadProofDisbursementFinancierFormModal.bind(this),
						isLoadingApiPostUploadProofDisbursementFinancier: this._isLoadingApiPostUploadProofDisbursementFinancier,
					},
					title: 'Subir comprobante',
				});
			}
		} else {
			this._dialogRef.openDialog({
				content: UploadProofReserveDisbursementModal,
				data: {
					fnGetOrderInvoiceList: this._getOrderInvoiceListForModal.bind(this),
					orderInvoices: this._apiGetOrderInvoiceList.response,
					isLoadingOrderInvoiceList: this._apiGetOrderInvoiceList.isLoading,

					fnUploadProofDisbursementReserveFinancier: this._postUploadProofDisbursementPayerFormModal.bind(this),
					isLoadingApiPostUploadProofDisbursementReserveFinancier: this._isLoadingApiPostUploadProofDisbursementPayer,
				},
				title: 'Subir comprobante',
			});
		}
	}

	protected _onClickViewBankAccount(operation: TActiveOperation): void {
		this._operationSelected.set(operation.id);

		this._dialogRef.openDialog({
			content: BankAccountModal,
			data: {
				fnGetBankAccount: this._getBankAccount.bind(this),
				isLoadingApiGetBankAccount: this._isLoadingApiGetBankAccount,
				bankAccount: this._bankAccount,
			},
			title: 'Subir comprobante',
		});
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

	protected _postUploadProofDisbursementFinancierFormModal(params: { description: string; proofDisbursement: string }): void {
		this._apiPostUploadProofDisbursementFinancier.UploadProofDisbursementFinancier({
			accessToken: this._accessToken(),
			accessModule: this._accessModule(),
			accessService: this._accessServices()?.UPLOAD_PROOF_DISBURSEMENT_FINANCIER_SERVICE,
			idOperation: this._operationSelected(),
			description: params.description,
			proofDisbursementBase64: params.proofDisbursement,
		});
	}

	protected _postUploadProofDisbursementPayerFormModal(params: { description: string; invoices: number[]; proofDisbursement: string }): void {
		this._apiPostUploadProofDisbursementPayer.UploadProofDisbursementPayer({
			accessToken: this._accessToken(),
			accessModule: this._accessModule(),
			accessService: this._accessServices()?.UPLOAD_PROOF_DISBURSEMENT_PAYER_SERVICE,
			idOperation: this._operationSelected(),
			description: params.description,
			idsOperationDetails: params.invoices,
			proofDisbursementBase64: params.proofDisbursement,
		});
	}

	protected _getBankAccount(): void {
		this._apiGetBankAccount.GetBankAccount({
			accessToken: this._accessToken(),
			accessModule: this._accessModule(),
			accessService: this._accessServices()?.GET_BUSINESS_BANK_ACCOUNT,
			idOperation: this._operationSelected(),
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
