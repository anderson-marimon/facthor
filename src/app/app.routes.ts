import type { Routes } from '@angular/router';

export const routes: Routes = [
	{
		path: '',
		redirectTo: 'authentication',
		pathMatch: 'full',
	},
	{
		path: 'authentication',
		loadChildren: () => import('@authentication/routes').then((module) => module.authRoutes),
	},
	{
		path: 'dashboard',
		loadChildren: () => import('@dashboard/routes').then((module) => module.dashboardRoutes),
	},
	{
		path: '**',
		redirectTo: 'dashboard',
		pathMatch: 'full',
	},
];
