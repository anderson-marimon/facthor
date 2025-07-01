import { Component, input } from '@angular/core';

@Component({
	selector: 'check-icon',
	templateUrl: 'check-icon.html',
})
export class CheckIcon {
	public readonly color = input('#000000');
	public readonly strokeWidth = input(1.5);
}
