import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LayoutHero } from '@authentication/components/layout-hero/layout-hero';
import { TransitionView } from '@shared/transition';

@Component({
	selector: 'authentication-layout',
	templateUrl: 'index.html',
	imports: [LayoutHero, RouterOutlet, TransitionView],
})
export default class AuthLayout {}
