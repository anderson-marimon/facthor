import { afterNextRender, Component, inject, input } from '@angular/core';
import { ApiGetOperationsFinancierList } from '@dashboard/modules/operations-management/create-operation/api/get-operation-financiers';
import { GeneralLoader } from '@shared/components/general-loader/general-loader';
import { ViewCard } from '@shared/components/view-card/view-card';

@Component({
	selector: 'create-operation-prepare-operation-drawer',
	templateUrl: 'prepare-operation-drawer.html',
	imports: [GeneralLoader, ViewCard],
})
export class CreateOperationPrepareOperationDrawer {
	public readonly fnGetOperationFinancierList = input<() => void>();

	private readonly _apiGetOperationFinancierList = inject(ApiGetOperationsFinancierList);

	protected readonly _financierList = this._apiGetOperationFinancierList.response;
	protected readonly _isLoadingApiGetOperationFinancierList = this._apiGetOperationFinancierList.isLoading;

	constructor() {
		afterNextRender(() => {
			const getOperationFinancierList = this.fnGetOperationFinancierList();
			getOperationFinancierList && getOperationFinancierList();
		});
	}
}
