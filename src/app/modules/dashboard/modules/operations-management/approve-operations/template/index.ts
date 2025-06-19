import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, input, signal } from '@angular/core';
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

	protected readonly _selectControls = signal<FormControl[]>([]);

	constructor() {
		this._getAccessInformation();
		this._getInitActiveOperationList();
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
		this._getActiveOperationListParams.set({
			accessToken: this._accessToken(),
			accessModule: this._accessModule(),
			accessService: this._accessServices()?.GET_OPERATIONS_ACTIVE_SERVICE,
			RoleToFind: this._roleExecution()?.id,
			IdOperationState: EOrderStatus.PENDING_PROVIDER,
			Page: 1,
			Size: 14,
		});

		this._apiGetActiveOperationList.getActiveOperationsList(this._getActiveOperationListParams());
	}

	protected _onClickNavigateToOperationDetails(operation: number): void {
		this._router.navigate(['dashboard/operations-management/view-operations/details'], {
			queryParams: { operation, session: this._sessionKey() },
		});
	}

	public getActiveOperationListForPaginator(page: number): void {
		this._apiGetActiveOperationList.getActiveOperationsList({
			...this._getActiveOperationListParams(),
			Page: page,
		});
	}

	public getActiveOperationListForFilter(queryFilters: Partial<Omit<TApiGetActiveOperationsListQueryParams, 'Size'>>): void {
		this._getActiveOperationListParams.set({
			...this._getActiveOperationListParams(),
			...queryFilters,
		});

		this._apiGetActiveOperationList.getActiveOperationsList(this._getActiveOperationListParams());
	}
}
