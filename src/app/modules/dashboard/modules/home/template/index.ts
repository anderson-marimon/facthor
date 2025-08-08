import { Component, inject } from '@angular/core';
import { HomeOperationsChartComponent } from '@dashboard/modules/home/components/opertations-chart/operations-chart';
import { LucideAngularModule } from 'lucide-angular';
import { ViewCard } from '@shared/components/view-card/view-card';
import { AccessViewInformation } from '@dashboard/common/extension/access-information-view';
import { ApiGetOperationsStatistics } from '@dashboard/modules/home/api/get-operations-statistics';
import { GeneralLoader } from '@shared/components/general-loader/general-loader';
import { HomeStatisticCard } from '@dashboard/modules/home/components/statistic-card/statistic-card';
import { ERoleExecution } from '@dashboard/common/enums/role-execution';
import { ApiGetProviderQuota } from '@dashboard/modules/home/api/get-provider-quotas';

@Component({
	selector: 'dashboard-welcome-page',
	templateUrl: 'index.html',
	providers: [ApiGetOperationsStatistics, ApiGetProviderQuota],
	imports: [GeneralLoader, HomeOperationsChartComponent, HomeStatisticCard, LucideAngularModule, ViewCard],
})
export default class DashboardWelcomePage extends AccessViewInformation {
	private readonly _apiGetOperationsStatistics = inject(ApiGetOperationsStatistics);
	private readonly _apiGetProviderQuota = inject(ApiGetProviderQuota);

	protected readonly _Math = Math;
	protected readonly _eRoleExecution = ERoleExecution;

	protected readonly _operationsStatistics = this._apiGetOperationsStatistics.response;
	protected readonly _isLoadingApiGetOperationsStatistics = this._apiGetOperationsStatistics.isLoading;

	protected readonly _providerQuotas = this._apiGetProviderQuota.response;
	protected readonly _isLoadingApiGetProviderQuota = this._apiGetProviderQuota.isLoading;

	constructor() {
		super();

		this._getInitCompleteOperationsFinancier();
		this._getInitCompleteProviderQuotas();
	}

	private _getInitCompleteOperationsFinancier(): void {
		let service = '';

		switch (this._roleExecution()?.id) {
			case ERoleExecution.FINANCIER:
				service = '/api/v1/OperationsStatisticsFinancier/GetCompletedOperationsFinancier';
				break;

			case ERoleExecution.PAYER:
				service = '/api/v1/OperationsStatisticsPayer/Get';
				break;

			case ERoleExecution.PROVIDER:
				service = '/api/v1/OperationsStatisticsProvider/GetCompletedOperationsProvider';
				break;
		}

		this._apiGetOperationsStatistics.getOperationsStatistics({
			accessToken: this._accessToken(),
			accessService: {
				method: 'GET',
				service,
			},
		});
	}

	private _getInitCompleteProviderQuotas(): void {
		if (this._roleExecution()?.id !== ERoleExecution.PROVIDER) return;

		this._apiGetProviderQuota.getProviderQuota({
			accessToken: this._accessToken(),
			accessService: {
				method: 'GET',
				service: '/api/v1/OperationsStatisticsProvider/GetProviderQuotas',
			},
		});
	}
}
