import type { Routes } from '@angular/router';
import { queryToken } from '@authentication/guards/query-token';

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
			{
				path: 'forgot-password',
				loadComponent: () => import('./modules/forgot-password/view').then((m) => m.default),
			},
			{
				path: 'change-password',
				canActivate: [queryToken],
				loadComponent: () => import('./modules/change-password/view').then((m) => m.default),
			},
			{
				path: 'resend-documents',
				canActivate: [queryToken],
				loadComponent: () => import('./modules/resend-documents/view').then((m) => m.default),
			},
		],
	},
];
