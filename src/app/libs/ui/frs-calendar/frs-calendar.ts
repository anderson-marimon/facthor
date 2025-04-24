import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { FormBuilder, type FormControl, Validators } from '@angular/forms';
import { frs } from '@fresco-core/frs-core';
import { FrsButtonModule } from '@fresco-ui/frs-button';
import { FrsInputModule } from '@fresco-ui/frs-input';
import { FrsSelectModule } from '@fresco-ui/frs-select';
import { cva } from 'class-variance-authority';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, LucideAngularModule } from 'lucide-angular';

type TCalendarDay = {
	date: Date;
	isCurrentMonth: boolean;
	isToday: boolean;
};

export type TCalendarDate = Date | null;
export type TCalendarRange = { start: Date; end: Date } | null;

@Component({
	selector: 'frs-calendar',
	standalone: true,
	imports: [CommonModule, FrsButtonModule, FrsSelectModule, FrsInputModule, LucideAngularModule],
	host: {
		'[class]': '_frsClass()',
	},
	template: `
		<div>
			<button frs-button [variant]="'ghost'" [size]="'icon'" (click)="_previousYear($event)">
				<i-lucide [strokeWidth]="1.5" [img]="_ChevronsLeft" />
			</button>

			<!-- IMPORTANTE: En los templates directos en el TS no se usan [] para el regex porque omite los \\ -->
			<frs-input
				[class]="_inputClass()"
				[control]="_yearControl"
				[placeholder]="_currentYear().toString()"
				[type]="'custom'"
				[mask]="'xxxx'"
				regex="[^\\d]"
			/>

			<button frs-button [variant]="'ghost'" [size]="'icon'" (click)="_nextYear($event)">
				<i-lucide [strokeWidth]="1.5" [img]="_ChevronsRight" />
			</button>
		</div>

		<div>
			<button frs-button [variant]="'ghost'" [size]="'icon'" (click)="_previousMonth($event)">
				<i-lucide [strokeWidth]="1.5" [img]="_ChevronLeft" />
			</button>

			<span>{{ _currentMonthName() }}</span>

			<button frs-button [variant]="'ghost'" [size]="'icon'" (click)="_nextMonth($event)">
				<i-lucide [strokeWidth]="1.5" [img]="_ChevronRight" />
			</button>
		</div>

		<section>
			@for (day of _weekDays; track $index) {
			<span>{{ day }}</span>
			}
		</section>

		<section>
			@if (_showCalendar()) { @for (day of _calendarDays(); track day.date.getTime()) {
			<button
				[ngClass]="{
					'opacity-50 cursor-default': !day.isCurrentMonth || !_isValidDate(day.date),
					'!opacity-30 !cursor-not-allowed': !_isValidDate(day.date),
					'hover:bg-primary/80 hover:cursor-pointer': day.isCurrentMonth && _isValidDate(day.date),
					'bg-accent hover:bg-accent/80 text-accent-foreground': _isInRange(day.date),
					'bg-primary hover:bg-primary/90 text-primary-foreground':
						_isSelected(day.date) || _isRangeStart(day.date) || _isRangeEnd(day.date),
					'bg-black/10 hover:bg-ring/90 text-foreground':
						day.isToday && !(_isSelected(day.date) || _isRangeStart(day.date) || _isRangeEnd(day.date))
				}"
				(click)="_selectDate(day, $event)"
			>
				{{ day.date.getDate() }}
			</button>
			} }
		</section>
	`,
})
export class FrsCalendar {
	private readonly _formBuilder = inject(FormBuilder);

	public readonly rangeMode = input(false);
	public readonly startDate = input<TCalendarDate>(null);
	public readonly endDate = input<TCalendarDate>(null);
	public readonly minDate = input<TCalendarDate>(null);
	public readonly maxDate = input<TCalendarDate>(null);

	public readonly dateSelected = output<TCalendarDate>();
	public readonly rangeSelected = output<TCalendarRange>();
	public readonly control = input<FormControl<TCalendarDate>>();
	public readonly rangeControl = input<FormControl<TCalendarRange>>();

