import { afterNextRender, afterRenderEffect, Component, computed, contentChild, DestroyRef, effect, inject, input, viewChild } from '@angular/core';
import { outputToObservable, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import type { FormControl } from '@angular/forms';
import { frs } from '@fresco-core/frs-core';
import { FrsComboboxOptions } from '@fresco-ui/frs-combobox/frs-combobox-options';
import { FrsComboboxTrigger, type TSizeVariants } from '@fresco-ui/frs-combobox/frs-combobox-trigger';
import { FrsPopoverModule } from '@fresco-ui/frs-popover';
import { FrsPopover } from '@fresco-ui/frs-popover/frs-popover';
import type { TPopoverPosition } from '@fresco-ui/frs-popover/frs-popover-content';
import { FrsPopoverTrigger } from '@fresco-ui/frs-popover/frs-popover-trigger';
import { fromEvent } from 'rxjs';

export type TComboboxOptions = { label: string; value: any };

@Component({
    selector: 'frs-combobox',
    standalone: true,
    imports: [FrsPopoverModule],
    host: {
        '[class]': '_frsClass()',
    },
    template: `
        <frs-popover [disabled]="disabled()">
            <frs-popover-trigger>
                <ng-content select="frs-combobox-trigger" />
            </frs-popover-trigger>
            <frs-popover-content [position]="position()">
                <ng-content select="frs-combobox-options" />
            </frs-popover-content>
        </frs-popover>
    `,
})
export class FrsCombobox {
    private readonly _destroyRef = inject(DestroyRef);
    private readonly _trigger = contentChild(FrsComboboxTrigger);
    private readonly _options = contentChild(FrsComboboxOptions);
    private readonly _popoverTrigger = viewChild(FrsPopoverTrigger);
    private readonly _popover = viewChild(FrsPopover);

    public readonly class = input('');
    public readonly position = input<TPopoverPosition>('bottom');
    public readonly size = input<TSizeVariants>('default');
    public readonly control = input<FormControl<TComboboxOptions[] | null>>();
    public readonly disabled = input(false);

    constructor() {
        this._syncInputs();

        afterNextRender(() => {
            this._syncTrigger();
            this._syncSearchInput();
            this._syncOptionsSelected();
        });

        afterRenderEffect(() => this._syncControl());
    }

    private _syncInputs(): void {
        effect(() => {
            this._trigger()?.setDisabled(this.disabled());
            this._trigger()?.setSize(this.size());
            this._options()?.setSize(this.size());

            const formControl = this.control();
            if (formControl) {
                formControl.valueChanges.pipe(takeUntilDestroyed(this._destroyRef)).subscribe(value => {
                    const options = this._options();
                    if (options) {
                        this._trigger()?.setSelectedOptions(value as TComboboxOptions[]);
                    }
                });
            }
        });
    }

    private _syncControl(): void {
        if (this.disabled()) {
            this.control()?.disable();
            return;
        }

        this.control()?.enable();
    }

    private _syncTrigger(): void {
        const options = this._options();
        const trigger = this._trigger();
        const popoverTrigger = this._popoverTrigger();

        if (!popoverTrigger || !options || !trigger) return;

        outputToObservable(popoverTrigger.triggerEvent)
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe(() => {
                options.focusInput();
                options.resetOptions();
                trigger.toggleState();
            });

        outputToObservable(trigger.emitTouched)
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe(() => {
                this.control()?.markAsTouched();
            });
    }

    private _syncSearchInput(): void {
        const input = this._options()?.input()?.nativeElement;
        if (input === undefined) return;

        fromEvent(input, 'input')
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe(() => {
                this._filterOptions(input.value);
                this._options()?.resetTabIndex();
            });
    }

    private _syncOptionsSelected(): void {
        const options = this._options();
        if (options === undefined) return;

        outputToObservable(options.selectedOptionsEmitter)
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe(selectedOptions => {
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

    private _filterOptions(value: string): void {
        const options = this._options();
        if (options === undefined) return;
        options.filterOptions(value);
    }

    public setHasError(value: boolean): void {
        this._trigger()?.setHasError(value);
    }

    protected readonly _frsClass = computed(() => frs('block relative text-sm', this.class()));
}
