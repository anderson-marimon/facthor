import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { TInvoiceDetail } from '@dashboard/modules/operations-management/view-operations-details/api/get-operation-detail';
import { InvoiceDetailStatus } from '@shared/components/invoice-detail-status/invoice-detail-status';

@Component({
	selector: 'active-operations-details-financier-invoice-details',
	templateUrl: 'financier-invoice-details.html',
	imports: [CommonModule, InvoiceDetailStatus],
})
export class ActiveOperationsDetailsFinancierInvoiceDetails {
	public readonly activeInvoice = input<Nullable<TInvoiceDetail>>(null);
}
