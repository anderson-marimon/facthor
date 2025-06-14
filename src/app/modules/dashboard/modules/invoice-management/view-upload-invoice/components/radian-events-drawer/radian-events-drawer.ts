import { trigger, transition, style, stagger, animate, query } from '@angular/animations';
import { Component, input, output } from '@angular/core';
import { TRadianEvent } from '@dashboard/modules/invoice-management/view-upload-invoice/api/get-invoice-list';
import { FrsButtonModule } from '@fresco-ui/frs-button';
import { Calendar, Clock, LucideAngularModule } from 'lucide-angular';

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
	imports: [FrsButtonModule, LucideAngularModule],
})
export class ViewUploadInvoiceRadianEventsDrawer {
	public readonly invoiceNumber = input('');
	public readonly radianEvents = input<TRadianEvent[]>([]);
	public readonly closeDrawerEmitter = output<void>();

	protected readonly _clockIcon = Clock;
	protected readonly _calendarIcon = Calendar;

	protected _onClickCloseDrawer(): void {
		this.closeDrawerEmitter.emit();
	}
}
