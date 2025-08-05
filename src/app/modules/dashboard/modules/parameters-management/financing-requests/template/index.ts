import { Component, inject, signal } from '@angular/core';
import { AccessViewInformation } from '@dashboard/common/extension/access-information-view';
import { CommonModule } from '@angular/common';
import { EmptyResult } from '@shared/components/empty-result/empty-result';
import { GeneralLoader } from '@shared/components/general-loader/general-loader';
import { InheritTable } from '@shared/components/inherit-table/inherit-table';
import { InheritTableFooter } from '@shared/components/inherit-table-footer/inherit-table-footer';
import { ERoleExecution } from '@dashboard/common/enums/role-execution';
import { FrsButtonModule } from '@fresco-ui/frs-button';
import { RouterLink } from '@angular/router';
import {
	TApiGetFinancierOperationsHistoryQueryParams,
	TApiGetFinancierOperationsHistoryQuerySignalParams,
} from '@dashboard/modules/operation-history-management/financier-history/api/get-financier-operations-history';
import { ApiGetFinancingRequests, TFinancingRequest } from '@dashboard/modules/parameters-management/financing-requests/api/get-financing-requests';
import { FinancingRequestTableFilters } from '@dashboard/modules/parameters-management/financing-requests/components/table-filters/table-filters';
import { ApiPostApproveFinancingRequest } from '@dashboard/modules/parameters-management/financing-requests/api/post-approve-financing-request';
import { ApiPostRejectFinancingRequest } from '@dashboard/modules/parameters-management/financing-requests/api/post-reject-financing-request';
import { FrsDialogRef } from '@fresco-ui/frs-dialog/frs-service';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { merge, tap } from 'rxjs';
import { FrsCheckbox } from '@fresco-ui/frs-checkbox/frs-checkbox';
import { LoadingIcon } from '@shared/icons/loading-icon/loading-icon';
import { animate, style, transition, trigger } from '@angular/animations';
import { FinancingRequestsAssignParameters } from '@dashboard/modules/parameters-management/financing-requests/components/assign-parameters-drawer/assign-parameters-drawer';
import { FormValidator } from '@dashboard/modules/parameters-management/financing-requests/services/form-validator';

const HEADERS = [
	'razón social',
	'tipo de documento',
	'n. documento',
	'nombre comercial',
	'correo electrónico',
	'estado',
	'representante legal',
	'fecha',
	'documentos',
];

@Component({
	selector: 'parameters-management-financing-requests',
	templateUrl: 'index.html',
	animations: [
		trigger('slideEffect', [
			transition(':enter', [
				style({ transform: 'translateY(100%)' }),
				animate('800ms cubic-bezier(0.25, 1, 0.5, 1)', style({ transform: 'translateY(0)' })),
			]),
			transition(':leave', [animate('800ms cubic-bezier(0.25, 1, 0.5, 1)', style({ transform: 'translateY(100%)' }))]),
		]),
	],
	providers: [ApiGetFinancingRequests, ApiPostApproveFinancingRequest, ApiPostRejectFinancingRequest],
	imports: [
		CommonModule,
		EmptyResult,
		FrsButtonModule,
		GeneralLoader,
		InheritTable,
		InheritTableFooter,
		RouterLink,
		FinancingRequestTableFilters,
		FrsCheckbox,
		LoadingIcon,
		FinancingRequestsAssignParameters,
	],
})
export default class ParametersManagementFinancingRequests extends AccessViewInformation {
	private readonly _dialogRef = inject(FrsDialogRef);
	private readonly _formBuilder = inject(FormBuilder);
	private readonly _formValidator = inject(FormValidator);
	private readonly _apiGetFinancingRequests = inject(ApiGetFinancingRequests);
	private readonly _apiPostApproveFinancingRequest = inject(ApiPostApproveFinancingRequest);
	private readonly _apiPostRejectFinancingRequest = inject(ApiPostRejectFinancingRequest);

