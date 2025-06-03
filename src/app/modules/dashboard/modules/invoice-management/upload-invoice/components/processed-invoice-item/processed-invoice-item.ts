import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, input, signal } from '@angular/core';
import { TZipProcessedFiles } from '@dashboard/modules/invoice-management/upload-invoice/api/extract-invoice-data';
import { ChevronDown, LucideAngularModule } from 'lucide-angular';

@Component({
	selector: 'upload-invoice-processed-invoice-item',
	templateUrl: 'processed-invoice-item.html',
	animations: [
		trigger('showErrors', [
			transition(':enter', [style({ height: '0', overflow: 'hidden' }), animate('300ms ease-out', style({ height: '*', overflow: 'hidden' }))]),
			transition(':leave', [style({ overflow: 'hidden' }), animate('300ms ease-out', style({ height: '0', overflow: 'hidden' }))]),
		]),
	],
	imports: [CommonModule, LucideAngularModule],
})
export class UploadInvoicesProcessedInvoiceItem {
	public readonly fileName = input('');
	public readonly fileErrors = input<string[]>([]);
	public readonly fileDetails = input<Nullable<TZipProcessedFiles>>(null);

	protected readonly icon = input(ChevronDown);
	protected readonly _openErrors = signal(true);

	protected _onClickOpenErrors(): void {
		this._openErrors.update((value) => !value);
	}
}
