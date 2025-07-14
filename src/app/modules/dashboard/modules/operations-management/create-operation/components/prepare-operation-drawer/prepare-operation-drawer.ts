import { CommonModule } from '@angular/common';
import { afterNextRender, Component, DestroyRef, inject, input, OnDestroy, output, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { ApiGetOperationsFinancierList } from '@dashboard/modules/operations-management/create-operation/api/get-operation-financiers';
import { TOperationSummary } from '@dashboard/modules/operations-management/create-operation/api/post-get-operation-summary';
import { CreateOperationOperationSummary } from '@dashboard/modules/operations-management/create-operation/components/operation-summary/operation-summary';
import { EmptyResult } from '@shared/components/empty-result/empty-result';
import { GeneralLoader } from '@shared/components/general-loader/general-loader';
import { ViewCard } from '@shared/components/view-card/view-card';
import { CheckIcon } from '@shared/icons/check-icon/check-icon';
import { LucideAngularModule, SearchCheck } from 'lucide-angular';

@Component({
	selector: 'create-operation-prepare-operation-drawer',
	templateUrl: 'prepare-operation-drawer.html',
	imports: [CheckIcon, CommonModule, EmptyResult, GeneralLoader, LucideAngularModule, CreateOperationOperationSummary, ViewCard],
})
export class CreateOperationPrepareOperationDrawer implements OnDestroy {
	public readonly fnGetOperationFinancierList = input<() => void>();
	public readonly fnPostGetOperationSummary = input<(financierId: number) => void>();
	public readonly operationSummary = input<Nullable<TOperationSummary>>();
	public readonly isLoadingApiPostGetOperationSummary = input.required<boolean>();
	public readonly onSelectFinancier = output<number[]>();

	private readonly _destroyRef = inject(DestroyRef);
	private readonly _apiGetOperationFinancierList = inject(ApiGetOperationsFinancierList);

	protected readonly _searchIcon = SearchCheck;
	protected readonly _selectedFinancier = signal<number[]>([]);
	protected readonly _financierList = this._apiGetOperationFinancierList.response;
	protected readonly _isLoadingApiGetOperationFinancierList = this._apiGetOperationFinancierList.isLoading;

	constructor() {
		this._addObservable();

		afterNextRender(() => {
			const getOperationFinancierList = this.fnGetOperationFinancierList();
			getOperationFinancierList && getOperationFinancierList();
		});
	}

	private _addObservable(): void {
		toObservable(this._selectedFinancier)
			.pipe(takeUntilDestroyed(this._destroyRef))
			.subscribe(([idSelectedFinancier]) => {
				if (!idSelectedFinancier) return;

				const fnPostGetOperationSummary = this.fnPostGetOperationSummary();
				fnPostGetOperationSummary && fnPostGetOperationSummary(idSelectedFinancier);
			});
	}

	protected _onClickSelectFinancier(financierId: number): void {
		this._selectedFinancier.set([financierId]);
		this.onSelectFinancier.emit(this._selectedFinancier());
	}

	public ngOnDestroy(): void {
		this.onSelectFinancier.emit(this._selectedFinancier());
	}
}
