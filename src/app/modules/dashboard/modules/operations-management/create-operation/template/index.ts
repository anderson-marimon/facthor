import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { EAccessInformation } from '@dashboard/common/enums/access-information';
import { TAccessServices } from '@dashboard/common/enums/services';
import {
	ApiGetFormalizedInvoiceList,
	TApiGetFormalizedInvoiceListQueryParams,
	TApiGetFormalizedInvoiceListQuerySignalParams,
} from '@dashboard/modules/operations-management/create-operation/api/get-formalized-invoices';
import { CreateOperationTableFilters } from '@dashboard/modules/operations-management/create-operation/components/table-filters/table-filters';
import { FrsButtonModule } from '@fresco-ui/frs-button';
import { EmptyResult } from '@shared/components/empty-result/empty-result';
import { GeneralLoader } from '@shared/components/general-loader/general-loader';
import { InheritTableFooter } from '@shared/components/inherit-table-footer/inherit-table-footer';
import { InheritTable } from '@shared/components/inherit-table/inherit-table';
import { InvoiceStatus } from '@shared/components/invoice-status/invoice-status';
import { Eye, FileX2, LucideAngularModule } from 'lucide-angular';

const HEADERS = ['n.factura', 'nit del emisor', 'emisor', 'receptor', 'estado', 'expedition', 'vencimiento', 'detalles'];

@Component({
	selector: 'operations-management-create-operation',
	templateUrl: 'index.html',
	providers: [ApiGetFormalizedInvoiceList],
	imports: [
		CreateOperationTableFilters,
		CommonModule,
		EmptyResult,
		FrsButtonModule,
		GeneralLoader,
		InheritTable,
		InheritTableFooter,
		InvoiceStatus,
		LucideAngularModule,
	],
})
export default class OperationsManagementCreateOperation {
	private readonly _destroyRef = inject(DestroyRef);
	private readonly _activateRoute = inject(ActivatedRoute);
	private readonly _apiGetFormalizedInvoiceList = inject(ApiGetFormalizedInvoiceList);

	private readonly _getFormalizedInvoiceListParams = signal<Partial<TApiGetFormalizedInvoiceListQuerySignalParams>>({});

	private readonly _accessToken = signal('');
	private readonly _accessModule = signal('');
	private readonly _accessServices = signal<Nullable<TAccessServices>>(null);

	protected readonly _eyeIcon = Eye;
	protected readonly _notResultIcon = FileX2;
	protected readonly _headers = HEADERS;

	protected readonly _invoices = this._apiGetFormalizedInvoiceList.response;
	protected readonly _isLoadingApiGetFormalizedInvoiceList = this._apiGetFormalizedInvoiceList.isLoading;

	constructor() {
		this._getAccessInformation();
		this._getInitFormalizedInvoiceList();
	}

	private _getAccessInformation(): void {
		this._activateRoute.data.pipe(takeUntilDestroyed(this._destroyRef)).subscribe((data) => {
			this._accessToken.set(data[EAccessInformation.TOKEN]);
			this._accessModule.set(data[EAccessInformation.MODULE]);
			this._accessServices.set(data[EAccessInformation.SERVICES]);
		});
	}

	private _getInitFormalizedInvoiceList(): void {
		this._getFormalizedInvoiceListParams.set({
			accessToken: this._accessToken(),
			accessModule: this._accessModule(),
			accessService: this._accessServices()?.GET_FORMALIZED_INVOICES_SERVICE,
			Page: 1,
			Size: 14,
		});

		this._apiGetFormalizedInvoiceList.getFormalizedInvoiceList(this._getFormalizedInvoiceListParams());
	}

	protected _getFormalizedInvoiceListForPaginator(page: number): void {
		this._apiGetFormalizedInvoiceList.getFormalizedInvoiceList({
			...this._getFormalizedInvoiceListParams(),
			Page: page,
		});
	}

	protected _getFormalizedInvoiceListForFilter(queryFilters: Partial<Omit<TApiGetFormalizedInvoiceListQueryParams, 'Size'>>): void {
		this._getFormalizedInvoiceListParams.set({
			...this._getFormalizedInvoiceListParams(),
			...queryFilters,
		});

		this._apiGetFormalizedInvoiceList.getFormalizedInvoiceList(this._getFormalizedInvoiceListParams());
	}
}
