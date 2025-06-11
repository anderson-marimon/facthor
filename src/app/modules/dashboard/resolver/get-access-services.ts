import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { TAccessServices } from '@dashboard/common/enums/services';
import { StoreUserConfig } from '@dashboard/stores/user-config';

export const resolverGetAccessServices: ResolveFn<TAccessServices> = (_, state) => {
	const storeUserConfig = inject(StoreUserConfig);
	return storeUserConfig.getServicesByRoute(state.url) as TAccessServices;
};
