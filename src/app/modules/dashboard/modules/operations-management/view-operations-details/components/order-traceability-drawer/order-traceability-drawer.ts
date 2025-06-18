import { Component, input, output } from '@angular/core';
import { TOperationTraceability } from '@dashboard/modules/operations-management/view-operations-details/api/get-operation-state-traceability';
import { FrsButtonModule } from '@fresco-ui/frs-button';
import { EmptyResult } from '@shared/components/empty-result/empty-result';
import { FacthorLogoAnimated } from '@shared/logos/facthor-logo-animated/facthor-logo-animated';
import { Calendar, Clock, FileX2, LucideAngularModule } from 'lucide-angular';

@Component({
	selector: 'active-operations-details-order-traceability-drawer',
	templateUrl: 'order-traceability-drawer.html',
	imports: [EmptyResult, FrsButtonModule, FacthorLogoAnimated, LucideAngularModule],
})
export class ActiveOperationsDetailsOrderTraceabilityDrawer {
	public readonly isLoading = input(false);
	public readonly invoiceNumber = input('');
	public readonly traceabilityEvents = input<TOperationTraceability[]>([]);
	public readonly closeDrawerEmitter = output<void>();

	protected readonly _clockIcon = Clock;
	protected readonly _notResultIcon = FileX2;
	protected readonly _calendarIcon = Calendar;

	protected _onClickCloseDrawer(): void {
		this.closeDrawerEmitter.emit();
	}
}