	protected readonly _ChevronLeft = ChevronLeft;
	protected readonly _ChevronRight = ChevronRight;
	protected readonly _ChevronsLeft = ChevronsLeft;
	protected readonly _ChevronsRight = ChevronsRight;
	protected _invalidMinMax = false;

	protected readonly _currentDate = signal(new Date());
	protected readonly _selectedStartDate = signal<Date | null>(null);
	protected readonly _selectedEndDate = signal<Date | null>(null);
	protected readonly _inSelectionProcess = signal(false);
	protected readonly _showCalendar = signal(false);

	protected readonly _yearControl = this._formBuilder.control('', [Validators.required]);
	protected readonly _weekDays = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

	protected readonly _monthOptions = [
		{ value: 0, label: 'January' },
		{ value: 1, label: 'February' },
		{ value: 2, label: 'March' },
		{ value: 3, label: 'April' },
		{ value: 4, label: 'May' },
		{ value: 5, label: 'June' },
		{ value: 6, label: 'July' },
		{ value: 7, label: 'August' },
		{ value: 8, label: 'September' },
		{ value: 9, label: 'October' },
		{ value: 10, label: 'November' },
		{ value: 11, label: 'December' },
	];

	protected readonly _currentYear = computed(() => this._currentDate().getFullYear());
	protected readonly _currentMonth = computed(() => this._currentDate().getMonth());
	protected readonly _currentMonthName = computed(() => this._monthOptions[this._currentMonth()].label);

	protected _calendarDays = computed(() => {
		const date = this._currentDate();
		const year = date.getFullYear();
		const month = date.getMonth();

		const firstDay = new Date(year, month, 1);
		const lastDay = new Date(year, month + 1, 0);
		const prevMonthDays = (firstDay.getDay() + 6) % 7;
		const nextMonthDays = 6 - ((lastDay.getDay() + 6) % 7);

		const days: TCalendarDay[] = [];

		for (let i = prevMonthDays; i > 0; i--) {
			const dayDate = new Date(year, month, -i + 1);
			days.push({
				date: dayDate,
				isCurrentMonth: false,
				isToday: this._isToday(dayDate),
			});
		}

		for (let i = 1; i <= lastDay.getDate(); i++) {
			const dayDate = new Date(year, month, i);
			days.push({
				date: dayDate,
				isCurrentMonth: true,
				isToday: this._isToday(dayDate),
			});
		}

		for (let i = 1; i <= nextMonthDays; i++) {
			const dayDate = new Date(year, month + 1, i);
			days.push({
				date: dayDate,
				isCurrentMonth: false,
				isToday: this._isToday(dayDate),
			});
		}

		return days;
	});

	constructor() {
		// Sincronización reactiva de inputs externos
		effect(() => {
			const start = this.startDate();
			const end = this.endDate();
			const controlValue = this.control()?.value;
			const rangeControlValue = this.rangeControl()?.value;

			if (this.rangeMode()) {
				if (rangeControlValue?.start && rangeControlValue?.end) {
					this._selectedStartDate.set(new Date(rangeControlValue.start));
					this._selectedEndDate.set(new Date(rangeControlValue.end));
				} else if (start && end) {
					this._selectedStartDate.set(new Date(start));
					this._selectedEndDate.set(new Date(end));
				}
			} else {
				if (controlValue) {
					this._selectedStartDate.set(new Date(controlValue));
				} else if (start) {
					this._selectedStartDate.set(new Date(start));
				}
			}
		});

		this._syncInputs();
		this._showCalendar.set(true); // Mostrar calendario inmediatamente
	}

	private _syncInputs(): void {
		effect(() => {
			const start = this.startDate();
			const end = this.endDate();

			if (start) this._selectedStartDate.set(start);
			if (end) this._selectedEndDate.set(end);

			this._yearControl.setValue(this._currentYear().toString(), { emitEvent: false });
		});

		this._yearControl.valueChanges.subscribe((value) => {
			if (value && this._yearControl.valid && this._isValidYear(value)) {
				const newYear = Number.parseInt(value, 10);
				if (newYear !== this._currentDate().getFullYear()) {
					this._changeYear(newYear);
				}
			} else {
				this._yearControl.setValue(this._currentDate().getFullYear().toString(), { emitEvent: false });
			}
		});
	}

