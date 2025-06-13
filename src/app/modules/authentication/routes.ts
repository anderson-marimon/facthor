import type { Routes } from '@angular/router';
import { guardAlreadyStarted } from '@authentication/guards/already-started';
import { guardQueryParamsToken } from '@authentication/guards/query-params-token';

export const authRoutes: Routes = [
	{
		path: '',
		loadComponent: () => import('@authentication/layout'),
		canActivate: [guardAlreadyStarted],
		children: [
			{
				path: '',
				redirectTo: 'sign-in',
				pathMatch: 'full',
			},
			{
				path: 'sign-in',
				loadComponent: () => import('@authentication/modules/sign-in/template').then((page) => page.default),
			},
			{
				path: 'sign-up',
				loadComponent: () => import('@authentication/modules/sign-up/template').then((page) => page.default),
			},
			{
				path: 'forgot-password',
				loadComponent: () => import('@authentication/modules/forgot-password/template').then((page) => page.default),
			},
			{
				path: 'change-password',
				canActivate: [guardQueryParamsToken],
				loadComponent: () => import('@authentication/modules/change-password/template').then((page) => page.default),
			},
			{
				path: 'resend-documents',
				canActivate: [guardQueryParamsToken],
				loadComponent: () => import('@authentication/modules/resend-documents/template').then((page) => page.default),
			},
		],
	},
];
