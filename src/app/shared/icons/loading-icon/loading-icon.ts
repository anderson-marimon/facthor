import { Component, input } from '@angular/core';

@Component({
	selector: 'loading-icon',
	templateUrl: 'loading-icon.html',
	imports: [],
})
export class LoadingIcon {
	public readonly color = input('#000000');
}
