import type { Routes } from '@angular/router';
import AuthLayout from './layout';
import SignUpPage from './modules/sign-up/view';

export const authRoutes: Routes = [
	{
		path: '',
		component: AuthLayout,
		children: [
			{
				path: '',
				redirectTo: 'sign-up',
				pathMatch: 'full',
			},
			{
				path: 'sign-up',
				component: SignUpPage,
			},
		],
	},
];
