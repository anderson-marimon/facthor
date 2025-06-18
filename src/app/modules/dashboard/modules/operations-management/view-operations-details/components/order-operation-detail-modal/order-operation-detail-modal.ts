import { Component, input } from '@angular/core';
import { ActiveOperationsDetailsFinancierInvoiceDetails } from '@dashboard/modules/operations-management/view-operations-details/components/financier-invoice-details/financier-invoice-details';
import { ViewCard } from '@shared/components/view-card/view-card';

@Component({
	selector: 'active-operations-details-order-operation-detail-model',
	templateUrl: 'order-operation-detail-modal.html',
	imports: [ActiveOperationsDetailsFinancierInvoiceDetails, ViewCard],
})
export class ActiveOperationsDetailsOrderOperations {
	public readonly data = input<{ invoice: any }>();
}