	private _handleRangeSelection(date: Date): void {
		if (this._selectedStartDate() && this._selectedEndDate()) {
			this._selectedStartDate.set(null);
			this._selectedEndDate.set(null);
			this._inSelectionProcess.set(false);
			this.rangeSelected.emit(null);
			this.rangeControl()?.setValue(null);
			return;
		}

		if (!this._inSelectionProcess()) {
			this._selectedStartDate.set(date);
			this._selectedEndDate.set(null);
			this._inSelectionProcess.set(true);
		} else {
			// biome-ignore lint/style/noNonNullAssertion: <explanation>
			if (date < this._selectedStartDate()!) {
				this._selectedEndDate.set(this._selectedStartDate());
				this._selectedStartDate.set(date);
			} else {
				this._selectedEndDate.set(date);
			}

			this._inSelectionProcess.set(false);
			this.rangeSelected.emit({
				// biome-ignore lint/style/noNonNullAssertion: <explanation>
				start: this._selectedStartDate()!,
				// biome-ignore lint/style/noNonNullAssertion: <explanation>
				end: this._selectedEndDate()!,
			});

			this.rangeControl()?.setValue({
				// biome-ignore lint/style/noNonNullAssertion: <explanation>
				start: this._selectedStartDate()!,
				// biome-ignore lint/style/noNonNullAssertion: <explanation>
				end: this._selectedEndDate()!,
			});
		}
	}

	private _isValidYear(inputYear: string): boolean {
		const year = Number.parseInt(inputYear, 10);
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		const minYear = this.minDate() ? this.minDate()!.getFullYear() : 1900;
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		const maxYear = this.maxDate() ? this.maxDate()!.getFullYear() : 2100;
		return year >= minYear && year <= maxYear;
	}

	private _isToday(date: Date): boolean {
		const today = new Date();
		return date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
	}

	protected _previousMonth(event: Event): void {
		event.preventDefault();
		this._currentDate.update((date) => {
			const newDate = new Date(date.getFullYear(), date.getMonth() - 1, 1);
			if (newDate.getFullYear() !== date.getFullYear()) {
				this._yearControl.setValue(newDate.getFullYear().toString(), { emitEvent: false });
			}
			return newDate;
		});
	}

	protected _nextMonth(event: Event): void {
		event.preventDefault();
		this._currentDate.update((date) => {
			const newDate = new Date(date.getFullYear(), date.getMonth() + 1, 1);
			if (newDate.getFullYear() !== date.getFullYear()) {
				this._yearControl.setValue(newDate.getFullYear().toString(), { emitEvent: false });
			}
			return newDate;
		});
	}

	protected _previousYear(event: Event): void {
		event.preventDefault();
		this._currentDate.update((date) => {
			const newDate = new Date(date.getFullYear() - 1, date.getMonth(), 1);
			this._yearControl.setValue(newDate.getFullYear().toString(), { emitEvent: false });
			return newDate;
		});
	}

	protected _nextYear(event: Event): void {
		event.preventDefault();
		this._currentDate.update((date) => {
			const newDate = new Date(date.getFullYear() + 1, date.getMonth(), 1);
			this._yearControl.setValue(newDate.getFullYear().toString(), { emitEvent: false });
			return newDate;
		});
	}

	protected _changeMonth(month: number): void {
		this._currentDate.update((date) => {
			const newDate = new Date(date.getFullYear(), month, 1);
			this._yearControl.setValue(newDate.getFullYear().toString(), { emitEvent: false });
			return newDate;
		});
	}

	protected _changeYear(year: number): void {
		this._currentDate.update((date) => {
			const newDate = new Date(year, date.getMonth(), 1);
			this._yearControl.setValue(newDate.getFullYear().toString(), { emitEvent: false });
			return newDate;
		});
	}

