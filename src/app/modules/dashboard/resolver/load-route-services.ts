import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { StoreUserConfig } from '@dashboard/stores/user-config';

export const resolverLoadRouteServices: ResolveFn<Record<string, string>> = (_, state) => {
	const storeUserConfig = inject(StoreUserConfig);
	return storeUserConfig.getServicesByRoute(state.url);
};
