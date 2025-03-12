import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
	selector: 'form-step',
	host: {
		'class': 'group w-fit flex flex-col',
		'[attr.data-active]': "_active()"
	},
	templateUrl: 'form-step.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormStep {
	public readonly label = input('Label');
	public readonly active = input(true);
	protected readonly _active = computed(() => this.active());
}