import { afterNextRender, Component, computed, DestroyRef, inject, input, NgZone, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { TApiGetActiveOperationsListQueryParams } from '@dashboard/modules/operations-management/view-operations/api/get-active-operations-list';
import { FrsButtonModule } from '@fresco-ui/frs-button';
import { TCalendarRange } from '@fresco-ui/frs-calendar/frs-calendar';
import { FrsDatePickerModule } from '@fresco-ui/frs-date-picker';
import { FrsInputModule } from '@fresco-ui/frs-input';
import { FrsSelectModule } from '@fresco-ui/frs-select';
import { TSelectOption } from '@fresco-ui/frs-select/frs-select';
import { LucideAngularModule, RefreshCcw, Search } from 'lucide-angular';
import { debounceTime, distinctUntilChanged, filter, startWith, withLatestFrom } from 'rxjs';
import { ApiGetOrderStatuses } from '@dashboard/modules/operations-management/view-operations/api/get-order-statuses';

const SEARCH_SELECT_OPTIONS = [
	{ label: 'Número de orden', value: 0 },
	{ label: 'Nombre legal', value: 1 },
	{ label: 'Nombre comercial', value: 2 },
	{ label: 'Nit', value: 3 },
	{ label: 'Cufe', value: 4 },
];

const SEARCH_OPTIONS = ['OrderNumber', 'LegalName', 'Tradename', 'IdentitificationNumber'];

@Component({
	selector: 'view-active-operations-table-filters',
	templateUrl: 'table-filters.html',
	imports: [FrsButtonModule, FrsDatePickerModule, FrsInputModule, FrsSelectModule, LucideAngularModule, ReactiveFormsModule],
})
export class ViewActiveOperationsTableFilters {
	public readonly roleExecution = input(0);
	public readonly callback = input<() => void>();
	public readonly goBackToSideBar = input(false);
	public readonly isLoadingApiGetInvoiceList = input(false);
	public readonly filterFunction = input<(queryFilters: Partial<Omit<TApiGetActiveOperationsListQueryParams, 'Size'>>) => void>();

	private readonly _destroyRef = inject(DestroyRef);
	private readonly _apiGetOrderStatuses = inject(ApiGetOrderStatuses);
	private readonly _formBuilder = inject(FormBuilder);
	private readonly _ngZone = inject(NgZone);
	private _isFiltersActive = false;

	protected readonly _searchIcon = Search;
	protected readonly _resetFilterIcon = RefreshCcw;
	protected readonly _searchSelectOptions = SEARCH_SELECT_OPTIONS;

	protected readonly _orderStatuses = this._apiGetOrderStatuses.response;

	protected readonly _currentSelection = signal<TSelectOption[]>([]);

	protected readonly _searchPerDateRangeControl = this._formBuilder.control<TCalendarRange>(null);
	protected readonly _searchOrderStatusesControl = this._formBuilder.control<TSelectOption[]>([]);
	protected readonly _searchSelectSearchTypeControl = this._formBuilder.control<TSelectOption[]>([]);
	protected readonly _searchInputControl = this._formBuilder.control('');

	protected readonly _currentSelectionPlaceholder = computed(() =>
		this._currentSelection().length > 0 ? `Buscar por ${this._currentSelection()[0].label.toLocaleLowerCase()}` : 'Buscar por...'
	);

	constructor() {
		this._addSubscriptions();

		afterNextRender(() => {
			this._ngZone.runOutsideAngular(() => {
				setTimeout(() => {
					this._isFiltersActive = true;
				}, 100);
			});
		});
	}

	private _addSubscriptions(): void {
		this._searchOrderStatusesControl.valueChanges
			.pipe(
				takeUntilDestroyed(this._destroyRef),
				filter(() => this._isFiltersActive)
			)
			.subscribe((status) => {
				this._getInvoiceByFilters({
					IdOperationState: status?.[0]?.value || undefined,
					Page: 1,
				});
			});

		this._searchPerDateRangeControl.valueChanges
			.pipe(
				takeUntilDestroyed(this._destroyRef),
				filter(() => this._isFiltersActive)
			)
			.subscribe((rangeDates) => {
				this._getInvoiceByFilters({
					StartOperationDate: rangeDates?.start.toLocaleDateString('en-Ca') || undefined,
					EndOperationDate: rangeDates?.end.toLocaleDateString('en-Ca') || undefined,
					RoleToFind: 3,
					Page: 1,
				});
			});

		this._searchSelectSearchTypeControl.valueChanges
			.pipe(
				takeUntilDestroyed(this._destroyRef),
				distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
				filter(() => this._isFiltersActive)
			)
			.subscribe((selectedOption) => {
				this._currentSelection.set(selectedOption || []);
				this._searchInputControl.setValue('');
			});

		this._searchInputControl.valueChanges
			.pipe(
				takeUntilDestroyed(this._destroyRef),
				debounceTime(1000),
				withLatestFrom(this._searchSelectSearchTypeControl.valueChanges.pipe(startWith(this._searchSelectSearchTypeControl.value))),
				distinctUntilChanged(([prev], [curr]) => JSON.stringify(prev) === JSON.stringify(curr)),
				filter(() => this._isFiltersActive),
				filter(([_, selectedOptions]) => !!selectedOptions?.length)
			)
			.subscribe(([inputValue, selectedOptions]) => {
				const selectedOptionValue = selectedOptions![0].value;
				const selectedSearchOption = SEARCH_OPTIONS[selectedOptionValue];
				const optionsToFilter = SEARCH_OPTIONS.reduce((acc, option) => {
					acc[option] = option === selectedSearchOption && inputValue?.length ? inputValue : undefined;
					return acc;
				}, {} as Record<string, string | undefined>);

				this._getInvoiceByFilters({
					...optionsToFilter,
					Page: 1,
				});
			});
	}

	private _getInvoiceByFilters(args: Partial<Omit<TApiGetActiveOperationsListQueryParams, 'Size'>>): void {
		const searchByFilter = this.filterFunction();

		if (!searchByFilter) {
			console.warn('The pagination function is not being provided.');
			return;
		}

		searchByFilter({ ...args });
	}

	protected _onClickResetFilters(): void {
		if (this.isLoadingApiGetInvoiceList()) return;

		this._searchInputControl.setValue('');
		this._searchPerDateRangeControl.setValue(null);
		this._searchOrderStatusesControl.setValue([]);
		this._searchSelectSearchTypeControl.setValue([]);
	}
}
