import type { Routes } from '@angular/router';

export const routes: Routes = [
	{
		path: '',
		redirectTo: 'authentication',
		pathMatch: 'full',
	},
	{
		path: 'authentication',
		loadChildren: () => import('@authentication/router').then((m) => m.authRoutes),
	},
	{
		path: '**',
		redirectTo: 'authentication',
		pathMatch: 'full',
	},
];
