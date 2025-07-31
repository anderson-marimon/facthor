import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';

export const guardQueryParamProvider: CanActivateFn = (state): boolean | UrlTree => {
	const router = inject(Router);
	const { provider } = state.queryParams as { provider: string };
	const redirect = state.routeConfig?.data?.['redirect'];

	const intRegex = /^[1-9]\d*$/;

	if (!intRegex.test(provider)) {
		return router.createUrlTree([redirect || '/dashboard/home']);
	}

	return true;
};
