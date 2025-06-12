import { afterNextRender, Component, computed, DestroyRef, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import type { FormControl } from '@angular/forms';
import { formatDateToISOShort, formatDateToMonthDayYear, frs } from '@fresco-core/frs-core';
import { FrsCalendarModule } from '@fresco-ui/frs-calendar';
import type { TCalendarDate, TCalendarRange } from '@fresco-ui/frs-calendar/frs-calendar';
import { FrsPopoverModule } from '@fresco-ui/frs-popover';
import { Calendar, LucideAngularModule } from 'lucide-angular';
import { timer } from 'rxjs';
import { filter } from 'rxjs/operators';

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
					{{ _shouldShowPlaceholder() ? placeholder() : _formatDate() }}
				</p>
			</frs-popover-trigger>
			<frs-popover-content [position]="position()" [class]="'w-fit min-w-fit'">
				<frs-calendar
					[class]="calendarClass()"
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
	private readonly _updating = signal<boolean>(false);
	private readonly _initialized = signal<boolean>(false);

	protected readonly _pickedDate = signal<string | null>(null);

	public readonly formatType = input<'monthDayYear' | 'isoShort'>('monthDayYear');
	public readonly rangeMode = input(false);
	public readonly control = input<FormControl<TCalendarDate>>();
	public readonly rangeControl = input<FormControl<TCalendarRange>>();
	public readonly placeholder = input<string>('Select Date');
	public readonly minDate = input<TCalendarDate>(null);
	public readonly maxDate = input<TCalendarDate>(null);
	public readonly disabled = input(false);
	public readonly calendarIcon = input(Calendar);
	public readonly calendarClass = input('');
	public readonly position = input<'top' | 'bottom' | 'left' | 'right'>('bottom');

	constructor() {
		afterNextRender(() => {
			this._syncControl();
			this._initialized.set(true);
		});
	}

	private _syncControl(): void {
		const rangeMode = this.rangeMode();
		const control = rangeMode ? this.rangeControl() : this.control();
		if (!control) return;

		this.disabled() ? control.disable() : control.enable();

		if (rangeMode) {
			(control as FormControl).valueChanges
				.pipe(
					takeUntilDestroyed(this._destroyRef),
					filter(() => !this._updating()),
					filter((value) => this._isValidRange(value))
				)
				.subscribe((value: TCalendarRange) => {
					this._formatValue(value);
				});
		} else {
			(control as FormControl).valueChanges
				.pipe(
					takeUntilDestroyed(this._destroyRef),
					filter(() => !this._updating()),
					filter((value) => this._isValidDate(value))
				)
				.subscribe((value: Date) => {
					this._formatValue(value);
				});
		}

		if (control.value) {
			this._formatValue(control.value);
		}
	}

	private _isValidDate(value: any): boolean {
		if (value === null || value === undefined) return true;
		const date = value instanceof Date ? value : new Date(value);
		return !isNaN(date.getTime());
	}

	private _isValidRange(value: any): boolean {
		if (value === null || value === undefined) return true;
		if (!value.start || !value.end) return false;
		return this._isValidDate(value.start) && this._isValidDate(value.end);
	}

	protected _formatValue(value: any): void {
		if (this._updating() || !this._initialized()) return;

		this._updating.set(true);
		try {
			if (value === null || value === undefined) {
				this._pickedDate.set(null);
				return;
			}

			if (this.rangeMode()) {
				const range = this._parseRangeValue(value);
				if (range) {
					this._pickedDate.set(`${range.start.toISOString()} - ${range.end.toISOString()}`);
				} else {
					this._pickedDate.set(null);
				}
			} else {
				const date = this._parseDateValue(value);
				if (date) {
					this._pickedDate.set(date.toISOString());
				} else {
					this._pickedDate.set(null);
				}
			}
		} catch (e) {
			console.error('Error formatting date:', e);
			this._pickedDate.set(null);
		} finally {
			timer(0).subscribe(() => this._updating.set(false));
		}
	}

	private _parseRangeValue(value: any): { start: Date; end: Date } | null {
		if (value === null || value === undefined) return null;

		let start: Date, end: Date;

		if (value?.start && value?.end) {
			start = new Date(value.start);
			end = new Date(value.end);
		} else if (typeof value === 'string' && value.includes(' - ')) {
			const [startStr, endStr] = value.split(' - ').map((s) => s.trim());
			start = new Date(startStr);
			end = new Date(endStr);
		} else {
			return null;
		}

		return !isNaN(start.getTime()) && !isNaN(end.getTime()) ? { start, end } : null;
	}

	private _parseDateValue(value: any): Date | null {
		if (value === null || value === undefined) return null;
		if (typeof value === 'string' && value.trim() === '') return null;

		const date = value instanceof Date ? value : new Date(value);
		return !isNaN(date.getTime()) ? date : null;
	}

	protected _shouldShowPlaceholder = computed(() => {
		return this._pickedDate() === null || (this.rangeMode() && this._pickedDate() === 'undefined - undefined');
	});

	protected _formatDate = computed(() => {
		if (this._shouldShowPlaceholder()) return '';

		const dateString = this._pickedDate();
		if (!dateString) return '';

		if (this.rangeMode() && dateString.includes(' - ')) {
			const [start, end] = dateString.split(' - ');
			const startDate = new Date(start);
			const endDate = new Date(end);

			if (this.formatType() === 'isoShort') {
				return `${formatDateToISOShort(startDate)} - ${formatDateToISOShort(endDate)}`;
			}
			return `${formatDateToMonthDayYear(startDate)} - ${formatDateToMonthDayYear(endDate)}`;
		}

		const date = new Date(dateString);
		return this.formatType() === 'isoShort' ? formatDateToISOShort(date) : formatDateToMonthDayYear(date);
	});

	protected _onSelectDate(date: Date | null): void {
		if (this._updating()) return;

		this._updating.set(true);
		try {
			this._pickedDate.set(date?.toISOString() ?? null);
			this._updateControlValue(date);
		} finally {
			timer(0).subscribe(() => this._updating.set(false));
		}
	}

	protected _onSelectRangeDate(range: TCalendarRange | null): void {
		if (this._updating()) return;

		this._updating.set(true);
		try {
			if (!range) {
				this._pickedDate.set(null);
			} else {
				this._pickedDate.set(`${range.start.toISOString()} - ${range.end.toISOString()}`);
			}
			this._updateRangeControlValue(range);
		} finally {
			timer(0).subscribe(() => this._updating.set(false));
		}
	}

	private _updateControlValue(value: TCalendarDate): void {
		if (!this.control()) return;
		this.control()?.setValue(value, { emitEvent: false });
	}

	private _updateRangeControlValue(value: TCalendarRange): void {
		if (!this.rangeControl()) return;
		this.rangeControl()?.setValue(value, { emitEvent: false });
	}

	protected _touchedControl(): void {
		timer(0)
			.pipe(takeUntilDestroyed(this._destroyRef))
			.subscribe(() => {
				this.control()?.markAsTouched();
			});
	}

	public setHasError(value: boolean): void {
		this._hasError.set(value);
	}

	protected readonly _frsClass = computed(() => frs('block w-full [&_frs-popover]:w-full'));
	protected readonly _frsPClass = computed(() =>
		frs(
			`block w-full h-9 flex items-center rounded-md border bg-transparent px-3 py-1 pt-1.5 text-nowrap 
      focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:ring-ring
      [&>i-lucide>svg]:size-4 [&>i-lucide>svg]:shrink-0 [&>i-lucide>svg]:mr-2 
      `,
			this._hasError() ? 'border-red-400 text-red-400 focus-visible:ring-red-400' : ''
		)
	);
}
