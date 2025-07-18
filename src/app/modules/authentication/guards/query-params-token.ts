import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { inject } from '@angular/core';

export const guardQueryParamsToken: CanActivateFn = (state): boolean | UrlTree => {
	const router: Router = inject(Router);
	const { token } = state.queryParams as { token: string };

	const jwtRegex = /^[A-Za-z0-9\-_]+?\.[A-Za-z0-9\-_]+?\.[A-Za-z0-9\-_]+?$/;

	if (!token || !jwtRegex.test(token)) {
		return router.createUrlTree(['/authentication/sign-in']);
	}

	return true;
};
