import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { EOrderStatus } from '@dashboard/common/enums/order-status';

@Component({
	selector: 'order-status',
	templateUrl: 'order-status.html',
	host: {
		'[class]': '"block w-full h-full pr-5"',
	},
	imports: [CommonModule],
})
export class OrderStatus {
	public readonly statusId = input(0);
	public readonly statusName = input('');

	protected _pendingStatuses = [
		EOrderStatus.PENDING_PROVIDER,
		EOrderStatus.PENDING_PAYER,
		EOrderStatus.PENDING_FINANCIER,
		EOrderStatus.PENDING_PROVIDER_CONFIRMATION,
		EOrderStatus.PENDING_FINANCIER_DISBURSEMENT,
		EOrderStatus.PENDING_PAYER_PAYMENT,
		EOrderStatus.PENDING_RESERVE_DISBURSEMENT,
	];

	protected _successStatuses = [
		EOrderStatus.APPROVED_PROVIDER,
		EOrderStatus.APPROVED_PAYER,
		EOrderStatus.APPROVED_FINANCIER,
		EOrderStatus.OPERATION_PAID,
		EOrderStatus.OPERATION_COMPLETED,
	];

	protected _externalStatuses = [EOrderStatus.RADIAN_EVENTS_PENDING];

	protected _continuingStatuses = [
		EOrderStatus.NEGOTIATION,
		EOrderStatus.RECEIVED_RESERVE_DISBURSEMENT,
		EOrderStatus.RECEIVED_PROVIDER_DISBURSEMENT,
		EOrderStatus.RADIAN_EVENTS_COMPLETED,
	];

	protected _rejectStatuses = [
		EOrderStatus.REJECTED_PROVIDER,
		EOrderStatus.REJECTED_PAYER,
		EOrderStatus.REJECTED_FINANCIER,
		EOrderStatus.NOT_RECEIVED_PROVIDER_DISBURSEMENT,
	];
}
