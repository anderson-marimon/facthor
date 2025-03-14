import { Component, input } from '@angular/core';

@Component({
	selector: 'check-icon',
	templateUrl: 'check-icon.html',
	imports: []
})
export class CheckIcon {
	public readonly color = input('#000000');
}
