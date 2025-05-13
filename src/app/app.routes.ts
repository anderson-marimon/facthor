import type { Routes } from '@angular/router';

export const routes: Routes = [
	{
		path: '',
		redirectTo: 'auth',
		pathMatch: 'full',
	},
	{
		path: 'auth',
		loadChildren: () => import('@authentication/router').then((m) => m.authRoutes),
	},
];
