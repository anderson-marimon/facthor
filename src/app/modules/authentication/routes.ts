import type { Routes } from '@angular/router';
import { alreadyStarted } from '@authentication/guards/already-started';
import { queryToken } from '@authentication/guards/query-token';

export const authRoutes: Routes = [
	{
		path: '',
		loadComponent: () => import('@authentication/layout'),
		canActivate: [alreadyStarted],
		children: [
			{
				path: '',
				redirectTo: 'sign-in',
				pathMatch: 'full',
			},
			{
				path: 'sign-in',
				loadComponent: () => import('@authentication/modules/sign-in/view').then((page) => page.default),
			},
			{
				path: 'sign-up',
				loadComponent: () => import('@authentication/modules/sign-up/view').then((page) => page.default),
			},
			{
				path: 'forgot-password',
				loadComponent: () => import('@authentication/modules/forgot-password/view').then((page) => page.default),
			},
			{
				path: 'change-password',
				canActivate: [queryToken],
				loadComponent: () => import('@authentication/modules/change-password/view').then((page) => page.default),
			},
			{
				path: 'resend-documents',
				canActivate: [queryToken],
				loadComponent: () => import('@authentication/modules/resend-documents/view').then((page) => page.default),
			},
		],
	},
];
