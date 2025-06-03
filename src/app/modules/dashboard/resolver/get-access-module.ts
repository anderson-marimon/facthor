import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { StoreUserConfig } from '@dashboard/stores/user-config';

export const resolverGetAccessModule: ResolveFn<string> = (_, state) => {
	const storeUserConfig = inject(StoreUserConfig);
	return storeUserConfig.getModuleByRoute(state.url);
};
