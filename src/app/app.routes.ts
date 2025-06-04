import type { Routes } from '@angular/router';

export const routes: Routes = [
	{
		path: '',
		redirectTo: 'dashboard',
		pathMatch: 'full',
	},
	{
		path: 'dashboard',
		loadChildren: () => import('@dashboard/routes').then((router) => router.dashboardRoutes),
	},
	{
		path: 'authentication',
		loadChildren: () => import('@authentication/routes').then((router) => router.authRoutes),
	},
	{
		path: '**',
		redirectTo: 'dashboard',
		pathMatch: 'full',
	},
];
