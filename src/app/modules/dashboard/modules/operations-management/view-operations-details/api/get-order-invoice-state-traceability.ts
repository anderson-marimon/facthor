import { resource, ResourceLoaderParams, signal } from '@angular/core';
import { envs } from '@app/envs/envs';
import { AccessInterceptor } from '@dashboard/interceptors/access-interceptor';
import { catchHandlerError } from '@shared/handlers/catch-handler-error';
import { apiDeferTime } from '@shared/utils/api-defer-time';
import { cleanQuery } from '@shared/utils/clean-query';

export type TOrderInvoiceStateTraceability = {
	idLog: string;
	stateName: string;
	creationDate: string;
};

type TApiOrderInvoiceStateTraceabilityResponse = TApi<TOrderInvoiceStateTraceability[]>;

type TAPiGetOrderInvoiceStateTraceabilityQuerySignalParams = TAccessInfo & {
	idOperation: string;
	idOperationDetail: string;
};
export class ApiGetOrderInvoiceStateTraceability extends AccessInterceptor {
	private readonly _url = `${envs.FT_URL_NEGOTIATION}`;
	private readonly _queryParams = signal<Nullable<TAPiGetOrderInvoiceStateTraceabilityQuerySignalParams>>(null);

	private readonly _resource = resource({
		request: this._queryParams,
		loader: (args) => this._fetchGetOrderInvoiceStateTraceability(args),
	});

	private async _fetchGetOrderInvoiceStateTraceability(
		params: ResourceLoaderParams<Nullable<TAPiGetOrderInvoiceStateTraceabilityQuerySignalParams>>
	) {
		const request = params.request;
		if (!request) return null;

		const { idOperation, idOperationDetail, accessToken, accessModule, accessService } = request;
		const integerRegex = /^[1-9]\d*$/;

		if (!integerRegex.test(idOperation)) {
			console.error('The operation id is not a valid integer.');
			return null;
		}

		if (!integerRegex.test(idOperation)) {
			console.error('The detail operation id is not a valid integer.');
			return null;
		}

		if (!accessService?.service) {
			console.error('The service route is not being provided.');
			return null;
		}

		if (!accessService?.method) {
			console.error('The service method is not being provided.');
			return null;
		}

		const _queryParams = new URLSearchParams(cleanQuery({ idOperation, idOperationDetail })).toString();
		const path = `${this._url}${accessService.service}?${_queryParams}`;

		try {
			await apiDeferTime();
			const response = await this._HttpRequest<TApiOrderInvoiceStateTraceabilityResponse>({
				path,
				method: accessService.method,
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${accessToken}`,
					'x-module': `${accessModule}`,
				},
				signal: params.abortSignal,
			});

			return response.data;
		} catch (error) {
			catchHandlerError({
				error,
				message: 'No se pudo obtener el historial de estado',
				description: 'Estamos teniendo problemas para obtener el detalle, por favor, intente más tarde.',
			});

			return null;
		}
	}

	public readonly response = this._resource.value;
	public readonly isLoading = this._resource.isLoading;

	public getOrderInvoiceStateTraceability(params: TAPiGetOrderInvoiceStateTraceabilityQuerySignalParams): void {
		this._queryParams.set(params);
	}
}
