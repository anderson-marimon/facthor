import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { EInvoiceDetailStatus } from '@dashboard/common/enums/invoice-detail-status';

@Component({
	selector: 'invoice-detail-status',
	templateUrl: 'invoice-detail-status.html',
	host: {
		'[class]': '"block w-full h-full pr-5"',
	},
	imports: [CommonModule],
})
export class InvoiceDetailStatus {
	public readonly statusId = input(0);
	public readonly statusName = input('');

	protected _pendingStatuses = [
		EInvoiceDetailStatus.PENDING_SUPPLIER_ACCEPTANCE,
		EInvoiceDetailStatus.PENDING_FINANCIER_ACCEPTANCE,
		EInvoiceDetailStatus.PENDING_PAYER_ACCEPTANCE,
		EInvoiceDetailStatus.PENDING_PAYMENT_CONFIRMATION,
		EInvoiceDetailStatus.PENDING_RESERVE_RETURN,
		EInvoiceDetailStatus.PENDING_RESERVE_CONFIRMATION,
		EInvoiceDetailStatus.PAYMENT_PENDING,
	];

	protected _successStatuses = [EInvoiceDetailStatus.PAID, EInvoiceDetailStatus.RESERVE_RETURNED];

	protected _rejectStatuses = [
		EInvoiceDetailStatus.REJECTED_BY_SUPPLIER,
		EInvoiceDetailStatus.REJECTED_BY_FINANCIER,
		EInvoiceDetailStatus.REJECTED_BY_PAYER,
		EInvoiceDetailStatus.PAYMENT_NOT_RECEIVED,
		EInvoiceDetailStatus.RESERVE_NOT_RETURNED,
	];

	protected _continuingStatuses = [
		EInvoiceDetailStatus.ACCEPTED_BY_SUPPLIER,
		EInvoiceDetailStatus.ACCEPTED_BY_FINANCIER,
		EInvoiceDetailStatus.ACCEPTED_BY_PAYER,
	];
}
