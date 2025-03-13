import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
	selector: 'sign-up-step',
	host: {
		'class': 'group w-fit flex flex-col',
		'[attr.data-active]': '_active()'
	},
	templateUrl: 'sign-up-step.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignUpStep {
	public readonly label = input('Label');
	public readonly active = input(true);
	protected readonly _active = computed(() => this.active());
}
