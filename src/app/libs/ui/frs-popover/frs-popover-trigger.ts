import { Component, computed, input, output, signal } from '@angular/core';
import { frs } from '@fresco-core/frs-core';

@Component({
	selector: 'frs-popover-trigger',
	standalone: true,
	host: {
		'(click)': '_togglePopover($event)',
		'(keyup.enter)': '_togglePopover($event)',
		'(keyup.space)': '_togglePopover($event)',
		'[class]': '_frsClass()'
	},
	template: '<ng-content />'
})
export class FrsPopoverTrigger {
	public readonly class = input('');
	public readonly triggerType = input<'click' | 'hover'>('click');
	public readonly popoverOpen = output();
	public readonly triggerEvent = output();
	public readonly disabled = signal(false);

	public emitTriggerEvent(): void {
		this.triggerEvent.emit();
	}

	public setDisabled(disabled: boolean): void {
		this.disabled.set(disabled);
	}

	protected _togglePopover(event: Event): void {
		if (this.disabled()) return;

		event.preventDefault();
		this.popoverOpen.emit();
	}

	protected readonly _frsClass = computed(() => frs('block w-full h-fit', this.class()));
}
