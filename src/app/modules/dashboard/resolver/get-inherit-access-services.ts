import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { TAccessServices } from '@dashboard/common/enums/services';
import { StoreUserConfig } from '@dashboard/stores/user-config';

export const resolverGetInheritAccessServices: ResolveFn<TAccessServices> = (_, state) => {
	const storeUserConfig = inject(StoreUserConfig);

	let url = state.url.split('?')[0];
	const segments = url.split('/').filter(Boolean);

	if (segments.length > 1) {
		segments.pop();
	}

	url = '/' + segments.join('/');

	return storeUserConfig.getServicesByRoute(url) as TAccessServices;
};
