import { Component, computed, input, signal } from '@angular/core';
import { type FormControl, ReactiveFormsModule } from '@angular/forms';
import { frs } from '@fresco-core/frs-core';
import { CheckIcon } from '@shared/icons/check-icon/check-icon';

@Component({
	selector: 'sing-up-role-card',
	templateUrl: 'role-card.html',
	host: { class: 'block w-full h-auto' },
	imports: [ReactiveFormsModule, CheckIcon],
})
export class SignUpRoleCard {
	public readonly value = input('');
	public readonly title = input('Role title');
	public readonly description = input('Role description');
	public readonly control = input.required<FormControl<any>>();

	protected readonly _isSelect = signal(false);

	public setSelected(newState: boolean): void {
		this._isSelect.set(newState);
	}

	protected readonly _frsClass = computed(() =>
		frs(
			`relative group w-full h-full flex flex-col p-[2.5vh] border-[0.1vh] rounded hover:border-primary
			transition-colors cursor-pointer`,
			this._isSelect() ? 'border-primary' : 'border-border'
		)
	);
}
