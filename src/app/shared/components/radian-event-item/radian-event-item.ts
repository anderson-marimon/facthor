import { Component, input } from '@angular/core';
import { Calendar, Clock, LucideAngularModule } from 'lucide-angular';

@Component({
	selector: 'radian-event-item',
	templateUrl: 'radian-event-item.html',
	host: {
		class: 'w-full h-fit flex gap-2.5',
	},
	imports: [LucideAngularModule],
})
export class RadianEventItem {
	public readonly radianEvent = input.required<any>();

	protected readonly _clockIcon = Clock;
	protected readonly _calendarIcon = Calendar;
}
