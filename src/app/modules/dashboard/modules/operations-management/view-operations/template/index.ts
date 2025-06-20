import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { TIdentity, TRoleExecution } from '@dashboard/api/user-configuration';
import { EAccessInformation } from '@dashboard/common/enums/access-information';
import { ERoleExecution } from '@dashboard/common/enums/role-execution';
import { TAccessServices } from '@dashboard/common/enums/services';
import {
	ApiGetActiveOperationList,
	TApiGetActiveOperationsListQueryParams,
	TApiGetActiveOperationsListQuerySignalParams,
} from '@dashboard/modules/operations-management/view-operations/api/get-active-operations-list';
import { ViewActiveOperationsTableFilters } from '@dashboard/modules/operations-management/view-operations/components/table-filters/table-filters';
import { FrsButtonModule } from '@fresco-ui/frs-button';
import { EmptyResult } from '@shared/components/empty-result/empty-result';
import { GeneralLoader } from '@shared/components/general-loader/general-loader';
import { InheritTableFooter } from '@shared/components/inherit-table-footer/inherit-table-footer';
import { InheritTable } from '@shared/components/inherit-table/inherit-table';
import { OrderStatus } from '@shared/components/order-status/order-status';
import { Eye, FileX2, LucideAngularModule } from 'lucide-angular';

const HEADERS = ['n.orden', 'nit del emisor', 'emisor', 'receptor', 'estado', 'total a financiar', 'fecha de operación', 'detalles'];

@Component({
	selector: 'operations-management-view-operations',
	templateUrl: 'index.html',
	providers: [ApiGetActiveOperationList],
	imports: [
		CommonModule,
		EmptyResult,
		GeneralLoader,
		FrsButtonModule,
		InheritTable,
		InheritTableFooter,
		LucideAngularModule,
		OrderStatus,
		ViewActiveOperationsTableFilters,
	],
})
export default class OperationsManagementViewOperations {
	private readonly _destroyRef = inject(DestroyRef);
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
	protected readonly _operations = this._apiGetActiveOperationList.response;
	protected readonly _isLoadingApiGetInvoiceList = this._apiGetActiveOperationList.isLoading;
	protected readonly _eRoleExecution = ERoleExecution;
	protected readonly _roleExecution = signal<Nullable<TRoleExecution>>(null);
	protected readonly _identity = signal<Nullable<TIdentity>>(null);

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
