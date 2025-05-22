import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { envs } from '@envs/envs';
import Cookies from 'js-cookie';

export const guardAccessToken: CanActivateFn = (): boolean | UrlTree => {
	const router: Router = inject(Router);
	const tokenPath = envs.FT_AUTHENTICATION_TOKEN_PATH;
	const tokenExists = !!Cookies.get(tokenPath);

	const backPath = () => {
		Cookies.remove(tokenPath);
		return router.createUrlTree(['/authentication/sign-in']);
	};

	if (!tokenExists) return backPath();

	const token = Cookies.get(tokenPath);
	const jwtRegex = /^[A-Za-z0-9\-_]+?\.[A-Za-z0-9\-_]+?\.[A-Za-z0-9\-_]+?$/;

	if (!token || !jwtRegex.test(token)) return backPath();

	return true;
};
