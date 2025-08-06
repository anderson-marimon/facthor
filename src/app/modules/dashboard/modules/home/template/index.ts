import { Component, inject } from '@angular/core';
import { HomeOperationsChartComponent } from '@dashboard/modules/home/components/opertations-chart/opertations-chart';
import { LucideAngularModule } from 'lucide-angular';
import { ViewCard } from '@shared/components/view-card/view-card';
import { AccessViewInformation } from '@dashboard/common/extension/access-information-view';
import { ApiGetCompleteOperationsFinancier } from '@dashboard/modules/home/api/get-complete-operations-financier';
import { GeneralLoader } from '@shared/components/general-loader/general-loader';
import { JsonPipe } from '@angular/common';

@Component({
	selector: 'dashboard-welcome-page',
	templateUrl: 'index.html',
	providers: [ApiGetCompleteOperationsFinancier],
	imports: [HomeOperationsChartComponent, LucideAngularModule, ViewCard, GeneralLoader, JsonPipe],
})
export default class DashboardWelcomePage extends AccessViewInformation {
	private readonly _apiGetCompleteOperationsFinancier = inject(ApiGetCompleteOperationsFinancier);

	protected readonly _completeOperationsFinancier = this._apiGetCompleteOperationsFinancier.response;
	protected readonly _isLoadingApiGetCompleteOperationsFinancier = this._apiGetCompleteOperationsFinancier.isLoading;

	constructor() {
		super();

		this._getInitCompleteOperationsFinancier();
	}

	private _getInitCompleteOperationsFinancier(): void {
		this._apiGetCompleteOperationsFinancier.getCompleteOperationsFinancier({
			accessToken: this._accessToken(),
			accessService: {
				method: 'GET',
				service: '/api/v1/OperationsStatisticsFinancier/GetCompletedOperationsFinancier',
			},
		});
	}

	protected readonly Math = Math;
}
