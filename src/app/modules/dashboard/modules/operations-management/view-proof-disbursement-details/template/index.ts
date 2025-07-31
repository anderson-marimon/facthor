import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { ERoleExecution } from '@dashboard/common/enums/role-execution';
import { AccessViewInformation } from '@dashboard/common/extension/access-information-view';
import { ApiGetOrderStatuses } from '@dashboard/modules/operations-management/view-operations/api/get-order-statuses';
import {
	ApiGetProofDisbursementDetails,
	TApiGetProofDisbursementDetailsQuerySignalParams,
} from '@dashboard/modules/operations-management/view-proof-disbursement-details/api/get-proof-disbursement-details';
import { ApiGetProofDisbursementFile } from '@dashboard/modules/operations-management/view-proof-disbursement-details/api/get-proof-disbursement-file';
import { ApiPostConfirmProofDisbursement } from '@dashboard/modules/operations-management/view-proof-disbursement-details/api/post-confirm-proof-disbursement';
import { ModalProofDisbursementFile } from '@dashboard/modules/operations-management/view-proof-disbursement-details/components/modal-proof-disbursement-file/modal-proof-disbursement-file';
import { ViewProofDisbursementDetailsTableFilters } from '@dashboard/modules/operations-management/view-proof-disbursement-details/components/table-filters/table-filters';
import { FrsButtonModule } from '@fresco-ui/frs-button';
import { FrsDialogRef } from '@fresco-ui/frs-dialog/frs-service';
import { EmptyResult } from '@shared/components/empty-result/empty-result';
import { GeneralLoader } from '@shared/components/general-loader/general-loader';
import { InheritTableFooter } from '@shared/components/inherit-table-footer/inherit-table-footer';
import { InheritTable } from '@shared/components/inherit-table/inherit-table';
import { OrderStatus } from '@shared/components/order-status/order-status';
import { LucideAngularModule } from 'lucide-angular';
import { merge } from 'rxjs';
import { ApiPostRejectProofDisbursement } from '../api/post-reject-proof-disbursement';
import { LoadingIcon } from '@shared/icons/loading-icon/loading-icon';
import { EDisbursementStatus } from '@dashboard/common/enums/disbursement-status';

const HEADERS = ['tipo de desembolso', 'estado de desembolso', 'monto', 'descripción', 'documento'];

@Component({
	selector: 'operation-management-view-proof-disbursement-details',
	templateUrl: 'index.html',
	providers: [
		ApiGetProofDisbursementDetails,
		ApiGetOrderStatuses,
		ApiGetProofDisbursementFile,
		ApiPostConfirmProofDisbursement,
		ApiPostRejectProofDisbursement,
	],
	imports: [
		CommonModule,
		EmptyResult,
		FrsButtonModule,
		GeneralLoader,
		InheritTable,
		InheritTableFooter,
		LoadingIcon,
		LucideAngularModule,
		OrderStatus,
		ViewProofDisbursementDetailsTableFilters,
	],
})
export default class OperationManagementViewProofDisbursementDetails extends AccessViewInformation {
	private readonly _apiGetProofDisbursement = inject(ApiGetProofDisbursementDetails);
	private readonly _apiGetProofDisbursementFile = inject(ApiGetProofDisbursementFile);
	private readonly _apiPostConfirmProofDisbursement = inject(ApiPostConfirmProofDisbursement);
	private readonly _apiPostRejectProofDisbursement = inject(ApiPostRejectProofDisbursement);
	private readonly _apiGetOrderStatuses = inject(ApiGetOrderStatuses);
	private readonly _dialogRef = inject(FrsDialogRef);
	private readonly _operationId = signal('');
	private readonly _proofDisbursementSelected = signal(0);

	protected readonly _getProofDisbursementDetailsParams = signal<Partial<TApiGetProofDisbursementDetailsQuerySignalParams>>({});
	protected readonly _headers = HEADERS;
	protected readonly _eRoleExecution = ERoleExecution;
	protected readonly _eDisbursementStatus = EDisbursementStatus;
	protected readonly _confirmationAction = signal(false);
	protected readonly _currentTarget = signal<Nullable<number>>(null);

	protected readonly _isLoadingApiGetProofDisbursementDetails = this._apiGetProofDisbursement.isLoading;
	protected readonly _proofDisbursementDetails = this._apiGetProofDisbursement.response;

	protected readonly _isLoadingApiGetProofDisbursementFile = this._apiGetProofDisbursementFile.isLoading;
	protected readonly _proofDisbursementFile = this._apiGetProofDisbursementFile.response;

	protected readonly _isLoadingApiPostConfirmProofDisbursement = this._apiPostConfirmProofDisbursement.isLoading;
	protected readonly _confirmProofDisbursementResult = this._apiPostConfirmProofDisbursement.response;

	protected readonly _isLoadingApiPostRejectProofDisbursement = this._apiPostRejectProofDisbursement.isLoading;
	protected readonly _rejectProofDisbursementResult = this._apiPostRejectProofDisbursement.response;

	constructor() {
		super();
		this._addObservable();

		this._getRouteData();
		this._getQueryParams();
		this._getOrderStatuses();
		this._getInitProofDisbursementDetails();
	}

