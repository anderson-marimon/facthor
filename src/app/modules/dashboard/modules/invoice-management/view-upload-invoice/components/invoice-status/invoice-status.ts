import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

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
}
