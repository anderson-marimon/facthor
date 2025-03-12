import type { Routes } from '@angular/router';

export const routes: Routes = [
	{
		path: '',
		redirectTo: 'auth',
		pathMatch: 'full'
	},
	{
		path: 'auth',
		loadChildren: () => import('./modules/auth/router').then(m => m.authRoutes)
	},
	{
		path: '**',
		redirectTo: 'auth',
		pathMatch: 'full'
	}
];
