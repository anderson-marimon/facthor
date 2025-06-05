import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { FrsButtonModule } from '@fresco-ui/frs-button';
import { FrsDatePickerModule } from '@fresco-ui/frs-date-picker';
import { FrsInputModule } from '@fresco-ui/frs-input';
import { FrsSelectModule } from '@fresco-ui/frs-select';
import { TSelectOption } from '@fresco-ui/frs-select/frs-select';
import { LucideAngularModule, RefreshCcw, Search } from 'lucide-angular';

const SEARCH_SELECT_OPTIONS = [
	{ label: 'Numero de factura', value: 1 },
	{ label: 'Cufe', value: 2 },
	{ label: 'Nombre legal', value: 3 },
	{ label: 'Nit', value: 4 },
];

@Component({
	selector: 'view-upload-invoice-table-filters',
	templateUrl: 'table-filters.html',
	imports: [FrsButtonModule, FrsDatePickerModule, FrsInputModule, FrsSelectModule, LucideAngularModule, ReactiveFormsModule],
})
export class ViewUploadInvoiceTableFilters {
	private readonly _destroyRef = inject(DestroyRef);
	private readonly _formBuilder = inject(FormBuilder);

	protected readonly _searchSelectOptions = SEARCH_SELECT_OPTIONS;
	protected readonly _resetFilterIcon = RefreshCcw;
	protected readonly _searchIcon = Search;

	protected readonly _currentSelection = signal<TSelectOption[]>([]);
	protected readonly _searchInputControl = this._formBuilder.control('');
	protected readonly _searchSelectControl = this._formBuilder.control<TSelectOption[]>([]);
	protected readonly _searchPerDate = this._formBuilder.control(null);

	protected readonly _currentSelectionPlaceholder = computed(() =>
		this._currentSelection().length > 0 ? `Buscar por ${this._currentSelection()[0].label.toLocaleLowerCase()}` : 'Buscar por...'
	);

	constructor() {
		this._syncInputSelectOptions();
	}

	private _syncInputSelectOptions(): void {
		this._searchSelectControl.valueChanges.pipe(takeUntilDestroyed(this._destroyRef)).subscribe((newValue) => {
			if (newValue) {
				this._currentSelection.set(newValue);
			}
		});
	}
}
