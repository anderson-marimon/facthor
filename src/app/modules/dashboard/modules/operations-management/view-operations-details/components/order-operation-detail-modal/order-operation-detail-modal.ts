import { Component, input } from '@angular/core';
import { ActiveOperationsDetailsOrderInvoiceDetails } from '@dashboard/modules/operations-management/view-operations-details/components/order-invoice-details/order-invoice-details';
import { ViewCard } from '@shared/components/view-card/view-card';

@Component({
	selector: 'active-operations-details-order-operation-detail-model',
	templateUrl: 'order-operation-detail-modal.html',
	imports: [ActiveOperationsDetailsOrderInvoiceDetails, ViewCard],
})
export class ActiveOperationsDetailsOrderOperations {
	public readonly data = input<{ invoice: any; roleExecution: number }>();
	public readonly closeDialog = input<() => void>();
}
