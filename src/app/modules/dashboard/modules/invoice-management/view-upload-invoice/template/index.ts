import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { EAccessInformation } from '@dashboard/common/enums/access-information';
import { TAccessServices } from '@dashboard/common/enums/services';
import {
	ApiGetInvoiceList,
	TApiGetInvoiceListQueryParams,
	TApiGetInvoiceListQuerySignalParams,
	TInvoice,
	TRadianEvent,
} from '@dashboard/modules/invoice-management/view-upload-invoice/api/get-invoice-list';
import { ApiGetInvoiceStatuses } from '@dashboard/modules/invoice-management/view-upload-invoice/api/get-invoice-state';
import { ViewUploadInvoiceRadianEventsDrawer } from '@dashboard/modules/invoice-management/view-upload-invoice/components/radian-events-drawer/radian-events-drawer';
import { ViewUploadInvoiceTableFilters } from '@dashboard/modules/invoice-management/view-upload-invoice/components/table-filters/table-filters';
import { FrsButtonModule } from '@fresco-ui/frs-button';
import { EmptyResult } from '@shared/components/empty-result/empty-result';
import { GeneralLoader } from '@shared/components/general-loader/general-loader';
import { InheritTableFooter } from '@shared/components/inherit-table-footer/inherit-table-footer';
import { InheritTable } from '@shared/components/inherit-table/inherit-table';
import { InvoiceStatus } from '@shared/components/invoice-status/invoice-status';
import { Eye, FileX2, LucideAngularModule } from 'lucide-angular';

const HEADERS = ['n.factura', 'emisor', 'pagador', 'estado', 'expedición', 'vencimiento', 'valor', 'acciones'];

@Component({
	selector: 'dashboard-invoice-management-view-upload-invoice',
	templateUrl: 'index.html',
	animations: [
		trigger('slideEffect', [
			transition(':enter', [
				style({ transform: 'translateX(-100%)' }),
				animate('600ms cubic-bezier(0.25, 1, 0.5, 1)', style({ transform: 'translateX(0)' })),
			]),
			transition(':leave', [animate('600ms cubic-bezier(0.25, 1, 0.5, 1)', style({ transform: 'translateX(-100%)' }))]),
		]),
	],
	providers: [ApiGetInvoiceList, ApiGetInvoiceStatuses],
	imports: [
		CommonModule,
		EmptyResult,
		GeneralLoader,
		FrsButtonModule,
		InheritTable,
		InheritTableFooter,
		InvoiceStatus,
		LucideAngularModule,
		ViewUploadInvoiceTableFilters,
		ViewUploadInvoiceRadianEventsDrawer,
	],
})
export default class DashboardInvoiceManagementViewUploadInvoice {
	private readonly _destroyRef = inject(DestroyRef);
	private readonly _activateRoute = inject(ActivatedRoute);
	private readonly _apiGetInvoiceStatuses = inject(ApiGetInvoiceStatuses);
	private readonly _apiGetInvoiceList = inject(ApiGetInvoiceList);
	private readonly _accessToken = signal('');
	private readonly _accessModule = signal('');
	private readonly _accessServices = signal<Nullable<TAccessServices>>(null);
	private readonly _getInvoiceListParams = signal<Partial<TApiGetInvoiceListQuerySignalParams>>({});

	protected readonly _eyeIcon = Eye;
	protected readonly _notResultIcon = FileX2;
	protected readonly _headers = HEADERS;
	protected readonly _invoices = this._apiGetInvoiceList.response;
	protected readonly _isLoadingApiGetInvoiceList = this._apiGetInvoiceList.isLoading;
	protected readonly _radianEventsSelected = signal<TRadianEvent[]>([]);
	protected readonly _invoiceNumberSelected = signal('');

	constructor() {
		this._getAccessInformation();
		this._getInvoiceStatuses();
		this._getInitInvoiceList();
	}

	private _getAccessInformation(): void {
		this._activateRoute.data.pipe(takeUntilDestroyed(this._destroyRef)).subscribe((data) => {
			this._accessToken.set(data[EAccessInformation.TOKEN]);
			this._accessModule.set(data[EAccessInformation.MODULE]);
			this._accessServices.set(data[EAccessInformation.SERVICES]);
		});
	}

	private _getInvoiceStatuses(): void {
		this._apiGetInvoiceStatuses.getInvoiceStatuses({ accessToken: this._accessToken() });
	}

	private _getInitInvoiceList(): void {
		this._getInvoiceListParams.set({
			accessToken: this._accessToken(),
			accessService: this._accessServices()?.GET_UPLOAD_INVOICES_SERVICE,
			accessModule: this._accessModule(),
			SortByMostRecent: true,
			Page: 1,
			Size: 14,
		});

		this._apiGetInvoiceList.getInvoiceList(this._getInvoiceListParams());
	}

	protected _onClickSelectRadianEvents(column: TInvoice): void {
		if (column.radianEvents.length) {
			this._invoiceNumberSelected.set(column.invoiceNumber);
			this._radianEventsSelected.set([...column.radianEvents]);
		}
	}

	protected _onEmitCloseRadianEventsDrawer(): void {
		this._radianEventsSelected.set([]);
	}

	public getInvoiceListForPaginator(page: number): void {
		this._apiGetInvoiceList.getInvoiceList({
			...this._getInvoiceListParams(),
			Page: page,
		});
	}

	public getInvoiceListForFilter(queryFilters: Partial<Omit<TApiGetInvoiceListQueryParams, 'Size'>>): void {
		this._getInvoiceListParams.set({
			...this._getInvoiceListParams(),
			...queryFilters,
		});

		this._apiGetInvoiceList.getInvoiceList(this._getInvoiceListParams());
	}
}
