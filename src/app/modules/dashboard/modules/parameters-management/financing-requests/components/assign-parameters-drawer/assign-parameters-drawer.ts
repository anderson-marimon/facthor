import { CommonModule } from '@angular/common';
import { Component, input, OnDestroy } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { ViewCard } from '@shared/components/view-card/view-card';
import { FormControl } from '@angular/forms';
import { FrsInputModule } from '@fresco-ui/frs-input';
import { FrsFieldModule } from '@fresco-ui/frs-field';

@Component({
	selector: 'financing-requests-assign-parameters-drawer',
	templateUrl: 'assign-parameters-drawer.html',
	imports: [CommonModule, FrsFieldModule, FrsInputModule, LucideAngularModule, ViewCard],
})
export class FinancingRequestsAssignParameters implements OnDestroy {
	public readonly minDaysFinancing = input.required<FormControl<string | null>>();
	public readonly maxDaysFinancing = input.required<FormControl<string | null>>();
	public readonly amountAssigned = input.required<FormControl<string | null>>();
	public readonly interestPercentage = input.required<FormControl<string | null>>();
	public readonly amountAssignedMonthUpdate = input.required<FormControl<string | null>>();
	public readonly operationPercentage = input.required<FormControl<string | null>>();

	public ngOnDestroy() {
		this.minDaysFinancing().reset();
		this.maxDaysFinancing().reset();
		this.amountAssigned().reset();
		this.interestPercentage().reset();
		this.amountAssignedMonthUpdate().reset();
		this.operationPercentage().reset();
	}
}
