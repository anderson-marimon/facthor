import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { FacthorLogoAnimated } from '@shared/logos/facthor-logo-animated/facthor-logo-animated';

@Component({
	selector: 'transition-view',
	templateUrl: 'index.html',
	animations: [
		trigger('fade', [
			transition(':enter', [style({ opacity: 0 }), animate('0ms ease-out', style({ opacity: 1 }))]),
			transition(':leave', [animate('200ms ease-in', style({ opacity: 0 }))]),
		]),
	],
	imports: [FacthorLogoAnimated],
})
export class TransitionView implements OnInit {
	protected show = true;

	ngOnInit(): void {
		setTimeout(() => {
			this.show = false;
		}, 2500);
	}
}
