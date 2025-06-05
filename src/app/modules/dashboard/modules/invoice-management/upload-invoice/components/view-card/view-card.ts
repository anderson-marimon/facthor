import { Component, computed, input } from '@angular/core';
import { frs } from '@fresco-core/frs-core';

@Component({
	selector: 'upload-invoice-view-card',
	templateUrl: 'view-card.html',
	host: {
		'[class]': '_frsClass()',
	},
})
export class UploadInvoiceViewCard {
	public readonly title = input('title');
	public readonly class = input('');

	protected readonly _frsClass = computed(() => frs('flex flex-col border rounded-md', this.class()));
}
