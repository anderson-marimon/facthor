import { Routes } from '@angular/router';
import { ApiGetUserConfiguration } from '@dashboard/api/user-configuration';
import { guardAccessToken } from '@dashboard/guards/access-token';
import { resolverLoadUserConfig } from '@dashboard/resolver/load-user-config';
import { guardModulePermissions } from '@dashboard/guards/module-permissions';
import { StoreUserConfig } from '@dashboard/stores/user-config';

export const dashboardRoutes: Routes = [
	{
		path: '',
		providers: [StoreUserConfig, ApiGetUserConfiguration],
		canActivate: [guardAccessToken, resolverLoadUserConfig],
		loadComponent: () => import('@dashboard/layout').then((page) => page.default),
		children: [
			{
				path: '',
				redirectTo: 'home',
				pathMatch: 'full',
			},
			{
				path: 'home',
				loadComponent: () => import('@dashboard/modules/home/view').then((page) => page.default),
			},
			{
				path: 'invoice-management/upload-invoice',
				canActivate: [guardModulePermissions],
				loadComponent: () => import('@dashboard/modules/invoice-management/upload-invoice/view').then((page) => page.default),
			},
		],
	},
];
