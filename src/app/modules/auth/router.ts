import type { Routes } from '@angular/router';

export const authRoutes: Routes = [
	{
		path: '',
		loadComponent: () => import('./layout/'),
		loadChildren: () => [
			{
				path: '',
				redirectTo: 'sign-up',
				pathMatch: 'full'
			},
			{
				path: 'sign-up',
				loadComponent: () => import('./modules/sign-up/view')
			}
		]
	}
];
