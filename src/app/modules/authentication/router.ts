import type { Routes } from '@angular/router';

export const authRoutes: Routes = [
	{
		path: '',
		loadComponent: () => import('./layout'),
		children: [
			{
				path: '',
				redirectTo: 'sign-in',
				pathMatch: 'full',
			},
			{
				path: 'sign-in',
				loadComponent: () => import('./modules/sign-in/view').then((m) => m.default),
			},
			{
				path: 'sign-up',
				loadComponent: () => import('./modules/sign-up/view').then((m) => m.default),
			},
		],
	},
];
