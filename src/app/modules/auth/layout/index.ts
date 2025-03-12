import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LayoutHero } from '../components/layout-hero/layout-hero';

@Component({
	selector: 'auth-layout',
	imports: [LayoutHero, RouterOutlet],
	templateUrl: 'index.html'
})
export default class AuthLayout {}
