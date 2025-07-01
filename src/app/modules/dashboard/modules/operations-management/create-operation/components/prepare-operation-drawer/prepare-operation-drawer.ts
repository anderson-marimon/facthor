import { CommonModule } from '@angular/common';
import { afterNextRender, Component, inject, input, signal } from '@angular/core';
import { ApiGetOperationsFinancierList } from '@dashboard/modules/operations-management/create-operation/api/get-operation-financiers';
import { GeneralLoader } from '@shared/components/general-loader/general-loader';
import { ViewCard } from '@shared/components/view-card/view-card';
import { CheckIcon } from '@shared/icons/check-icon/check-icon';

@Component({
	selector: 'create-operation-prepare-operation-drawer',
	templateUrl: 'prepare-operation-drawer.html',
	imports: [CheckIcon, CommonModule, GeneralLoader, ViewCard],
})
export class CreateOperationPrepareOperationDrawer {
	public readonly fnGetOperationFinancierList = input<() => void>();

	private readonly _apiGetOperationFinancierList = inject(ApiGetOperationsFinancierList);

	protected readonly _selectedFinancier = signal<number[]>([]);
	protected readonly _financierList = this._apiGetOperationFinancierList.response;
	protected readonly _isLoadingApiGetOperationFinancierList = this._apiGetOperationFinancierList.isLoading;

	constructor() {
		afterNextRender(() => {
			const getOperationFinancierList = this.fnGetOperationFinancierList();
			getOperationFinancierList && getOperationFinancierList();
		});
	}

	protected _onClickSelectFinancier(financierId: number): void {
		this._selectedFinancier.set([financierId]);
	}
}
