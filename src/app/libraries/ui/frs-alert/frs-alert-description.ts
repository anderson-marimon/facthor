import { Component, computed, input } from '@angular/core';
import { frs } from '@fresco-core/frs-core';

@Component({
	selector: 'frs-alert-description',
	standalone: true,
	host: {
		'[class]': '_frsClass()',
	},
	template: '<ng-content />',
})
export class FrsAlertDescription {
	public readonly class = input('');

	protected readonly _frsClass = computed(() => frs('block w-full text-sm pl-8 pr-3', this.class()));
}
