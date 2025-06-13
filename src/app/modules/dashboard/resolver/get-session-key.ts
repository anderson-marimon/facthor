import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { StoreUserConfig } from '@dashboard/stores/user-config';

export const resolverGetSessionKey: ResolveFn<string> = () => {
	const storeUserConfig = inject(StoreUserConfig);
	return storeUserConfig.getSessionKey();
};
