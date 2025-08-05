import { CommonModule } from '@angular/common';
import { afterNextRender, Component, inject, signal } from '@angular/core';
import { ERoleExecution } from '@dashboard/common/enums/role-execution';
import { AccessViewInformation } from '@dashboard/common/extension/access-information-view';
import { FrsButtonModule } from '@fresco-ui/frs-button';
import { EmptyResult } from '@shared/components/empty-result/empty-result';
import { GeneralLoader } from '@shared/components/general-loader/general-loader';
import { InheritTableFooter } from '@shared/components/inherit-table-footer/inherit-table-footer';
import { InheritTable } from '@shared/components/inherit-table/inherit-table';
import {
	ApiGetNegotiationParameters,
	TApiGetNegotiationParametersQueryParams,
	TApiGetNegotiationParametersQuerySignalParams,
} from '@dashboard/modules/parameters-management/view-parameters/api/get-negotiation-parameters';
import { NegotiationParametersStatus } from '@shared/components/negotiation-parameters-status/negotiation-parameters-status';
import { NegotiationParametersTableFilters } from '@dashboard/modules/parameters-management/view-parameters/components/table-filters/table-filters';
import { CircleAlert, LucideAngularModule } from 'lucide-angular';

const HEADERS = [
	'proveedor',
	'tasa de interés',
	'días mínimos',
	'días máximos',
	'interés mensual',
	'estado',
	'monto asignado',
	'monto balance',
	'fecha',
];

const HEADERS_PROVIDERS = ['financiador', 'tasa de interés', 'días mínimos', 'días máximos', 'interés mensual', 'monto asignado', 'monto balance'];

@Component({
	selector: 'parameters-management-view-parameters',
	templateUrl: 'index.html',
	providers: [ApiGetNegotiationParameters],
	imports: [
		CommonModule,
		EmptyResult,
		GeneralLoader,
		FrsButtonModule,
		InheritTable,
		InheritTableFooter,
		NegotiationParametersStatus,
		NegotiationParametersTableFilters,
		LucideAngularModule,
	],
})
export default class ParametersManagementViewParameters extends AccessViewInformation {
	private readonly _apiGetNegotiationParameters = inject(ApiGetNegotiationParameters);

	protected _headers: string[] = [];
	protected readonly _getNegotiationParameters = signal<Partial<TApiGetNegotiationParametersQuerySignalParams>>({});
	protected readonly _eRoleExecution = ERoleExecution;
	protected readonly _circleAlertIcon = CircleAlert;

	protected readonly _negotiationParameters = this._apiGetNegotiationParameters.response;
	protected readonly _isLoadingApiGetNegotiationParameters = this._apiGetNegotiationParameters.isLoading;

	constructor() {
		super();
		this._getInitNegotiationParameters();

		afterNextRender(() => {
			if (this._roleExecution()?.id === this._eRoleExecution.FINANCIER) {
				this._headers = HEADERS;
			} else {
				this._headers = HEADERS_PROVIDERS;
			}
		});
	}

	private _getInitNegotiationParameters(): void {
		this._getNegotiationParameters.set({
			accessToken: this._accessToken(),
			accessModule: this._accessModule(),
			accessService: this._accessServices()?.GET_PARAMETER_NEGOTIATIONS,
			Page: 1,
			Size: 14,
		});
		this._apiGetNegotiationParameters.getNegotiationParameters(this._getNegotiationParameters());
	}

	protected _getNegotiationParametersForPaginator(page: number): void {
		this._getNegotiationParameters.set({
			...this._getNegotiationParameters(),
			Page: page,
		});

		this._apiGetNegotiationParameters.getNegotiationParameters(this._getNegotiationParameters());
	}

	protected _getNegotiationParametersForFilter(queryFilters: Partial<Omit<TApiGetNegotiationParametersQueryParams, 'Size'>>): void {
		this._getNegotiationParameters.set({
			...this._getNegotiationParameters(),
			...queryFilters,
		});

		this._apiGetNegotiationParameters.getNegotiationParameters(this._getNegotiationParameters());
	}
}
