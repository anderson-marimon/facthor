import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';

export const guardQueryParamOperation: CanActivateFn = (state): boolean | UrlTree => {
	const router = inject(Router);
	const { operation } = state.queryParams as { operation: string };

	const intRegex = /^[1-9]\d*$/;

	if (!intRegex.test(operation)) {
		return router.createUrlTree(['/dashboard/operations-management/view-operations']);
	}

	return true;
};
