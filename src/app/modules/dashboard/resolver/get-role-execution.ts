import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { TRoleExecution } from '@dashboard/api/user-configuration';
import { StoreUserConfig } from '@dashboard/stores/user-config';

export const resolverGetRoleExecution: ResolveFn<TRoleExecution> = (_, state) => {
	const storeUserConfig = inject(StoreUserConfig);
	return storeUserConfig.getRoleExecutionByRoute(state.url);
};
