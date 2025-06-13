import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { StoreUserConfig } from '@dashboard/stores/user-config';
import { toast } from 'ngx-sonner';
import { map } from 'rxjs/operators';

export const guardInheritModulePermissions: CanActivateFn = (snapShot, state) => {
	const router = inject(Router);
	const storeUserConfig = inject(StoreUserConfig);
	const { session = '' } = snapShot.queryParams as { session: string };
	const sessionKey = storeUserConfig.getSessionKey();

	if (session !== sessionKey) {
		return router.createUrlTree(['/dashboard/operations-management/view-operations']);
	}

	let url = state.url.split('?')[0];
	const segments = url.split('/').filter(Boolean);

	if (segments.length > 1) {
		segments.pop();
	}

	url = '/' + segments.join('/');

	return storeUserConfig.hasAccess(url).pipe(
		map((hasAccess) => {
			if (!hasAccess) {
				toast.message('Acceso denegado', {
					description: 'No posees los permisos necesarios, contacta al equipo de soporte.',
				});
				return router.createUrlTree(['/dashboard/home']);
			}
			return true;
		})
	);
};
