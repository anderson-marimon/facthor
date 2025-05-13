import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
	selector: 'facthor-logo',
	templateUrl: 'facthor-logo.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FacthorLogo {
	public readonly withText = input(true);
	public readonly textColor = input('#FFFFFF');
	public readonly color = input('#00CC87');
	public readonly shadowColor = input('#24A185');
}
