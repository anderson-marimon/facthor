import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { Component, input, output } from '@angular/core';
import { TRadianEvent } from '@dashboard/modules/invoice-management/view-upload-invoice/api/get-invoice-list';
import { FrsButtonModule } from '@fresco-ui/frs-button';
import { EmptyResult } from '@shared/components/empty-result/empty-result';
import { RadianEventItem } from '@shared/components/radian-event-item/radian-event-item';

@Component({
	selector: 'view-upload-invoice-radian-events-drawer',
	templateUrl: 'radian-events-drawer.html',
	animations: [
		trigger('listAnimation', [
			transition('* => *', [
				query(':enter', style({ opacity: 0, transform: 'translateY(-5px)' }), {
					optional: true,
				}),
				query(':enter', stagger('100ms', animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))), { optional: true }),
				query(':leave', stagger('50ms', animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(-5px)' }))), { optional: true }),
			]),
		]),
	],
	imports: [EmptyResult, FrsButtonModule, RadianEventItem],
})
export class ViewUploadInvoiceRadianEventsDrawer {
	public readonly invoiceNumber = input('');
	public readonly radianEvents = input<TRadianEvent[]>([]);
	public readonly closeDrawerEmitter = output<void>();

	protected _onClickCloseDrawer(): void {
		this.closeDrawerEmitter.emit();
	}
}
