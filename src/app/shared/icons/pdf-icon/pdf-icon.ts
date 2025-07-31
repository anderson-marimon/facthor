import { Component, input } from '@angular/core';

@Component({
	selector: 'pdf-icon',
	templateUrl: 'pdf-icon.html',
})
export class LoadingIcon {
	public readonly color = input('#EB5757');
}
