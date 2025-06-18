import { CommonModule } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { ApiGetOperationDetail, TInvoiceDetail } from '@dashboard/modules/operations-management/view-operations-details/api/get-operation-detail';
import { ActiveOperationsDetailsOrderOperations } from '@dashboard/modules/operations-management/view-operations-details/components/order-operation-detail-modal/order-operation-detail-modal';
import { FrsButtonModule } from '@fresco-ui/frs-button';
import { FrsDialogRef } from '@fresco-ui/frs-dialog/frs-service';
import { InheritTable } from '@shared/components/inherit-table/inherit-table';
import { InvoiceDetailStatus } from '@shared/components/invoice-detail-status/invoice-detail-status';
import { FacthorLogoAnimated } from '@shared/logos/facthor-logo-animated/facthor-logo-animated';
import { Eye, FileX2, LucideAngularModule } from 'lucide-angular';

const HEADERS = ['n.factura', 'legitimo retenedor', 'nit legitimo retenedor', 'estado', 'fecha de emisión', 'monto de factura', 'detalles'];

@Component({
	selector: 'active-operations-details-order-operations-table',
	templateUrl: 'order-operations-table.html',
	imports: [CommonModule, FacthorLogoAnimated, FrsButtonModule, InheritTable, LucideAngularModule, InvoiceDetailStatus],
})
export class ActiveOperationsDetailsOrderOperationsTable {
	private readonly _apiGetOperationDetail = inject(ApiGetOperationDetail);
	private readonly _dialogRef = inject(FrsDialogRef);

	protected readonly _eyeIcon = Eye;
	protected readonly _notResultIcon = FileX2;
	protected readonly _headers = HEADERS;
	protected readonly _operations = this._apiGetOperationDetail.response;
	protected readonly _isLoadingApiGetOperationDetail = this._apiGetOperationDetail.isLoading;

	protected _onClickViewOperationDetails(invoice: TInvoiceDetail): void {
		this._dialogRef.openDialog({
			title: 'Detalle de la operación',
			content: ActiveOperationsDetailsOrderOperations,
			data: {
				invoice,
			},
		});
	}
}
