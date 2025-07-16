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
		return router.createUrlTree(['/dashboard/home']);
	}

	const criteria = Number(snapShot.routeConfig?.data?.['permitCriteria'] ?? 1);
	const url = state.url.split('?')[0];
	const segments = url.split('/').filter(Boolean);

	const pathsToCheck: string[] = [];
	for (let i = segments.length; i >= 1; i--) {
		const path = '/' + segments.slice(0, i).join('/');
		pathsToCheck.push(path);
	}

	const index = criteria;

	if (isNaN(index) || index < 0 || index >= pathsToCheck.length) {
		toast.message('Error de validación', {
			description: 'Configuración de permisos inválida en la ruta.',
		});
		return router.createUrlTree(['/dashboard/home']);
	}

	const pathToCheck = pathsToCheck[index];

	return storeUserConfig.hasAccess(pathToCheck).pipe(
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
