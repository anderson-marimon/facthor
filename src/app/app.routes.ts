import type { Routes } from '@angular/router';

export const routes: Routes = [
	{
		path: '',
		redirectTo: 'dashboard',
		pathMatch: 'full',
	},
	{
		path: 'dashboard',
		loadChildren: () => import('@dashboard/routes').then((module) => module.dashboardRoutes),
	},
	{
		path: 'authentication',
		loadChildren: () => import('@authentication/routes').then((module) => module.authRoutes),
	},
	{
		path: '**',
		redirectTo: 'dashboard',
		pathMatch: 'full',
	},
];
