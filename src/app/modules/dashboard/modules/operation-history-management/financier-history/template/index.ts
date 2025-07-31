import { Component, inject, signal } from '@angular/core';
import { AccessViewInformation } from '@dashboard/common/extension/access-information-view';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { EmptyResult } from '@shared/components/empty-result/empty-result';
import { GeneralLoader } from '@shared/components/general-loader/general-loader';
import { InheritTable } from '@shared/components/inherit-table/inherit-table';
import { InheritTableFooter } from '@shared/components/inherit-table-footer/inherit-table-footer';
import { OrderStatus } from '@shared/components/order-status/order-status';
import { ERoleExecution } from '@dashboard/common/enums/role-execution';
import { FrsButtonModule } from '@fresco-ui/frs-button';
import { RouterLink } from '@angular/router';
import {
	ApiGetFinancierOperationsHistory,
	TApiGetFinancierOperationsHistoryQueryParams,
	TApiGetFinancierOperationsHistoryQuerySignalParams,
} from '@dashboard/modules/operation-history-management/financier-history/api/get-financier-operations-history';
import { FinancierHistoryTableFilters } from '@dashboard/modules/operation-history-management/financier-history/components/table-filters/table-filters';

const HEADERS = ['n.orden', 'nit del proveedor', 'proveedor', 'estado', 'monto', 'fecha de operación', 'detalles'];

@Component({
	selector: 'operation-history-management-financier-history',
	templateUrl: 'index.html',
	providers: [ApiGetFinancierOperationsHistory],
	imports: [
		CommonModule,
		CurrencyPipe,
		EmptyResult,
		FrsButtonModule,
		GeneralLoader,
		InheritTable,
		InheritTableFooter,
		OrderStatus,
		FinancierHistoryTableFilters,
		RouterLink,
	],
})
export default class OperationsHistoryManagementFinancierHistory extends AccessViewInformation {
	private readonly _apiGetFinancierOperationsHistory = inject(ApiGetFinancierOperationsHistory);

	protected readonly _getFinancierOperationsHistoryParams = signal<Partial<TApiGetFinancierOperationsHistoryQuerySignalParams>>({});
	protected readonly _financierOperationsHistory = this._apiGetFinancierOperationsHistory.response;
	protected readonly _isLoadingApiGetFinancierOperationsHistory = this._apiGetFinancierOperationsHistory.isLoading;

	protected readonly _headers = HEADERS;
	protected readonly _eRoleExecution = ERoleExecution;

	constructor() {
		super();
		this._getInitFinancierOperationsHistory();
	}

	private _getInitFinancierOperationsHistory(): void {
		this._getFinancierOperationsHistoryParams.set({
			accessToken: this._accessToken(),
			accessModule: this._accessModule(),
			accessService: this._accessServices()?.GET_FINANCIER_OPERATION_HISTORY_SERVICE,
			Page: 1,
			Size: 14,
		});

		this._apiGetFinancierOperationsHistory.getFinancierOperationsHistory(this._getFinancierOperationsHistoryParams());
	}

	protected _getFinancierOperationsHistoryForPaginator(page: number): void {
		this._getFinancierOperationsHistoryParams.set({
			...this._getFinancierOperationsHistoryParams(),
			Page: page,
		});

		this._apiGetFinancierOperationsHistory.getFinancierOperationsHistory(this._getFinancierOperationsHistoryParams());
	}

	protected _getFinancierOperationsHistoryForFilter(queryFilters: Partial<Omit<TApiGetFinancierOperationsHistoryQueryParams, 'Size'>>): void {
		this._getFinancierOperationsHistoryParams.set({
			...this._getFinancierOperationsHistoryParams(),
			...queryFilters,
		});

		this._apiGetFinancierOperationsHistory.getFinancierOperationsHistory(this._getFinancierOperationsHistoryParams());
	}
}