import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ApiGetOperationDetail } from '@dashboard/modules/operations-management/view-operations-details/api/get-operation-detail';
import { FrsButtonModule } from '@fresco-ui/frs-button';
import { InheritTable } from '@shared/components/inherit-table/inherit-table';
import { InvoiceDetailStatus } from '@shared/components/invoice-detail-status/invoice-detail-status';
import { FacthorLogoAnimated } from '@shared/logos/facthor-logo-animated/facthor-logo-animated';
import { Eye, FileX2, LucideAngularModule } from 'lucide-angular';

const HEADERS = ['n.factura', 'legitimo retenedor', 'nit legitimo retenedor', 'estado', 'fecha de emisión', 'monto de factura', 'acciones'];

@Component({
	selector: 'active-operations-order-operations-table',
	templateUrl: 'order-operations-table.html',
	imports: [CommonModule, FacthorLogoAnimated, FrsButtonModule, InheritTable, LucideAngularModule, InvoiceDetailStatus],
})
export class ActiveOperationsOrderOperationsTable {
	private readonly _apiGetOperationDetail = inject(ApiGetOperationDetail);

	protected readonly _eyeIcon = Eye;
	protected readonly _notResultIcon = FileX2;
	protected readonly _headers = HEADERS;
	protected readonly _operations = this._apiGetOperationDetail.response;
	protected readonly _isLoadingApiGetOperationDetail = this._apiGetOperationDetail.isLoading;

	protected _onClickSelectRadianEvents(): void {}
}
