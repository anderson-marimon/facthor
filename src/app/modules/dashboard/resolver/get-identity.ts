import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { TIdentity } from '@dashboard/api/user-configuration';
import { StoreUserConfig } from '@dashboard/stores/user-config';

export const resolverGetIdentity: ResolveFn<TIdentity> = () => {
	const storeUserConfig = inject(StoreUserConfig);
	return storeUserConfig.getIdentity();
};