	protected _selectDate(day: TCalendarDay, event?: Event): void {
		event?.preventDefault();
		if (!this._isValidDate(day.date)) return;

		if (this.rangeMode()) {
			this._handleRangeSelection(day.date);
		} else {
			// biome-ignore lint/style/noNonNullAssertion: <explanation>
			if (this._selectedStartDate() && day.date.getTime() === this._selectedStartDate()!.getTime()) {
				this._selectedStartDate.set(null);
				this.dateSelected.emit(null);
				this.control()?.setValue(null);
			} else {
				this._selectedStartDate.set(day.date);
				this.dateSelected.emit(day.date);
				this.control()?.setValue(day.date);
			}
			this._selectedEndDate.set(null);
		}

		if (!day.isCurrentMonth) {
			this._currentDate.set(new Date(day.date.getFullYear(), day.date.getMonth(), 1));
		}
	}

	protected _isSelected(date: Date): boolean {
		if (!this._selectedStartDate()) return false;

		if (!this.rangeMode()) {
			return (
				// biome-ignore lint/style/noNonNullAssertion: <explanation>
				date.getDate() === this._selectedStartDate()!.getDate() &&
				// biome-ignore lint/style/noNonNullAssertion: <explanation>
				date.getMonth() === this._selectedStartDate()!.getMonth() &&
				// biome-ignore lint/style/noNonNullAssertion: <explanation>
				date.getFullYear() === this._selectedStartDate()!.getFullYear()
			);
		}

		return false;
	}

	protected _isValidDate(date: Date): boolean {
		if (!date || this._invalidMinMax) return false;

		const dateToCheck = new Date(date);
		dateToCheck.setHours(0, 0, 0, 0);

		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		const minDate = this.minDate() ? new Date(this.minDate()!) : null;
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		const maxDate = this.maxDate() ? new Date(this.maxDate()!) : null;

		if (minDate && maxDate) {
			minDate.setHours(0, 0, 0, 0);
			maxDate.setHours(0, 0, 0, 0);

			if (minDate > maxDate) {
				console.error('Error: minDate cannot be greater than maxDate');
				this._invalidMinMax = true;
				return false;
			}
		}

		if (minDate && dateToCheck < minDate) return false;
		if (maxDate && dateToCheck > maxDate) return false;
		return true;
	}

	protected _isRangeStart(date: Date): boolean {
		if (!this.rangeMode() || !this._selectedStartDate()) return false;
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		return date.toDateString() === this._selectedStartDate()!.toDateString();
	}

	protected _isRangeEnd(date: Date): boolean {
		if (!this.rangeMode() || !this._selectedEndDate()) return false;
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		return date.toDateString() === this._selectedEndDate()!.toDateString();
	}

	protected _isInRange(date: Date): boolean {
		if (!this.rangeMode() || !this._selectedStartDate() || !this._selectedEndDate()) return false;
		const time = date.getTime();
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		return time > this._selectedStartDate()!.getTime() && time < this._selectedEndDate()!.getTime();
	}
	protected readonly _frsClass = computed(() => frs(variants()));
	protected readonly _inputClass = computed(() => inputVariants());
}

const variants = cva(
	`w-full max-w-56 flex flex-col gap-2 text-sm p-2.5 rounded [&_*]:text-center
	[&>div]:flex [&>div]:items-center [&>div]:gap-2.5 [&>section]:text-center [&>div:last-of-type>span]:flex-1
	[&>section:first-of-type]:grid [&>section:first-of-type]:grid-cols-7 [&>section:first-of-type]:font-medium
	[&>section:last-of-type]:grid [&>section:last-of-type]:grid-cols-7 [&>section:last-of-type]:gap-1
	[&>section:last-of-type>button]:grid [&>section:last-of-type>button]:place-content-center [&>section:last-of-type>button]:aspect-square
	[&>section:last-of-type>button]:rounded [&>section:last-of-type>button]:transition-colors
	`
);

const inputVariants = cva('flex-1 h-fit text-center placeholder:text-center placeholder:text-foreground py-0 border-none focus-visible:ring-0');
