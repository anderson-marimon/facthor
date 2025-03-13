import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FacthorLogo } from '@shared/icons/facthor-logo/facthor-logo';

@Component({
	selector: 'layout-hero',
	templateUrl: 'layout-hero.html',
	imports: [FacthorLogo, RouterLink]
})
export class LayoutHero {}
