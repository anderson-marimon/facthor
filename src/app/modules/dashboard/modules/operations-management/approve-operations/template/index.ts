import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TIdentity, TRoleExecution } from '@dashboard/api/user-configuration';
import { EAccessInformation } from '@dashboard/common/enums/access-information';
import { EOrderStatus } from '@dashboard/common/enums/order-status';
import { ERoleExecution } from '@dashboard/common/enums/role-execution';
import { TAccessServices } from '@dashboard/common/enums/services';
import { ApproveOperationsTableFilters } from '@dashboard/modules/operations-management/approve-operations/components/table-filters/table-filters';
import {
	ApiGetActiveOperationList,
	TApiGetActiveOperationsListQueryParams,
	TApiGetActiveOperationsListQuerySignalParams,
} from '@dashboard/modules/operations-management/view-operations/api/get-active-operations-list';
import { FrsButtonModule } from '@fresco-ui/frs-button';
import { FrsCheckboxModule } from '@fresco-ui/frs-checkbox';
import { FrsDialogRef } from '@fresco-ui/frs-dialog/frs-service';
import { EmptyResult } from '@shared/components/empty-result/empty-result';
import { GeneralLoader } from '@shared/components/general-loader/general-loader';
import { InheritTableFooter } from '@shared/components/inherit-table-footer/inherit-table-footer';
import { InheritTable } from '@shared/components/inherit-table/inherit-table';
import { OrderStatus } from '@shared/components/order-status/order-status';
import { Eye, FileX2, LucideAngularModule } from 'lucide-angular';
import { tap } from 'rxjs';

const HEADERS = ['n.orden', 'nit del emisor', 'emisor', 'receptor', 'estado', 'total a financiar', 'fecha de operación', 'detalles'];

@Component({
	selector: 'operations-management-approve-operations',
	templateUrl: 'index.html',
	providers: [ApiGetActiveOperationList],
	imports: [
		CommonModule,
		EmptyResult,
		GeneralLoader,
		FrsButtonModule,
		FrsCheckboxModule,
		InheritTable,
		InheritTableFooter,
		LucideAngularModule,
		OrderStatus,
		ApproveOperationsTableFilters,
	],
})
export default class OperationsManagementApproveOperations {
	private readonly _destroyRef = inject(DestroyRef);
	private readonly _frsDialogRef = inject(FrsDialogRef);
	private readonly _formBuilder = inject(FormBuilder);
	private readonly _router = inject(Router);
	private readonly _activateRoute = inject(ActivatedRoute);
	private readonly _apiGetActiveOperationList = inject(ApiGetActiveOperationList);
	private readonly _accessToken = signal('');
	private readonly _accessModule = signal('');
	private readonly _sessionKey = signal('');
	private readonly _accessServices = signal<Nullable<TAccessServices>>(null);
	private readonly _getActiveOperationListParams = signal<Partial<TApiGetActiveOperationsListQuerySignalParams>>({});

	protected readonly _eyeIcon = Eye;
	protected readonly _notResultIcon = FileX2;
	protected readonly _headers = HEADERS;
	protected readonly _activeOperations = this._apiGetActiveOperationList.response;
	protected readonly _isLoadingApiGetInvoiceList = this._apiGetActiveOperationList.isLoading;
	protected readonly _eRoleExecution = ERoleExecution;
	protected readonly _roleExecution = signal<Nullable<TRoleExecution>>(null);
	protected readonly _identity = signal<Nullable<TIdentity>>(null);

	protected readonly _allSelectControl = this._formBuilder.control(false);
	protected readonly _selectControls = signal<FormControl<boolean | null>[]>([]);

	constructor() {
		this._getAccessInformation();
		this._getInitActiveOperationList();
		this._watchActiveOperations();
	}

	private _getAccessInformation(): void {
		this._activateRoute.data.pipe(takeUntilDestroyed(this._destroyRef)).subscribe((data) => {
			this._accessToken.set(data[EAccessInformation.TOKEN]);
			this._accessModule.set(data[EAccessInformation.MODULE]);
			this._accessServices.set(data[EAccessInformation.SERVICES]);
			this._identity.set(data[EAccessInformation.IDENTITY]);
			this._roleExecution.set(data[EAccessInformation.ROLE_EXECUTION]);
			this._sessionKey.set(data[EAccessInformation.SESSION_KEY]);
		});
	}

	private _getInitActiveOperationList(): void {
		let idOperationState = EOrderStatus.APPROVED_FINANCIER;

		switch (this._roleExecution()?.id) {
			case ERoleExecution.PAYER:
				idOperationState = EOrderStatus.PENDING_PAYER;
				break;
			case ERoleExecution.FINANCIER:
				idOperationState = EOrderStatus.PENDING_FINANCIER;
				break;
			case ERoleExecution.PROVIDER:
				idOperationState = EOrderStatus.PENDING_PROVIDER;
				break;
		}

		this._getActiveOperationListParams.set({
			accessToken: this._accessToken(),
			accessModule: this._accessModule(),
			accessService: this._accessServices()?.GET_OPERATIONS_ACTIVE_SERVICE,
			RoleToFind: this._roleExecution()?.id,
			IdOperationState: idOperationState,
			Page: 1,
			Size: 14,
		});

		this._apiGetActiveOperationList.getActiveOperationsList(this._getActiveOperationListParams());
	}

	private _watchActiveOperations(): void {
		toObservable(this._activeOperations)
			.pipe(
				takeUntilDestroyed(this._destroyRef),
				tap((activeOperations) => {
					if (!activeOperations) {
						this._selectControls.set([]);
						return;
					}
					this._syncSelectControls(activeOperations.data);
				})
			)
			.subscribe();
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

	protected _getSelectedOperations(): any[] {
		const controls = this._selectControls();
		return (
			this._activeOperations()?.data.filter((_, index) => {
				return controls[index]?.value === true;
			}) || []
		);
	}

	// ==== Futura implementación ====
	// private _areAllSelected(): boolean {
	// 	const controls = this._selectControls();
	// 	return controls.length > 0 && controls.every((control) => control.value);
	// }

	protected _onChangeSelectSingleOperation(index: number): void {
		const controls = this._selectControls();

		controls.forEach((control, i) => {
			control.setValue(i === index);
		});

		const isAllChecked = controls.every((control) => control.value);
		this._allSelectControl.setValue(isAllChecked);
	}

	// ==== Futura implementación ====
	// protected _toggleAllSelection(): void {
	// 	const value = this._allSelectControl.value;
	// 	this._selectControls().forEach((control) => control.setValue(value));
	// }

	protected _onClickNavigateToOperationDetails(operation: number): void {
		this._router.navigate(['dashboard/operations-management/view-operations/details'], {
			queryParams: { operation, session: this._sessionKey() },
		});
	}

	protected _onClickApproveOperation(): void {
		if (!this._getSelectedOperations().length) return;

		this._frsDialogRef.openAlertDialog({
			title: 'Confirmar aprobación de la operación',
			description: '¿Estás seguro de realizar esta acción, una vez aprobada la operación no puede volver a su estado anterior.',
			action() {
				console.log('aceptar');
			},
			loading: signal(false),
		});

		this._frsDialogRef.closeDialog;
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
