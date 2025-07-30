import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { TActiveOperation } from '@dashboard/modules/operations-management/view-operations/api/get-active-operations-list';
import { OrderStatus } from '@shared/components/order-status/order-status';

@Component({
	selector: 'active-operations-details-provider-details',
	templateUrl: 'provider-details.html',
	imports: [CommonModule, OrderStatus],
})
export class ActiveOperationsDetailsProviderDetails {
	public readonly historyDetails = input(false);
	public readonly activeOperation = input<Nullable<TActiveOperation>>(null);
}
