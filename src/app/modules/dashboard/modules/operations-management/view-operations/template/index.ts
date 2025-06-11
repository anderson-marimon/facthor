import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { TAccessServices } from '@dashboard/common/enums/services';
import { TApiGetInvoiceListQueryParams } from '@dashboard/modules/invoice-management/view-upload-invoice/api/get-invoice-list';
import {
	ApiGetActiveOperationList,
	TApiGetActiveOperationsListQuerySignalParams,
} from '@dashboard/modules/operations-management/view-operations/api/get-active-operations-list';
import { FrsButtonModule } from '@fresco-ui/frs-button';
import { InheritTable } from '@shared/components/inherit-table/inherit-table';
import { FacthorLogoAnimated } from '@shared/logos/facthor-logo-animated/facthor-logo-animated';
import { Eye, LucideAngularModule } from 'lucide-angular';
import { OrderStatus } from '../components/order-status/order-status';

const HEADERS = ['n.orden', 'nit del emisor', 'emisor', 'receptor', 'estado', 'total a financiar', 'fecha de operación', 'detalles'];

@Component({
	selector: 'operation-management-view-operations',
	templateUrl: 'index.html',
	providers: [ApiGetActiveOperationList],
	imports: [CommonModule, FacthorLogoAnimated, FrsButtonModule, InheritTable, LucideAngularModule, OrderStatus],
})
export default class OperationManagementViewOperations {
	private readonly _destroyRef = inject(DestroyRef);
	private readonly _activateRoute = inject(ActivatedRoute);
	private readonly _apiGetActiveOperationList = inject(ApiGetActiveOperationList);
	private readonly _accessToken = signal('');
	private readonly _accessModule = signal('');
	private readonly _accessServices = signal<Nullable<TAccessServices>>(null);
	private readonly _getActiveOperationListParams = signal<Partial<TApiGetActiveOperationsListQuerySignalParams>>({});

	protected readonly _eyeIcon = Eye;
	protected readonly _headers = HEADERS;
	protected readonly _invoices = this._apiGetActiveOperationList.response;
	protected readonly _isLoadingApiGetInvoiceList = this._apiGetActiveOperationList.isLoading;

	constructor() {
		this._getAccessInformation();
		this._getInitActiveOperationList();
	}

	private _getAccessInformation(): void {
		this._activateRoute.data.pipe(takeUntilDestroyed(this._destroyRef)).subscribe((data) => {
			this._accessToken.set(data['accessToken']);
			this._accessModule.set(data['accessModule']);
			this._accessServices.set(data['accessServices']);
		});
	}

	private _getInitActiveOperationList(): void {
		this._getActiveOperationListParams.set({
			accessToken: this._accessToken(),
			accessService: this._accessServices()?.GET_OPERATIONS_ACTIVE_SERVICE,
			accessModule: this._accessModule(),
			Page: 1,
			Size: 14,
		});

		this._apiGetActiveOperationList.getActiveOperationsList(this._getActiveOperationListParams());
	}

	public getActiveOperationListForPaginator(page: number): void {
		this._apiGetActiveOperationList.getActiveOperationsList({
			...this._getActiveOperationListParams(),
			Page: page,
		});
	}

	public getActiveOperationListForFilter(queryFilters: Partial<Omit<TApiGetInvoiceListQueryParams, 'Size'>>): void {
		this._getActiveOperationListParams.set({
			...this._getActiveOperationListParams(),
			...queryFilters,
		});

		this._apiGetActiveOperationList.getActiveOperationsList(this._getActiveOperationListParams());
	}
}
