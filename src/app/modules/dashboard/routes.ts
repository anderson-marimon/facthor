import { Routes } from '@angular/router';
import { ApiGetUserConfiguration } from '@dashboard/api/user-configuration';
import { guardAccessToken } from '@dashboard/guards/access-token';
import { guardInheritModulePermissions } from '@dashboard/guards/inherit-module-permissions';
import { guardModulePermissions } from '@dashboard/guards/module-permissions';
import { guardQueryParamOperation } from '@dashboard/guards/query-params-operation';
import { StoreActiveOperations } from '@dashboard/modules/operations-management/view-operations/stores/active-operations';
import { resolverGetAccessModule } from '@dashboard/resolver/get-access-module';
import { resolverGetAccessServices } from '@dashboard/resolver/get-access-services';
import { resolverGetAccessToken } from '@dashboard/resolver/get-access-token';
import { resolverGetIdentity } from '@dashboard/resolver/get-identity';
import { resolverGetInheritAccessServices } from '@dashboard/resolver/get-inherit-access-services';
import { resolverGetPermissionList } from '@dashboard/resolver/get-permissions-list';
import { resolverGetRoleExecution } from '@dashboard/resolver/get-role-execution';
import { resolverGetSessionKey } from '@dashboard/resolver/get-session-key';
import { resolverGetUserConfig } from '@dashboard/resolver/get-user-config';
import { StoreUserConfig } from '@dashboard/stores/user-config';

export const dashboardRoutes: Routes = [
	{
		path: '',
		providers: [StoreUserConfig, ApiGetUserConfiguration],
		canActivate: [guardAccessToken, resolverGetUserConfig],
		resolve: {
			identity: resolverGetIdentity,
			permissionList: resolverGetPermissionList,
			roleExecution: resolverGetRoleExecution,
		},
		loadComponent() {
			return import('@dashboard/layout');
		},
		children: [
			{
				path: '',
				redirectTo: 'home',
				pathMatch: 'full',
			},
			{
				path: 'home',
				loadComponent() {
					return import('@dashboard/modules/home/template');
				},
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
				providers: [StoreActiveOperations],
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
							identity: resolverGetIdentity,
							roleExecution: resolverGetRoleExecution,
							sessionKey: resolverGetSessionKey,
						},
						loadComponent() {
							return import('@dashboard/modules/operations-management/view-operations/template');
						},
					},
					{
						path: 'view-operations/details',
						canActivate: [guardQueryParamOperation, guardInheritModulePermissions],
						resolve: {
							accessToken: resolverGetAccessToken,
							accessModule: resolverGetAccessModule,
							accessServices: resolverGetInheritAccessServices,
							roleExecution: resolverGetRoleExecution,
						},
						data: {
							permitCriteria: 1,
							redirect: '/dashboard/operations-management/view-operations',
						},
						loadComponent() {
							return import('@dashboard/modules/operations-management/view-operations-details/template');
						},
					},
					{
						path: 'approve-operations',
						canActivate: [guardModulePermissions],
						resolve: {
							accessToken: resolverGetAccessToken,
							accessModule: resolverGetAccessModule,
							accessServices: resolverGetAccessServices,
							identity: resolverGetIdentity,
							roleExecution: resolverGetRoleExecution,
							sessionKey: resolverGetSessionKey,
						},
						loadComponent() {
							return import('@dashboard/modules/operations-management/approve-operations/template');
						},
					},
					{
						path: 'create-operation',
						canActivate: [guardModulePermissions],
						resolve: {
							accessToken: resolverGetAccessToken,
							accessModule: resolverGetAccessModule,
							accessServices: resolverGetAccessServices,
						},
						loadComponent() {
							return import('@dashboard/modules/operations-management/create-operation/template');
						},
					},
					{
						path: 'payments',
						children: [
							{
								path: '',
								redirectTo: 'view-proof-disbursement',
								pathMatch: 'full',
							},
							{
								path: 'view-proof-disbursement',
								canActivate: [guardModulePermissions],
								resolve: {
									accessToken: resolverGetAccessToken,
									accessModule: resolverGetAccessModule,
									accessServices: resolverGetAccessServices,
									roleExecution: resolverGetRoleExecution,
									sessionKey: resolverGetSessionKey,
								},
								data: { confirmationAction: false },
								loadComponent() {
									return import('@dashboard/modules/operations-management/view-proof-disbursement/template');
								},
							},
							{
								path: 'view-proof-disbursement/details',
								canActivate: [guardQueryParamOperation, guardInheritModulePermissions],
								resolve: {
									accessToken: resolverGetAccessToken,
									accessModule: resolverGetAccessModule,
									accessServices: resolverGetInheritAccessServices,
								},
								data: {
									confirmationAction: false,
									permitCriteria: 1,
									redirect: '/dashboard/operations-management/view-proof-disbursement',
								},
								loadComponent() {
									return import('@dashboard/modules/operations-management/view-proof-disbursement-details/template');
								},
							},
							{
								path: 'upload-proof-disbursement',
								canActivate: [guardModulePermissions],
								resolve: {
									accessToken: resolverGetAccessToken,
									accessModule: resolverGetAccessModule,
									accessServices: resolverGetAccessServices,
									roleExecution: resolverGetRoleExecution,
									sessionKey: resolverGetSessionKey,
								},
								loadComponent() {
									return import('@dashboard/modules/operations-management/upload-proof-disbursement/template');
								},
							},
							{
								path: 'confirm-proof-disbursement',
								canActivate: [guardModulePermissions],
								resolve: {
									accessToken: resolverGetAccessToken,
									accessModule: resolverGetAccessModule,
									accessServices: resolverGetAccessServices,
									roleExecution: resolverGetRoleExecution,
									sessionKey: resolverGetSessionKey,
								},
								data: { confirmationAction: true },
								loadComponent() {
									return import('@dashboard/modules/operations-management/view-proof-disbursement/template');
								},
							},
							{
								path: 'confirm-proof-disbursement/details',
								canActivate: [guardQueryParamOperation, guardInheritModulePermissions],
								resolve: {
									accessToken: resolverGetAccessToken,
									accessModule: resolverGetAccessModule,
									accessServices: resolverGetInheritAccessServices,
								},
								data: {
									confirmationAction: true,
									permitCriteria: 1,
									redirect: '/dashboard/operations-management/confirm-proof-disbursement',
								},

								loadComponent() {
									return import('@dashboard/modules/operations-management/view-proof-disbursement-details/template');
								},
							},
						],
					},
				],
			},
		],
	},
];