	private _getRouteData(): void {
		const confirmationAction = this._activateRoute.routeConfig?.data?.['confirmationAction'];
		this._confirmationAction.set(confirmationAction);
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
			...this._getProofDisbursementDetailsParams(),
			IdOperation: this._operationId(),
			Page: 1,
			Size: 14,
		});

		this._apiGetProofDisbursement.getProofDisbursementDetails(this._getProofDisbursementDetailsParams());
	}

	private _getOrderStatuses(): void {
		this._apiGetOrderStatuses.getOrderStatuses({ accessToken: this._accessToken() });
	}

	private _addObservable(): void {
		merge(toObservable(this._confirmProofDisbursementResult), toObservable(this._rejectProofDisbursementResult))
			.pipe(takeUntilDestroyed(this._destroyRef))
			.subscribe((result) => {
				if (result) {
					this._dialogRef.closeDialog();
					this._getInitProofDisbursementDetails();
				}
			});
	}

	private _isAvailableConfirmAction(proofDisbursementId: number): boolean {
		const proofDisbursement = this._proofDisbursementDetails()?.data.find((proof) => proof.id === proofDisbursementId);

		if (!proofDisbursement) return false;
		return proofDisbursement.idOperationDisbusementState === this._eDisbursementStatus.PENDING;
	}

	protected _getProofDisbursementFile(): void {
		this._apiGetProofDisbursementFile.getProofDisbursementFile({
			accessToken: this._accessToken(),
			accessModule: this._accessModule(),
			accessService: this._accessServices()?.VIEW_PROOF_DISBURSEMENT_SERVICE,
			IdOperationDisbursement: this._proofDisbursementSelected().toString(),
		});
	}

	protected _resetProofDisbursementFile(): void {
		this._apiGetProofDisbursementFile.reset();
	}

	protected _onClickViewPdf(proofDisbursementId: number): void {
		this._proofDisbursementSelected.set(proofDisbursementId);

		this._dialogRef.openDialog({
			title: 'Modal para visualizar pdf',
			content: ModalProofDisbursementFile,
			data: {
				fnGetProofDisbursementFile: this._getProofDisbursementFile.bind(this),
				fnResetFile: this._resetProofDisbursementFile.bind(this),
				file: this._proofDisbursementFile,
				isLoadingFile: this._isLoadingApiGetProofDisbursementFile,
			},
		});
	}

	protected _onClickConfirmProofDisbursement(operationDisbursementId: number): void {
		if (
			this._isLoadingApiPostConfirmProofDisbursement() ||
			this._isLoadingApiPostRejectProofDisbursement() ||
			!this._isAvailableConfirmAction(operationDisbursementId)
		)
			return;

		this._currentTarget.set(operationDisbursementId);
		const fnAction = () =>
			this._apiPostConfirmProofDisbursement.postConfirmProofDisbursement({
				accessToken: this._accessToken(),
				accessModule: this._accessModule(),
				accessService: this._accessServices()?.CONFIRM_PROOF_DISBURSEMENT_SERVICE,
				idOperationDisbursement: operationDisbursementId,
			});

		this._dialogRef.openAlertDialog({
			title: '¿Estás seguro de realizar esta acción?',
			description: 'Esta acción confirma que estás de acuerdo con la validación del comprobante.',
			action: fnAction.bind(this),
			loading: this._isLoadingApiPostConfirmProofDisbursement,
		});
	}
	protected _onClickRejectProofDisbursement(operationDisbursementId: number): void {
		if (
			this._isLoadingApiPostConfirmProofDisbursement() ||
			this._isLoadingApiPostRejectProofDisbursement() ||
			!this._isAvailableConfirmAction(operationDisbursementId)
		)
			return;

		this._currentTarget.set(operationDisbursementId);
		const fnAction = () =>
			this._apiPostRejectProofDisbursement.postRejectProofDisbursement({
				accessToken: this._accessToken(),
				accessModule: this._accessModule(),
				accessService: this._accessServices()?.CONFIRM_PROOF_DISBURSEMENT_SERVICE,
				idOperationDisbursement: operationDisbursementId,
			});

		this._dialogRef.openAlertDialog({
			title: '¿Estás seguro de realizar esta acción?',
			description: 'Esta acción confirma que estás de acuerdo con el rechazo del comprobante.',
			action: fnAction.bind(this),
			loading: this._isLoadingApiPostRejectProofDisbursement,
		});
	}

	protected _getProofDisbursementDetailsForPaginator(page: number): void {
		this._getProofDisbursementDetailsParams.set({
			...this._getProofDisbursementDetailsParams(),
			Page: page,
		});

		this._apiGetProofDisbursement.getProofDisbursementDetails(this._getProofDisbursementDetailsParams());
	}

	protected _getProofDisbursementDetailsForFilter(queryFilters: Partial<Omit<TApiGetProofDisbursementDetailsQuerySignalParams, 'Size'>>): void {
		this._getProofDisbursementDetailsParams.set({
			...this._getProofDisbursementDetailsParams(),
			...queryFilters,
		});

		this._apiGetProofDisbursement.getProofDisbursementDetails(this._getProofDisbursementDetailsParams());
	}
}
