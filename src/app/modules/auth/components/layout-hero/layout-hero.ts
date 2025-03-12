import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FacthorLogo } from '@shared/components/facthor-logo/facthor-logo';

@Component({
	selector: 'layout-hero',
	imports: [FacthorLogo, RouterLink],
	templateUrl: 'layout-hero.html'
})
export class LayoutHero {}
