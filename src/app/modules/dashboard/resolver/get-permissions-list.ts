import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { TModulePermission } from '@dashboard/api/user-configuration';
import { StoreUserConfig } from '@dashboard/stores/user-config';

export const resolverGetPermissionList: ResolveFn<TModulePermission[]> = () => {
	const storeUserConfig = inject(StoreUserConfig);
	return storeUserConfig.getPermissionList();
};
