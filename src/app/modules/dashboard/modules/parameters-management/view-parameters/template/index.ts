import { CommonModule } from '@angular/common';
import { afterNextRender, Component, inject, signal } from '@angular/core';
import { ERoleExecution } from '@dashboard/common/enums/role-execution';
import { AccessViewInformation } from '@dashboard/common/extension/access-information-view';
import { FrsButtonModule } from '@fresco-ui/frs-button';
import { EmptyResult } from '@shared/components/empty-result/empty-result';
import { GeneralLoader } from '@shared/components/general-loader/general-loader';
import { InheritTableFooter } from '@shared/components/inherit-table-footer/inherit-table-footer';
import { InheritTable } from '@shared/components/inherit-table/inherit-table';
import {
	ApiGetNegotiationParameters,
	TApiGetNegotiationParametersQueryParams,
	TApiGetNegotiationParametersQuerySignalParams,
	TNegotiationParameter,
} from '@dashboard/modules/parameters-management/view-parameters/api/get-negotiation-parameters';
import { NegotiationParametersStatus } from '@shared/components/negotiation-parameters-status/negotiation-parameters-status';
import { NegotiationParametersTableFilters } from '@dashboard/modules/parameters-management/view-parameters/components/table-filters/table-filters';
import { CircleAlert, LucideAngularModule } from 'lucide-angular';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { FormValidator } from '@dashboard/modules/parameters-management/financing-requests/services/form-validator';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import { animate, style, transition, trigger } from '@angular/animations';
import { FrsCheckbox } from '@fresco-ui/frs-checkbox/frs-checkbox';
import { LoadingIcon } from '@shared/icons/loading-icon/loading-icon';
import { FinancingRequestsAssignParameters } from '@dashboard/modules/parameters-management/financing-requests/components/assign-parameters-drawer/assign-parameters-drawer';
import { ApiPostUpdateNegotiationParameters } from '@dashboard/modules/parameters-management/view-parameters/api/post-update-negotiation-paremeters';
import { FrsDialogRef } from '@fresco-ui/frs-dialog/frs-service';

const HEADERS = [
	'proveedor',
	'tasa de interés',
	'días mínimos',
	'días máximos',
	'interés mensual',
	'estado',
	'monto asignado',
	'monto balance',
	'fecha',
];

const HEADERS_PROVIDERS = ['financiador', 'tasa de interés', 'días mínimos', 'días máximos', 'interés mensual', 'monto asignado', 'monto balance'];

@Component({
	selector: 'parameters-management-view-parameters',
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
	providers: [ApiGetNegotiationParameters, ApiPostUpdateNegotiationParameters],
	imports: [
		CommonModule,
		EmptyResult,
		GeneralLoader,
		FrsButtonModule,
		InheritTable,
		InheritTableFooter,
		NegotiationParametersStatus,
		NegotiationParametersTableFilters,
		LucideAngularModule,
		FrsCheckbox,
		LoadingIcon,
		FinancingRequestsAssignParameters,
	],
})
export default class ParametersManagementViewParameters extends AccessViewInformation {
	private readonly _dialogRef = inject(FrsDialogRef);
	private readonly _apiGetNegotiationParameters = inject(ApiGetNegotiationParameters);
	private readonly _apiPostUpdateNegotiationParameters = inject(ApiPostUpdateNegotiationParameters);
	private readonly _formBuilder = inject(FormBuilder);
	private readonly _formValidator = inject(FormValidator);

	protected _headers: string[] = [];
	protected readonly _getNegotiationParameters = signal<Partial<TApiGetNegotiationParametersQuerySignalParams>>({});
	protected readonly _eRoleExecution = ERoleExecution;
	protected readonly _circleAlertIcon = CircleAlert;

	protected readonly _uploadAction = signal(false);
	protected readonly _selectedRequestsId = signal<number[]>([]);
	protected readonly _selectedRequest = signal<Nullable<TNegotiationParameter>>(null);
	protected readonly _currentParams = signal<any>(null);

	protected readonly _negotiationParameters = this._apiGetNegotiationParameters.response;
	protected readonly _isLoadingApiGetNegotiationParameters = this._apiGetNegotiationParameters.isLoading;

	protected readonly _updateNegotiationParametersResult = this._apiPostUpdateNegotiationParameters.response;
	protected readonly _isLoadingApiPostUpdateNegotiationParameters = this._apiPostUpdateNegotiationParameters.isLoading;

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
		this._getRouteData();
		this._getInitNegotiationParameters();

