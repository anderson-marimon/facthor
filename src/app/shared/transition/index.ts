import { animate, style, transition, trigger } from '@angular/animations';
import { Component, inject, NgZone, ChangeDetectorRef } from '@angular/core';
import { FacthorLogoAnimated } from '@shared/logos/facthor-logo-animated/facthor-logo-animated';

@Component({
	selector: 'transition-view',
	templateUrl: 'index.html',
	animations: [trigger('fade', [transition(':leave', [animate('200ms ease-in', style({ opacity: 0 }))])])],
	imports: [FacthorLogoAnimated],
})
export class TransitionView {
	protected readonly _ngZone = inject(NgZone);
	protected readonly _cdr = inject(ChangeDetectorRef);
	protected _show = true;

	constructor() {
		this._ngZone.runOutsideAngular(() => {
			const timer = setTimeout(() => {
				this._show = false;
				this._cdr.markForCheck();
				clearTimeout(timer);
			}, 2500);
		});
	}
}
