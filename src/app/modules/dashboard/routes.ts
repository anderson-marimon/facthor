import { Routes } from '@angular/router';
import { accessToken } from '@dashboard/guards/access-token';

export const dashboardRoutes: Routes = [
	{
		path: '',
		loadComponent: () => import('@dashboard/layout').then((page) => page.default),
		children: [
			{
				path: '',
				redirectTo: 'home',
				pathMatch: 'full',
			},
			{
				path: 'home',
				canActivate: [accessToken],
				loadComponent: () => import('@dashboard/modules/home/view').then((page) => page.default),
			},
		],
	},
];