		afterNextRender(() => {
			if (this._roleExecution()?.id === this._eRoleExecution.FINANCIER) {
				this._headers = HEADERS;
			} else {
				this._headers = HEADERS_PROVIDERS;
			}
		});
	}

	private _addObservable(): void {
		toObservable(this._negotiationParameters)
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

		toObservable(this._updateNegotiationParametersResult)
			.pipe(takeUntilDestroyed(this._destroyRef))
			.subscribe((result) => {
				if (result) {
					this._dialogRef.closeDialog();
					this._getInitNegotiationParameters();
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

	private _fillForm(negotiationParameter: TNegotiationParameter): void {
		this._parametersForms.setValue({
			operationPercentage: negotiationParameter.operationPercentage.toString(),
			interestPercentage: negotiationParameter.interestPercentage.toString(),
			amountAssigned: negotiationParameter.amountAsigned.toString(),
			amountAssignedMonthUpdate: negotiationParameter.amountAsignedMonthUpdate.toString(),
			minDaysFinancing: negotiationParameter.minDaysFinancing.toString(),
			maxDaysFinancing: negotiationParameter.maxDaysFinancing.toString(),
		});

		this._currentParams.set(this._parametersForms.value);
	}

	private _getRouteData(): void {
		const confirmationAction = this._activateRoute.routeConfig?.data?.['updateAction'];
		this._uploadAction.set(confirmationAction || null);
	}

	private _getInitNegotiationParameters(): void {
		this._getNegotiationParameters.set({
			accessToken: this._accessToken(),
			accessModule: this._accessModule(),
			accessService: this._accessServices()?.GET_PARAMETER_NEGOTIATIONS,
			Page: 1,
			Size: 14,
			State: this._uploadAction(),
		});
		this._apiGetNegotiationParameters.getNegotiationParameters(this._getNegotiationParameters());
	}

	private _postUpdateNegotiationParameters(): void {
		const {
			maxDaysFinancing = '0',
			minDaysFinancing = '0',
			amountAssignedMonthUpdate = '0',
			operationPercentage = '0',
			interestPercentage = '0',
			amountAssigned = '0',
		} = this._parametersForms.value;

		this._apiPostUpdateNegotiationParameters.postUpdateNegotiationParameters({
			accessToken: this._accessToken(),
			accessModule: this._accessModule(),
			accessService: this._accessServices()?.UPDATE_NEGOTIATION_PARAMETERS,
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

	protected get _isAvailableUpdate(): boolean {
		const currentParameters = JSON.stringify(this._currentParams());
		const newParameters = JSON.stringify(this._parametersForms.value);

		return currentParameters === newParameters;
	}

	protected _onClickToggleShowAssignParameters(): void {
		this._showPrepareParametersSection.set(!this._showPrepareParametersSection());
	}

	protected _onClickUpdateNegotiationParameters(): void {
		if (this._isLoadingApiPostUpdateNegotiationParameters()) {
			return;
		}

		this._dialogRef.openAlertDialog({
			title: '¿Estás seguro de realizar esta acción?',
			description: 'Por favor, verificar bien la información ingresada antes de actualizar los parámetros del proveedor.',
			action: this._postUpdateNegotiationParameters.bind(this),
			actionButtonText: 'Actualizar',
			loading: this._isLoadingApiPostUpdateNegotiationParameters,
		});
	}

	protected _onChangeSelectSingleParameter(index: number, _parameters: TNegotiationParameter): void {
		const controls = this._selectControls();

		controls.forEach((control, i) => {
			if (i === index) {
				control.setValue(true);
				const parameters = this._negotiationParameters()?.data[index].idProvider;
				this._selectedRequestsId.set([parameters!]);
				this._selectedRequest.set(_parameters);
				this._fillForm(_parameters);
			} else {
				control.setValue(false);
			}
		});
	}

	protected _getNegotiationParametersForPaginator(page: number): void {
		this._getNegotiationParameters.set({
			...this._getNegotiationParameters(),
			Page: page,
		});

		this._apiGetNegotiationParameters.getNegotiationParameters(this._getNegotiationParameters());
	}

	protected _getNegotiationParametersForFilter(queryFilters: Partial<Omit<TApiGetNegotiationParametersQueryParams, 'Size'>>): void {
		this._getNegotiationParameters.set({
			...this._getNegotiationParameters(),
			...queryFilters,
		});

		this._apiGetNegotiationParameters.getNegotiationParameters(this._getNegotiationParameters());
	}
}
