import { Routes } from '@angular/router';
import { ApiGetUserConfiguration } from '@dashboard/api/user-configuration';
import { guardAccessToken } from '@dashboard/guards/access-token';
import { guardModulePermissions } from '@dashboard/guards/module-permissions';
import { resolverGetAccessModule } from '@dashboard/resolver/get-access-module';
import { resolverGetAccessServices } from '@dashboard/resolver/get-access-services';
import { resolverGetAccessToken } from '@dashboard/resolver/get-access-token';
import { resolverGetRoleExecution } from '@dashboard/resolver/get-role-execution';
import { resolverGetUserConfig } from '@dashboard/resolver/get-user-config';
import { StoreUserConfig } from '@dashboard/stores/user-config';

export const dashboardRoutes: Routes = [
	{
		path: '',
		providers: [StoreUserConfig, ApiGetUserConfiguration],
		canActivate: [guardAccessToken, resolverGetUserConfig],
		loadComponent: () => import('@dashboard/layout').then((page) => page.default),
		children: [
			{
				path: '',
				redirectTo: 'home',
				pathMatch: 'full',
			},
			{
				path: 'home',
				loadComponent: () => import('@dashboard/modules/home/template').then((page) => page.default),
			},
			{
				path: 'invoice-management',
				children: [
					{
						path: '',
						redirectTo: 'upload-invoice',
						pathMatch: 'full',
					},
					{
						path: 'upload-invoice',
						canActivate: [guardModulePermissions],
						resolve: {
							accessToken: resolverGetAccessToken,
							accessModule: resolverGetAccessModule,
							accessServices: resolverGetAccessServices,
						},
						loadComponent() {
							return import('@dashboard/modules/invoice-management/upload-invoice/template');
						},
					},
					{
						path: 'view-upload-invoice',
						canActivate: [guardModulePermissions],
						resolve: {
							accessToken: resolverGetAccessToken,
							accessModule: resolverGetAccessModule,
							accessServices: resolverGetAccessServices,
						},
						loadComponent() {
							return import('@dashboard/modules/invoice-management/view-upload-invoice/template');
						},
					},
				],
			},
			{
				path: 'operations-management',
				children: [
					{
						path: '',
						redirectTo: 'view-operations',
						pathMatch: 'full',
					},
					{
						path: 'view-operations',
						canActivate: [guardModulePermissions],
						resolve: {
							accessToken: resolverGetAccessToken,
							accessModule: resolverGetAccessModule,
							accessServices: resolverGetAccessServices,
							roleExecution: resolverGetRoleExecution,
						},
						loadComponent() {
							return import('@dashboard/modules/operations-management/view-operations/template');
						},
					},
				],
			},
		],
	},
];
