import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
	selector: 'sign-up-role-step',
	host: {
		class: 'group w-fit flex flex-col',
		'[attr.data-active]': '_active()',
	},
	templateUrl: 'role-step.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignUpRoleStep {
	public readonly label = input('Label');
	public readonly active = input(true);
	protected readonly _active = computed(() => this.active());
}
