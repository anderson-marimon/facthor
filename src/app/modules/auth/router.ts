import type { Routes } from '@angular/router';

export const authRoutes: Routes = [
	{
		path: '',
		loadComponent: () => import('./layout'),
		children: [
			{
				path: '',
				redirectTo: 'sign-up',
				pathMatch: 'full',
			},
			{
				path: 'sign-up',
				loadComponent: () => import('./modules/sign-up/view').then((m) => m.default),
			},
		],
	},
];
