import { CommonModule } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { ApiGetOrderInvoiceList, TOrderInvoice } from '@dashboard/modules/operations-management/view-operations-details/api/get-order-invoice-list';
import { ApiGetOrderInvoiceRadianEvents } from '@dashboard/modules/operations-management/view-operations-details/api/get-order-invoice-radian-events';
import { ApiGetOrderInvoiceStateTraceability } from '@dashboard/modules/operations-management/view-operations-details/api/get-order-invoice-state-traceability';
import { ActiveOperationsDetailsOrderOperations } from '@dashboard/modules/operations-management/view-operations-details/components/order-operation-detail-modal/order-operation-detail-modal';
import { FrsButtonModule } from '@fresco-ui/frs-button';
import { FrsDialogRef } from '@fresco-ui/frs-dialog/frs-service';
import { EmptyResult } from '@shared/components/empty-result/empty-result';
import { InheritTable } from '@shared/components/inherit-table/inherit-table';
import { InvoiceDetailStatus } from '@shared/components/invoice-detail-status/invoice-detail-status';
import { FacthorLogoAnimated } from '@shared/logos/facthor-logo-animated/facthor-logo-animated';
import { Eye, FileX2, LucideAngularModule } from 'lucide-angular';

const HEADERS = ['n.factura', 'legitimo retenedor', 'nit legitimo retenedor', 'estado', 'fecha de emisión', 'monto de factura', 'detalles'];

@Component({
	selector: 'active-operations-details-order-operations-table',
	templateUrl: 'order-operations-table.html',
	imports: [CommonModule, EmptyResult, FacthorLogoAnimated, FrsButtonModule, InheritTable, LucideAngularModule, InvoiceDetailStatus],
})
export class ActiveOperationsDetailsOrderOperationsTable {
	public readonly roleExecution = input.required<number>();
	public readonly fnGetOrderInvoiceRadianEvents = input.required<(orderInvoiceId: string) => void>();
	public readonly fnGetOrderInvoiceStateTraceability = input.required<(orderInvoiceId: string) => void>();

	private readonly _dialogRef = inject(FrsDialogRef);
	private readonly _apiGetOperationDetail = inject(ApiGetOrderInvoiceList);
	private readonly _apiGetOrderInvoiceRadianEvents = inject(ApiGetOrderInvoiceRadianEvents);
	private readonly _apiGetOrderInvoiceStateTraceability = inject(ApiGetOrderInvoiceStateTraceability);

	protected readonly _eyeIcon = Eye;
	protected readonly _notResultIcon = FileX2;
	protected readonly _headers = HEADERS;
	protected readonly _operations = this._apiGetOperationDetail.response;
	protected readonly _isLoadingApiGetOperationDetail = this._apiGetOperationDetail.isLoading;

	protected _onClickViewOperationDetails(invoice: TOrderInvoice): void {
		const fnGetRadianEvents = this.fnGetOrderInvoiceRadianEvents();
		const fnGetStateTraceability = this.fnGetOrderInvoiceStateTraceability();
		const orderInvoiceId = invoice.id.toString();

		this._dialogRef.openDialog({
			title: 'Detalle de la operación',
			content: ActiveOperationsDetailsOrderOperations,
			data: {
				invoice,
				roleExecution: this.roleExecution(),
				fnGetOrderInvoiceRadianEvents: () => fnGetRadianEvents(orderInvoiceId),
				orderInvoiceRadianEvents: this._apiGetOrderInvoiceRadianEvents.response,
				isLoadingOrderInvoiceRadianEvents: this._apiGetOrderInvoiceRadianEvents.isLoading,
				fnGetOrderInvoiceStateTraceability: () => fnGetStateTraceability(orderInvoiceId),
				orderInvoiceStateTraceability: this._apiGetOrderInvoiceStateTraceability.response,
				isLoadingOrderInvoiceStateTraceability: this._apiGetOrderInvoiceStateTraceability.isLoading,
			},
		});
	}
}
