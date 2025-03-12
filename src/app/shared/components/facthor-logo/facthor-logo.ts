import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
	selector: 'facthor-logo',
	templateUrl: 'facthor-logo.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class FacthorLogo {
	public readonly textColor = input('#FFFFFF');
}
