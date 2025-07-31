import { Component, inject, signal } from '@angular/core';
import { AccessViewInformation } from '@dashboard/common/extension/access-information-view';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { EmptyResult } from '@shared/components/empty-result/empty-result';
import { GeneralLoader } from '@shared/components/general-loader/general-loader';
import { InheritTable } from '@shared/components/inherit-table/inherit-table';
import { InheritTableFooter } from '@shared/components/inherit-table-footer/inherit-table-footer';
import { OrderStatus } from '@shared/components/order-status/order-status';
import { ERoleExecution } from '@dashboard/common/enums/role-execution';
import { PayerHistoryTableFilters } from '@dashboard/modules/operation-history-management/payer-history/components/table-filters/table-filters';
import { FrsButtonModule } from '@fresco-ui/frs-button';
import { RouterLink } from '@angular/router';
import {
	ApiGetProviderOperationsHistory,
	TApiGetProviderOperationsHistoryQueryParams,
	TApiGetProviderOperationsHistoryQuerySignalParams,
} from '@dashboard/modules/operation-history-management/provider-history/api/get-provider-operations-history';

const HEADERS = ['n.orden', 'nit del proveedor', 'proveedor', 'estado', 'monto', 'fecha de operación', 'detalles'];

@Component({
	selector: 'operation-history-management-payer-history',
	templateUrl: 'index.html',
	providers: [ApiGetProviderOperationsHistory],
	imports: [
		CommonModule,
		CurrencyPipe,
		EmptyResult,
		FrsButtonModule,
		GeneralLoader,
		InheritTable,
		InheritTableFooter,
		OrderStatus,
		PayerHistoryTableFilters,
		RouterLink,
	],
})
export default class OperationsHistoryManagementProviderHistory extends AccessViewInformation {
	private readonly _apiGetProviderOperationsHistory = inject(ApiGetProviderOperationsHistory);

	protected readonly _getProviderOperationsHistoryParams = signal<Partial<TApiGetProviderOperationsHistoryQuerySignalParams>>({});
	protected readonly _providerOperationsHistory = this._apiGetProviderOperationsHistory.response;
	protected readonly _isLoadingApiGetProviderOperationsHistory = this._apiGetProviderOperationsHistory.isLoading;

	protected readonly _headers = HEADERS;
	protected readonly _eRoleExecution = ERoleExecution;

	constructor() {
		super();
		this._getInitProviderOperationsHistory();
	}

	private _getInitProviderOperationsHistory(): void {
		this._getProviderOperationsHistoryParams.set({
			accessToken: this._accessToken(),
			accessModule: this._accessModule(),
			accessService: this._accessServices()?.GET_PROVIDER_OPERATION_HISTORY_SERVICE,
			Page: 1,
			Size: 14,
		});

		this._apiGetProviderOperationsHistory.getProviderOperationsHistory(this._getProviderOperationsHistoryParams());
	}

	protected _getProviderOperationsHistoryForPaginator(page: number): void {
		this._getProviderOperationsHistoryParams.set({
			...this._getProviderOperationsHistoryParams(),
			Page: page,
		});

		this._apiGetProviderOperationsHistory.getProviderOperationsHistory(this._getProviderOperationsHistoryParams());
	}

	protected _getProviderOperationsHistoryForFilter(queryFilters: Partial<Omit<TApiGetProviderOperationsHistoryQueryParams, 'Size'>>): void {
		this._getProviderOperationsHistoryParams.set({
			...this._getProviderOperationsHistoryParams(),
			...queryFilters,
		});

		this._apiGetProviderOperationsHistory.getProviderOperationsHistory(this._getProviderOperationsHistoryParams());
	}
}