	protected readonly _headers = HEADERS;
	protected readonly _eRoleExecution = ERoleExecution;
	protected readonly _allSelectControl = this._formBuilder.control(false);

	protected readonly _selectedRequestsId = signal<number[]>([]);
	protected readonly _selectedRequest = signal<Nullable<TFinancingRequest>>(null);
	protected readonly _getFinancingRequestsParams = signal<Partial<TApiGetFinancierOperationsHistoryQuerySignalParams>>({});

	protected readonly _financingRequests = this._apiGetFinancingRequests.response;
	protected readonly _isLoadingApiGetFinancingRequests = this._apiGetFinancingRequests.isLoading;

	protected readonly _approveFinancingRequestResult = this._apiPostApproveFinancingRequest.response;
	protected readonly _isLoadingApiPostApproveFinancingRequest = this._apiPostApproveFinancingRequest.isLoading;

	protected readonly _rejectFinancingRequestResult = this._apiPostRejectFinancingRequest.response;
	protected readonly _isLoadingApiPostRejectFinancingRequest = this._apiPostRejectFinancingRequest.isLoading;

	protected readonly _showPrepareParametersSection = signal(false);
	protected readonly _selectControls = signal<FormControl<boolean | null>[]>([]);

	protected readonly _minDaysFinancing = this._formBuilder.control('', [Validators.required]);
	protected readonly _maxDaysFinancing = this._formBuilder.control('', [Validators.required]);
	protected readonly _amountAssigned = this._formBuilder.control('', [Validators.required]);
	protected readonly _interestPercentage = this._formBuilder.control('', [Validators.required, this._formValidator.percentage()]);
	protected readonly _amountAssignedMonthUpdate = this._formBuilder.control('', [Validators.required]);
	protected readonly _operationPercentage = this._formBuilder.control('', [Validators.required, this._formValidator.percentage()]);

	protected readonly _parametersForms = this._formBuilder.group({
		minDaysFinancing: this._minDaysFinancing,
		maxDaysFinancing: this._maxDaysFinancing,
		amountAssigned: this._amountAssigned,
		interestPercentage: this._interestPercentage,
		amountAssignedMonthUpdate: this._amountAssignedMonthUpdate,
		operationPercentage: this._operationPercentage,
	});

	constructor() {
		super();
		this._addObservable();
		this._getInitFinancingRequests();
	}

	private _addObservable(): void {
		toObservable(this._financingRequests)
			.pipe(
				takeUntilDestroyed(this._destroyRef),
				tap((invoices) => {
					if (!invoices) {
						this._selectControls.set([]);
						return;
					}
					this._syncSelectControls(invoices.data);
				})
			)
			.subscribe();

		merge(toObservable(this._approveFinancingRequestResult), toObservable(this._rejectFinancingRequestResult))
			.pipe(takeUntilDestroyed(this._destroyRef))
			.subscribe((result) => {
				if (result) {
					this._dialogRef.closeDialog();
					this._getInitFinancingRequests();
					this._selectedRequestsId.set([]);
					this._selectedRequest.set(null);
					this._showPrepareParametersSection.set(false);
				}
			});
	}

	private _syncSelectControls(operations: any[]): void {
		const currentControls = this._selectControls();
		const currentValues = currentControls.map((control) => control.value);

		const newControls = operations.map((_, index) => {
			const previousValue = index < currentValues.length ? currentValues[index] : false;
			return this._formBuilder.control<boolean | null>(previousValue);
		});

		this._selectControls.set(newControls);
	}

	private _getInitFinancingRequests(): void {
		this._getFinancingRequestsParams.set({
			accessToken: this._accessToken(),
			accessModule: this._accessModule(),
			accessService: this._accessServices()?.GET_NEGOTIATION_PARAMETERS_SOLICITUDE,
			Page: 1,
			Size: 14,
		});

		this._apiGetFinancingRequests.getFinancingRequests(this._getFinancingRequestsParams());
	}

