import { afterNextRender, Component, input, WritableSignal } from '@angular/core';
import { TOrderInvoiceRadianEvent } from '@dashboard/modules/operations-management/view-operations-details/api/get-order-invoice-radian-events';
import { TOrderInvoiceStateTraceability } from '@dashboard/modules/operations-management/view-operations-details/api/get-order-invoice-state-traceability';
import { ActiveOperationsDetailsOrderInvoiceDetails } from '@dashboard/modules/operations-management/view-operations-details/components/order-invoice-details/order-invoice-details';
import { EmptyResult } from '@shared/components/empty-result/empty-result';
import { GeneralLoader } from '@shared/components/general-loader/general-loader';
import { RadianEventItem } from '@shared/components/radian-event-item/radian-event-item';
import { StateTraceabilityItem } from '@shared/components/state-traceability-item/state-traceability-item';
import { ViewCard } from '@shared/components/view-card/view-card';

type TModalProps = {
	invoice: any;
	roleExecution: number;
	fnGetOrderInvoiceRadianEvents: () => void;
	orderInvoiceRadianEvents: WritableSignal<Nullable<TOrderInvoiceRadianEvent[]>>;
	isLoadingOrderInvoiceRadianEvents: WritableSignal<boolean>;
	fnGetOrderInvoiceStateTraceability: () => void;
	orderInvoiceStateTraceability: WritableSignal<Nullable<TOrderInvoiceStateTraceability[]>>;
	isLoadingOrderInvoiceStateTraceability: WritableSignal<boolean>;
};

@Component({
	selector: 'active-operations-details-order-operation-detail-model',
	templateUrl: 'order-operation-detail-modal.html',
	imports: [ActiveOperationsDetailsOrderInvoiceDetails, EmptyResult, GeneralLoader, RadianEventItem, StateTraceabilityItem, ViewCard],
})
export class ActiveOperationsDetailsOrderOperations {
	public readonly data = input.required<TModalProps>();
	public readonly closeDialog = input<() => void>();

	constructor() {
		afterNextRender(() => {
			const getOrderInvoiceRadianEvents = this.data().fnGetOrderInvoiceRadianEvents;
			const getOrderInvoiceStateTraceability = this.data().fnGetOrderInvoiceStateTraceability;

			getOrderInvoiceRadianEvents();
			getOrderInvoiceStateTraceability();
		});
	}
}
