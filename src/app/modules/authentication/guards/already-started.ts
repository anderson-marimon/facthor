import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { envs } from '@app/envs/envs';
import Cookies from 'js-cookie';

export const guardAlreadyStarted: CanActivateFn = (): boolean | UrlTree => {
	const router = inject(Router);
	const tokenPath = envs.FT_AUTHENTICATION_TOKEN_PATH;

	const token = Cookies.get(tokenPath);
	const jwtRegex = /^[A-Za-z0-9\-_]+?\.[A-Za-z0-9\-_]+?\.[A-Za-z0-9\-_]+?$/;

	if (token && jwtRegex.test(token)) {
		return router.createUrlTree(['/dashboard/home']);
	}

	if (token) {
		Cookies.remove(tokenPath);
	}

	return true;
};
