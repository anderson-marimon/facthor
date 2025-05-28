import { Component, input } from '@angular/core';

@Component({
	selector: 'upload-invoice-view-card',
	templateUrl: 'view-card.html',
	host: {
		class: 'flex-1 flex flex-col border rounded-md',
	},
})
export class UploadInvoiceViewCard {
	public readonly title = input('title');
}
