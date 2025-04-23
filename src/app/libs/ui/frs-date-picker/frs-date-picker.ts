import { afterNextRender, Component, computed, DestroyRef, effect, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import type { FormControl } from '@angular/forms';
import { formatDateToISOShort, formatDateToMonthDayYear, frs } from '@fresco-core/frs-core';
import { FrsCalendarModule } from '@fresco-ui/frs-calendar';
import type { TCalendarDate, TCalendarRange } from '@fresco-ui/frs-calendar/frs-calendar';
import { FrsPopoverModule } from '@fresco-ui/frs-popover';
import { Calendar, LucideAngularModule } from 'lucide-angular';
import { timer } from 'rxjs';

@Component({
    selector: 'frs-date-picker',
    standalone: true,
    imports: [FrsCalendarModule, FrsPopoverModule, LucideAngularModule],
    host: {
        '[class]': '_frsClass()',
    },
    template: `
        <frs-popover class="w-fit" [disabled]="disabled()">
            <frs-popover-trigger>
                <p [tabindex]="0" [class]="_frsPClass()" (blur)="_touchedControl()">
                    <i-lucide [name]="calendarIcon()" [strokeWidth]="1" />
                    {{ _formatDate() || placeholder() }}
                </p>
            </frs-popover-trigger>
            <frs-popover-content [position]="position()" [class]="'w-fit min-w-fit'">
                <frs-calendar
                    [rangeMode]="rangeMode()"
                    [control]="control()"
                    [rangeControl]="rangeControl()"
                    [minDate]="minDate()"
                    [maxDate]="maxDate()"
                    (dateSelected)="_onSelectDate($event)"
                    (rangeSelected)="_onSelectRangeDate($event)"
                />
            </frs-popover-content>
        </frs-popover>
    `,
})
export class FrsDatePicker {
    private readonly _hasError = signal<boolean>(false);
    private readonly _destroyRef = inject(DestroyRef);

    public readonly formatType = input<'monthDayYear' | 'isoShort'>('monthDayYear');
    public readonly rangeMode = input(false);
    public readonly control = input<FormControl<TCalendarDate>>();
    public readonly rangeControl = input<FormControl<TCalendarRange>>();
    public readonly placeholder = input<string>('Select Date');
    public readonly minDate = input<TCalendarDate>(null);
    public readonly maxDate = input<TCalendarDate>(null);
    public readonly disabled = input(false);
    public readonly calendarIcon = input(Calendar);
    public readonly position = input<'top' | 'bottom' | 'left' | 'right'>('bottom');

    protected _pickedDate = signal<string>('');

    constructor() {
        effect(() => {
            const control = this.control();
            const rangeControl = this.rangeControl();
            const rangeMode = this.rangeMode();

            const value = rangeMode ? rangeControl?.value : control?.value;

            if (value) {
                this._formatInitialValue(value);
            } else {
                this._pickedDate.set('');
            }
        });

        afterNextRender(() => this._syncControl());
    }

    private _syncControl(): void {
        if (this.disabled()) {
            this.control()?.disable();
            return;
        }

        this.control()?.enable();
    }

    protected _formatInitialValue(value: any): void {
        if (!value) {
            this._pickedDate.set('');
            return;
        }

        try {
            if (this.rangeMode()) {
                if (value.start && value.end) {
                    const startDate = new Date(value.start);
                    const endDate = new Date(value.end);

                    if (!Number.isNaN(startDate.getTime()) && !Number.isNaN(endDate.getTime())) {
                        this._pickedDate.set(`${startDate.toISOString()} - ${endDate.toISOString()}`);
                        return;
                    }
                } else if (typeof value === 'string' && value.includes(' - ')) {
                    const [start, end] = value.split(' - ').map(s => s.trim());
                    const startDate = new Date(start);
                    const endDate = new Date(end);

                    if (!Number.isNaN(startDate.getTime()) && !Number.isNaN(endDate.getTime())) {
                        this._pickedDate.set(value);
                        return;
                    }
                }
            } else {
                const date = value instanceof Date ? value : new Date(value);
                if (!Number.isNaN(date.getTime())) {
                    this._pickedDate.set(date.toISOString());
                    return;
                }
            }
        } catch (e) {
            console.error('Error al formatear fecha:', e);
        }

        this._pickedDate.set('');
    }

    protected _formatDate = computed(() => {
        if (this._pickedDate() === '' || this._pickedDate() === 'undefined - undefined') {
            return null;
        }
        return this.formatType() === 'monthDayYear' ? this._formatDateOutput(this._pickedDate()) : this._formatDateOutput(this._pickedDate(), true);
    });

    private _formatDateOutput(dateString: string, isoFormat: boolean = false): string {
        if (this.rangeMode() && dateString.includes(' - ')) {
            const [start, end] = dateString.split(' - ');
            const startDate = new Date(start);
            const endDate = new Date(end);

            if (isoFormat) {
                return `${formatDateToISOShort(startDate)} - ${formatDateToISOShort(endDate)}`;
            }
            return `${formatDateToMonthDayYear(startDate)} - ${formatDateToMonthDayYear(endDate)}`;
        }
        const date = new Date(dateString);
        return isoFormat ? formatDateToISOShort(date) : formatDateToMonthDayYear(date);
    }

    public setHasError(value: boolean): void {
        this._hasError.set(value);
    }

    protected _onSelectDate(date: Date | null): void {
        this._pickedDate.set(date?.toISOString() || '');
        this._updateControlValue(date);
    }

    protected _onSelectRangeDate(range: TCalendarRange): void {
        this._pickedDate.set(`${range?.start.toISOString()} - ${range?.end.toISOString()}`);
        this._updateRangeControlValue(range);
    }

    private _updateControlValue(value: TCalendarDate): void {
        if (!this.control()) return;
        this.control()?.setValue(value);
    }
    private _updateRangeControlValue(value: TCalendarRange): void {
        if (!this.rangeControl()) return;
        this.rangeControl()?.setValue(value);
    }
    protected _touchedControl(): void {
        timer(0)
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe(() => {
                if (!this.control()?.touched) {
                    this.control()?.markAsTouched();
                }
            });
    }

    protected readonly _frsClass = computed(() => frs('block w-full [&_frs-popover]:w-full'));
    protected readonly _frsPClass = computed(() =>
        frs(
            `block w-full h-9 flex items-center rounded-md border bg-transparent px-3 py-1 text-nowrap 
			focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:ring-ring
			[&>i-lucide>svg]:size-4 [&>i-lucide>svg]:shrink-0 [&>i-lucide>svg]:mr-2 
			`,
            this._hasError() ? 'border-red-400 text-red-400 focus-visible:ring-red-400' : ''
        )
    );
}
