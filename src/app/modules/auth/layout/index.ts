import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LayoutHero } from '../components/layout-hero/layout-hero';

@Component({
	selector: 'auth-layout',
	templateUrl: 'index.html',
	imports: [LayoutHero, RouterOutlet]
})
export default class AuthLayout {}
