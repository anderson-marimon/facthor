import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { stat } from 'fs';

export const guardQueryParamOperation: CanActivateFn = (state): boolean | UrlTree => {
	const router = inject(Router);
	const { operation } = state.queryParams as { operation: string };
	const redirect = state.routeConfig?.data?.['redirect'];

	const intRegex = /^[1-9]\d*$/;

	if (!intRegex.test(operation)) {
		return router.createUrlTree([redirect || '/dashboard/home']);
	}

	return true;
};
