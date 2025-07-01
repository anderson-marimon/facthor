import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { TOperationSummary } from '@dashboard/modules/operations-management/create-operation/api/post-get-operation-summary';

@Component({
	selector: 'create-operation-operation-summary',
	templateUrl: 'operation-summary.html',
	imports: [CommonModule],
})
export class CreateOperationOperationSummary {
	public readonly operationSummary = input<TOperationSummary>();
}
