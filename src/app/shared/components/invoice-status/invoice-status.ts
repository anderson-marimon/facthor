import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { EInvoiceStatus } from '@dashboard/common/enums/invoice-status';

@Component({
	selector: 'invoice-status',
	templateUrl: 'invoice-status.html',
	host: {
		'[class]': '"block w-full h-full pr-5"',
	},
	imports: [CommonModule],
})
export class InvoiceStatus {
	public readonly statusId = input(0);
	public readonly statusName = input('');

	protected _pendingStatuses = [EInvoiceStatus.VALIDATION_PENDING, EInvoiceStatus.ENABLEMENT_PENDING, EInvoiceStatus.IN_NEGOTIATION];

	protected _successStatuses = [EInvoiceStatus.ENABLED, EInvoiceStatus.DIAN_EVENTS_CREATED, EInvoiceStatus.SOLD];

	protected _externalStatuses = [EInvoiceStatus.RADIAN_NEGOTIATION_EVENTS_PENDING];

	protected _continuingStatuses = [EInvoiceStatus.RADIAN_NEGOTIATION_EVENTS_COMPLETED, EInvoiceStatus.NEGOTIATION_LIST];

	protected _rejectStatuses = [EInvoiceStatus.INCOMPLETE_DIAN_EVENTS, EInvoiceStatus.VALIDATION_FAILED, EInvoiceStatus.NOT_ENABLED];
}
