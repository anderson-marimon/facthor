import { Component, input, output } from '@angular/core';
import { TOrderTraceability } from '@dashboard/modules/operations-management/view-operations-details/api/get-order-state-traceability';
import { FrsButtonModule } from '@fresco-ui/frs-button';
import { EmptyResult } from '@shared/components/empty-result/empty-result';
import { GeneralLoader } from '@shared/components/general-loader/general-loader';
import { StateTraceabilityItem } from '@shared/components/state-traceability-item/state-traceability-item';

@Component({
	selector: 'active-operations-details-order-traceability-drawer',
	templateUrl: 'order-traceability-drawer.html',
	imports: [EmptyResult, FrsButtonModule, GeneralLoader, StateTraceabilityItem],
})
export class ActiveOperationsDetailsOrderTraceabilityDrawer {
	public readonly isLoading = input(false);
	public readonly invoiceNumber = input('');
	public readonly traceabilityEvents = input<TOrderTraceability[]>([]);
	public readonly closeDrawerEmitter = output<void>();

	protected _onClickCloseDrawer(): void {
		this.closeDrawerEmitter.emit();
	}
}
