import { afterNextRender, Component, DestroyRef, inject, input, NgZone } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { TApiGetProofDisbursementDetailsQueryParams } from '@dashboard/modules/operations-management/view-proof-disbursement-details/api/get-proof-disbursement-details';
import { FrsButtonModule } from '@fresco-ui/frs-button';
import { FrsDatePickerModule } from '@fresco-ui/frs-date-picker';
import { FrsInputModule } from '@fresco-ui/frs-input';
import { FrsSelectModule } from '@fresco-ui/frs-select';
import { TSelectOption } from '@fresco-ui/frs-select/frs-select';
import { LucideAngularModule, RefreshCcw } from 'lucide-angular';
import { filter } from 'rxjs';

const DISBURSEMENT_STATUSES = [
	{ label: 'Desembolso a proveedor', value: 1 },
	{ label: 'Pago a financiador', value: 2 },
	{ label: 'Retorno de reserva', value: 3 },
];
@Component({
	selector: 'view-proof-disbursement-details-table-filters',
	templateUrl: 'table-filters.html',
	imports: [FrsButtonModule, FrsDatePickerModule, FrsInputModule, FrsSelectModule, LucideAngularModule, ReactiveFormsModule],
})
export class ViewProofDisbursementDetailsTableFilters {
	public readonly roleExecution = input(0);
	public readonly callback = input<() => void>();
	public readonly goBackToSideBar = input(false);
	public readonly isLoadingApiGetProofDisbursements = input(false);
	public readonly filterFunction = input<(queryFilters: Partial<Omit<TApiGetProofDisbursementDetailsQueryParams, 'Size'>>) => void>();

	private readonly _destroyRef = inject(DestroyRef);
	private readonly _formBuilder = inject(FormBuilder);
	private readonly _ngZone = inject(NgZone);
	private _isFiltersActive = false;

	protected readonly _resetFilterIcon = RefreshCcw;
	protected readonly _disbursementStatuses = DISBURSEMENT_STATUSES;

	protected readonly _searchOrderStatusesControl = this._formBuilder.control<TSelectOption[]>([]);

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
				this._getProofDisbursementsByFilters({
					IdOperationDisbursementState: status?.[0]?.value || undefined,
					Page: 1,
				});
			});
	}

	private _getProofDisbursementsByFilters(args: Partial<Omit<TApiGetProofDisbursementDetailsQueryParams, 'Size'>>): void {
		const searchByFilter = this.filterFunction();

		if (!searchByFilter) {
			console.warn('The pagination function is not being provided.');
			return;
		}

		searchByFilter({ ...args });
	}

	protected _onClickResetFilters(): void {
		if (this.isLoadingApiGetProofDisbursements()) return;

		this._searchOrderStatusesControl.setValue([]);
	}
}
