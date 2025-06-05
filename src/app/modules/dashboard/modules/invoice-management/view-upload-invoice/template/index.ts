import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { TAccessServices } from '@dashboard/common/enums/enum-services';
import { ApiGetInvoiceStatuses } from '@dashboard/modules/invoice-management/view-upload-invoice/api/invoice-state';
import { ViewUploadInvoiceTableFilters } from '@dashboard/modules/invoice-management/view-upload-invoice/components/table-filters/table-filters';
import { InheritTable } from '@shared/components/inherit-table/inherit-table';

const HEADERS = ['n.factura', 'negociación', 'emisor', 'pagador', 'estado', 'expedición', 'vencimiento', 'valor', 'observación'];

@Component({
	selector: 'dashboard-invoice-management-view-upload-invoice',
	templateUrl: 'index.html',
	providers: [ApiGetInvoiceStatuses],
	imports: [InheritTable, ViewUploadInvoiceTableFilters],
})
export default class DashboardInvoiceManagementViewUploadInvoice {
	private readonly _destroyRef = inject(DestroyRef);
	private readonly _activateRoute = inject(ActivatedRoute);
	private readonly _apiGetInvoiceStatuses = inject(ApiGetInvoiceStatuses);
	private readonly _accessToken = signal('');
	private readonly _accessModule = signal('');
	private readonly _accessServices = signal<Nullable<TAccessServices>>(null);

	protected readonly _headers = HEADERS;

	constructor() {
		this._getAccessInformation();
		this._getInvoiceStatuses();
	}

	private _getAccessInformation(): void {
		this._activateRoute.data.pipe(takeUntilDestroyed(this._destroyRef)).subscribe((data) => {
			this._accessToken.set(data['accessToken']);
			this._accessModule.set(data['accessModule']);
			this._accessServices.set(data['accessServices']);
		});
	}

	protected _getInvoiceStatuses(): void {
		this._apiGetInvoiceStatuses.getInvoiceStatuses({ accessToken: this._accessToken() });
	}
}
