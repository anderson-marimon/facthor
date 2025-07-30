import { Component, inject, signal } from '@angular/core';
import { AccessViewInformation } from '@dashboard/common/extension/access-information-view';
import {
	ApiGetPayerOperationsHistory,
	TApiGetPayerOperationsHistoryQuerySignalParams,
} from '@dashboard/modules/operation-history-management/payer-history/api/get-payer-operations-history';
import { TApiGetActiveOperationsListQueryParams } from '@dashboard/modules/operations-management/view-operations/api/get-active-operations-list';
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

const HEADERS = ['n.orden', 'nit del pagador', 'pagador', 'estado', 'estado del pagador', 'monto', 'fecha de operación', 'detalles'];

@Component({
	selector: 'operation-history-management-payer-history',
	templateUrl: 'index.html',
	providers: [ApiGetPayerOperationsHistory],
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
export default class OperationsHistoryManagementPayerHistory extends AccessViewInformation {
	private readonly _apiGetPayerOperationsHistory = inject(ApiGetPayerOperationsHistory);

	protected readonly _getPayerOperationsHistoryParams = signal<Partial<TApiGetPayerOperationsHistoryQuerySignalParams>>({});
	protected readonly _payerOperationsHistory = this._apiGetPayerOperationsHistory.response;
	protected readonly _isLoadingApiGetPayerOperationsHistory = this._apiGetPayerOperationsHistory.isLoading;

	protected readonly _headers = HEADERS;
	protected readonly _eRoleExecution = ERoleExecution;

	constructor() {
		super();
		this._getInitPayerOperationsHistory();
	}

	private _getInitPayerOperationsHistory(): void {
		this._getPayerOperationsHistoryParams.set({
			accessToken: this._accessToken(),
			accessModule: this._accessModule(),
			accessService: this._accessServices()?.GET_PAYER_OPERATION_HISTORY_SERVICE,
			Page: 1,
			Size: 14,
		});

		this._apiGetPayerOperationsHistory.getPayerOperationsHistory(this._getPayerOperationsHistoryParams());
	}

	protected _getPayerOperationsHistoryForPaginator(page: number): void {
		this._getPayerOperationsHistoryParams.set({
			...this._getPayerOperationsHistoryParams(),
			Page: page,
		});

		this._apiGetPayerOperationsHistory.getPayerOperationsHistory(this._getPayerOperationsHistoryParams());
	}

	protected _getPayerOperationsHistoryForFilter(queryFilters: Partial<Omit<TApiGetActiveOperationsListQueryParams, 'Size'>>): void {
		this._getPayerOperationsHistoryParams.set({
			...this._getPayerOperationsHistoryParams(),
			...queryFilters,
		});

		this._apiGetPayerOperationsHistory.getPayerOperationsHistory(this._getPayerOperationsHistoryParams());
	}
}