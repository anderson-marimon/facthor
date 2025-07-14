import { resource, ResourceLoaderParams, signal } from '@angular/core';
import { envs } from '@app/envs/envs';
import { AccessInterceptor } from '@dashboard/interceptors/access-interceptor';
import { catchHandlerError } from '@shared/handlers/catch-handler-error';
import { apiDeferTime } from '@shared/utils/api-defer-time';

export type TOperationSummary = {
	operationPercentage: number;
	monthlyOperationRate: number;
	dailyOperatingRate: number;
	totalInvoicesValue: number;
	operationDate: string;
	expirationDate: string;
	operationDays: number;
	valueToFinance: number;
	operationReservePercentage: number;
	operationReserve: number;
	totalDeductions: number;
	providerValue: number;
	totalValueReceivedProvider: number;
	factoringCalculatorParameters: TFactoryCalculatorParameters;
};

export type TFactoryCalculatorParameters = {
	porcentualFinance: number;
	platformInterestRate: number;
	financierInterestRate: number;
	totalInvoicesValue: number;
	operationDate: string;
	expirationDate: string;
};

type TApiPostGetOperationSummaryResponse = TApi<TOperationSummary>;

export type TApiPostGetOperationSummarySignalBody = TAccessInfo & {
	idFinancier: number;
	invoices: string[];
};

export class ApiPostGetOperationSummary extends AccessInterceptor {
	private readonly _url = `${envs.FT_URL_NEGOTIATION}`;
	private readonly _request = signal<Nullable<TApiPostGetOperationSummarySignalBody>>(null);

	private readonly _resource = resource({
		request: this._request,
		loader: (args) => this._fetchPostGetOperationSummary(args),
	});

	protected async _fetchPostGetOperationSummary(params: ResourceLoaderParams<Nullable<TApiPostGetOperationSummarySignalBody>>) {
		const request = params.request;
		if (!request) return null;

		const { accessToken, accessModule, accessService, ...body } = request;

		if (!accessService?.service) {
			console.error('The service route is not being provided.');
			return null;
		}

		if (!accessService?.method) {
			console.error('The service method is not being provided.');
			return null;
		}

		const path = `${this._url}${accessService.service}`;

		try {
			await apiDeferTime();
			const response = await this._HttpRequest<TApiPostGetOperationSummaryResponse>({
				path,
				method: accessService.method,
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${accessToken}`,
					'x-module': `${accessModule}`,
				},
				signal: params.abortSignal,
				body: JSON.stringify(body),
			});
			return response.data;
		} catch (error) {
			catchHandlerError({
				error,
				message: 'No se pudo obtener el detalle de la operación',
				description: 'Estamos teniendo problemas para obtener el detalle de la operación, por favor intente más tarde.',
			});

			return null;
		}
	}

	public readonly response = this._resource.value;
	public readonly isLoading = this._resource.isLoading;

	public _getOperationSummary(params: TApiPostGetOperationSummarySignalBody): void {
		this._request.set(params);
	}
}
