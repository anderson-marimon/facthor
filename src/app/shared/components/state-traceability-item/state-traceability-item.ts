import { Component, input } from '@angular/core';
import { Calendar, Clock, LucideAngularModule } from 'lucide-angular';

@Component({
	selector: 'state-traceability-item',
	templateUrl: 'state-traceability-item.html',
	host: {
		class: 'flex gap-2.5',
	},
	imports: [LucideAngularModule],
})
export class StateTraceabilityItem {
	public readonly stateTraceability = input.required<any>();

	protected readonly _clockIcon = Clock;
	protected readonly _calendarIcon = Calendar;
}
