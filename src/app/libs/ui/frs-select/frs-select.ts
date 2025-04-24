import { Component, DestroyRef, afterNextRender, computed, contentChild, effect, inject, input, viewChild } from '@angular/core';
import { outputToObservable, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import type { FormControl } from '@angular/forms';
import { frs } from '@fresco-core/frs-core';
import { FrsPopoverModule } from '@fresco-ui/frs-popover';
import { FrsPopover } from '@fresco-ui/frs-popover/frs-popover';
import type { TPopoverPosition } from '@fresco-ui/frs-popover/frs-popover-content';
import { FrsPopoverTrigger } from '@fresco-ui/frs-popover/frs-popover-trigger';
import { FrsSelectOptions } from '@fresco-ui/frs-select/frs-select-options';
import { FrsSelectTrigger, type TSizeVariants } from '@fresco-ui/frs-select/frs-select-trigger';

export type TSelectOption = { label: string; value: any };

@Component({
	selector: 'frs-select',
	standalone: true,
	imports: [FrsPopoverModule],
	host: {
		'[class]': '_frsClass()',
	},
	template: `
		<frs-popover [disabled]="disabled()">
			<frs-popover-trigger>
				<ng-content select="frs-select-trigger" />
			</frs-popover-trigger>
			<frs-popover-content [position]="position()">
				<ng-content select="frs-select-options" />
			</frs-popover-content>
		</frs-popover>
	`,
})
export class FrsSelect {
	private readonly _destroyRef = inject(DestroyRef);
	private readonly _trigger = contentChild(FrsSelectTrigger);
	private readonly _options = contentChild(FrsSelectOptions);
	private readonly _popoverTrigger = viewChild(FrsPopoverTrigger);
	private readonly _popover = viewChild(FrsPopover);

	public readonly class = input('');
	public readonly position = input<TPopoverPosition>('bottom');
	public readonly size = input<TSizeVariants>('default');
	public readonly control = input<FormControl<TSelectOption[] | null>>();
	public readonly disabled = input(false);

	constructor() {
		this._syncInputs();
		this._syncControl();

		afterNextRender(() => {
			this._syncTrigger();
			this._syncOptionsSelected();
		});
	}

	private _syncInputs(): void {
		effect(() => {
			this._trigger()?.setDisabled(this.disabled());
			this._trigger()?.setSize(this.size());
			this._options()?.setSize(this.size());

			const formControl = this.control();
			if (formControl) {
				formControl.valueChanges.pipe(takeUntilDestroyed(this._destroyRef)).subscribe((value) => {
					const options = this._options();
					if (options) {
						this._trigger()?.setSelectedOptions(value as TSelectOption[]);
					}
				});
			}
		});
	}

	private _syncControl(): void {
		effect(() => {
			if (this.disabled()) {
				this.control()?.disable();
				return;
			}

			this.control()?.enable();
		});
	}

	private _syncTrigger(): void {
		const options = this._options();
		const trigger = this._trigger();
		const popoverTrigger = this._popoverTrigger();

		if (!popoverTrigger || !options || !trigger) return;

		outputToObservable(popoverTrigger.triggerEvent)
			.pipe(takeUntilDestroyed(this._destroyRef))
			.subscribe(() => {
				trigger.toggleState();
				this._options()?.resetTabIndex();
			});

		outputToObservable(trigger.emitTouched)
			.pipe(takeUntilDestroyed(this._destroyRef))
			.subscribe(() => {
				this.control()?.markAsTouched();
			});
	}

	private _syncOptionsSelected(): void {
		const options = this._options();
		if (options === undefined) return;

		outputToObservable(options.selectedOptionsEmitter)
			.pipe(takeUntilDestroyed(this._destroyRef))
			.subscribe((selectedOptions) => {
				this._trigger()?.setSelectedOptions(selectedOptions);

				const formControl = this.control();
				if (formControl) {
					formControl.setValue(selectedOptions);
				}

				if (options.selectLength() === options.getSelectedOptionsLength()) {
					this._popover()?.close();
				}
			});
	}

	public setHasError(value: boolean): void {
		this._trigger()?.setHasError(value);
	}

	protected readonly _frsClass = computed(() => frs('relative block text-sm', this.class()));
}
