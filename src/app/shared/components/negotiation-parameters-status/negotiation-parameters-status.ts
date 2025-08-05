import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
	selector: 'negotiation-parameter-status',
	templateUrl: 'negotiation-parameters-status.html',
	host: {
		'[class]': '"block w-full h-full pr-5"',
	},
	imports: [CommonModule],
})
export class NegotiationParametersStatus {
	public readonly status = input(false);
	public readonly statusName = input('');
}