	private _postRejectFinancingRequest(): void {
		this._apiPostRejectFinancingRequest.postRejectFinancingRequest({
			accessToken: this._accessToken(),
			accessModule: this._accessModule(),
			accessService: this._accessServices()?.APROVE_OR_REJECT_NEGOTIATION_PARAMETERS_SOLICITUDE,
			idProvider: this._selectedRequest()?.idProvider || 0,
		});
	}

	private _postApproveFinancingRequest(): void {
		const {
			maxDaysFinancing = '0',
			minDaysFinancing = '0',
			amountAssignedMonthUpdate = '0',
			operationPercentage = '0',
			interestPercentage = '0',
			amountAssigned = '0',
		} = this._parametersForms.value;

		this._apiPostApproveFinancingRequest.postApproveFinancingRequest({
			accessToken: this._accessToken(),
			accessModule: this._accessModule(),
			accessService: this._accessServices()?.APROVE_OR_REJECT_NEGOTIATION_PARAMETERS_SOLICITUDE,
			idProvider: this._selectedRequest()?.idProvider || 0,
			paramsBusinessFinancier: {
				maxDaysFinancing: Number(maxDaysFinancing),
				minDaysFinancing: Number(minDaysFinancing),
				amountAsigned: Number(amountAssigned),
				amountAsignedMonthUpdate: Number(amountAssignedMonthUpdate),
				interestPercentage: Number(interestPercentage),
				operationPercentage: Number(operationPercentage),
			},
		});
	}

	protected _onClickApproveFinancingRequest(): void {
		if (this._isLoadingApiPostApproveFinancingRequest() || this._isLoadingApiPostRejectFinancingRequest()) {
			return;
		}

		this._dialogRef.openAlertDialog({
			title: '¿Estás seguro de realizar esta acción?',
			description: 'Esta acción confirma que estás de acuerdo con aprobación y asignación de parámetros para solicitud.',
			action: this._postApproveFinancingRequest.bind(this),
			actionButtonText: 'Aprobar',
			loading: this._isLoadingApiPostApproveFinancingRequest,
		});
	}

	protected _onClickRejectFinancingRequest(): void {
		if (this._isLoadingApiPostApproveFinancingRequest() || this._isLoadingApiPostRejectFinancingRequest()) return;

		this._dialogRef.openAlertDialog({
			title: '¿Está seguro de rechazar la solicitud?',
			description: 'Por favor, considere bien la decisión, una vez rechazada la solicitud, no puede ser revertida.',
			actionButtonText: 'Rechazar',
			action: this._postRejectFinancingRequest.bind(this),
			loading: this._isLoadingApiPostRejectFinancingRequest,
		});
	}

	protected _onClickToggleShowAssignParameters(): void {
		this._showPrepareParametersSection.set(!this._showPrepareParametersSection());
	}

	protected _onChangeSelectSingleRequest(index: number, _request: TFinancingRequest): void {
		const controls = this._selectControls();

		controls.forEach((control, i) => {
			if (i === index) {
				control.setValue(true);
				const request = this._financingRequests()?.data[index].idProvider;
				this._selectedRequestsId.set([request!]);
				this._selectedRequest.set(_request);
			} else {
				control.setValue(false);
			}
		});

		const isAllChecked = controls.every((control) => control.value);
		this._allSelectControl.setValue(isAllChecked);
	}

	protected _getFinancierOperationsHistoryForPaginator(page: number): void {
		this._getFinancingRequestsParams.set({
			...this._getFinancingRequestsParams(),
			Page: page,
		});

		this._apiGetFinancingRequests.getFinancingRequests(this._getFinancingRequestsParams());
	}

	protected _getFinancierOperationsHistoryForFilter(queryFilters: Partial<Omit<TApiGetFinancierOperationsHistoryQueryParams, 'Size'>>): void {
		this._getFinancingRequestsParams.set({
			...this._getFinancingRequestsParams(),
			...queryFilters,
		});

		this._apiGetFinancingRequests.getFinancingRequests(this._getFinancingRequestsParams());
	}
}