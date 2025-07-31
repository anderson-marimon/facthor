import { Component, inject, signal } from '@angular/core';
import { AccessViewInformation } from '@dashboard/common/extension/access-information-view';
import { CommonModule } from '@angular/common';
import { EmptyResult } from '@shared/components/empty-result/empty-result';
import { GeneralLoader } from '@shared/components/general-loader/general-loader';
import { InheritTable } from '@shared/components/inherit-table/inherit-table';
import { InheritTableFooter } from '@shared/components/inherit-table-footer/inherit-table-footer';
import { ERoleExecution } from '@dashboard/common/enums/role-execution';
import { FrsButtonModule } from '@fresco-ui/frs-button';
import { RouterLink } from '@angular/router';
import {
	TApiGetFinancierOperationsHistoryQueryParams,
	TApiGetFinancierOperationsHistoryQuerySignalParams,
} from '@dashboard/modules/operation-history-management/financier-history/api/get-financier-operations-history';
import { ApiGetFinancingRequests } from '@dashboard/modules/parameters-management/financing-requests/api/get-financing-requests';
import { LoadingIcon } from '@shared/icons/loading-icon/loading-icon';
import { EDisbursementStatus } from '@dashboard/common/enums/disbursement-status';
import { FinancingRequestTableFilters } from '@dashboard/modules/parameters-management/financing-requests/components/table-filters/table-filters';

const HEADERS = [
	'razón social',
	'tipo de documento',
	'n. documento',
	'nombre comercial',
	'correo electrónico',
	'estado',
	'representante legal',
	'fecha',
	'documentos',
	'acciones',
];

@Component({
	selector: 'parameters-management-financing-requests',
	templateUrl: 'index.html',
	providers: [ApiGetFinancingRequests],
	imports: [
		CommonModule,
		EmptyResult,
		FrsButtonModule,
		GeneralLoader,
		InheritTable,
		InheritTableFooter,
		RouterLink,
		LoadingIcon,
		FinancingRequestTableFilters,
	],
})
export default class ParametersManagementFinancingRequests extends AccessViewInformation {
	private readonly _apiGetFinancingRequests = inject(ApiGetFinancingRequests);

	protected readonly _getFinancingRequestsParams = signal<Partial<TApiGetFinancierOperationsHistoryQuerySignalParams>>({});
	protected readonly _financingRequests = this._apiGetFinancingRequests.response;
	protected readonly _isLoadingApiGetFinancingRequests = this._apiGetFinancingRequests.isLoading;

	protected readonly _headers = HEADERS;
	protected readonly _eRoleExecution = ERoleExecution;

	constructor() {
		super();
		this._getInitFinancingRequests();
	}

	private _getInitFinancingRequests(): void {
		this._getFinancingRequestsParams.set({
			accessToken: this._accessToken(),
			accessModule: this._accessModule(),
			accessService: this._accessServices()?.GET_NEGOTIATION_PARAMETERS_SOLICITUDE,
			Page: 1,
			Size: 14,
		});

		this._apiGetFinancingRequests.getFinancingRequests(this._getFinancingRequestsParams());
	}

	protected _getFinancierOperationsHistoryForPaginator(page: number): void {
		this._getFinancingRequestsParams.set({
			...this._getFinancingRequestsParams(),
			Page: page,
		});

		this._apiGetFinancingRequests.getFinancingRequests(this._getFinancingRequestsParams());
	}

	protected _getFinancierOperationsHistoryForFilter(queryFilters: Partial<Omit<TApiGetFinancierOperationsHistoryQueryParams, 'Size'>>): void {
		this._getFinancingRequestsParams.set({
			...this._getFinancingRequestsParams(),
			...queryFilters,
		});

		this._apiGetFinancingRequests.getFinancingRequests(this._getFinancingRequestsParams());
	}

	protected readonly _eDisbursementStatus = EDisbursementStatus;
}