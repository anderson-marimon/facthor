import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { ERoleExecution } from '@dashboard/common/enums/role-execution';
import { TInvoiceDetail } from '@dashboard/modules/operations-management/view-operations-details/api/get-operation-detail';
import { InvoiceDetailStatus } from '@shared/components/invoice-detail-status/invoice-detail-status';

@Component({
	selector: 'active-operations-details-order-invoice-details',
	templateUrl: 'order-invoice-details.html',
	imports: [CommonModule, InvoiceDetailStatus],
})
export class ActiveOperationsDetailsOrderInvoiceDetails {
	public readonly activeInvoice = input<Nullable<TInvoiceDetail>>(null);
	public readonly roleExecution = input.required<number>();

	protected _eRoleExecution = ERoleExecution;
}
