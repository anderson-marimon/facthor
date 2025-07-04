import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { TRoleExecution } from '@dashboard/api/user-configuration';
import { StoreUserConfig } from '@dashboard/stores/user-config';

export const resolverGetRoleExecution: ResolveFn<TRoleExecution> = () => {
	const storeUserConfig = inject(StoreUserConfig);
	return storeUserConfig.getRoleExecution();
};
