import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { CanActivateFn, Router } from '@angular/router';
import { ApiGetUserConfiguration } from '@dashboard/api/user-configuration';
import { StoreUserConfig } from '@dashboard/stores/user-config';
import { envs } from '@envs/envs';
import Cookies from 'js-cookie';
import { filter, firstValueFrom } from 'rxjs';

export const resolverLoadUserConfig: CanActivateFn = async () => {
	const router = inject(Router);
	const pathToken = envs.FT_AUTHENTICATION_TOKEN_PATH;
	const storeUserConfig = inject(StoreUserConfig);
	const apiGetUserConfig = inject(ApiGetUserConfiguration);
	const userConfigObservable = toObservable(apiGetUserConfig.configuration);

	apiGetUserConfig.getUserConfiguration();
	const userConfig = await firstValueFrom(userConfigObservable.pipe(filter(Boolean)));

	if (userConfig) {
		await storeUserConfig.loadUserConfig(userConfig);
		return true;
	}

	Cookies.remove(pathToken);
	return router.createUrlTree(['/authentication/sign-in']);
};
