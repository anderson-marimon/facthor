import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { StoreUserConfig } from '@dashboard/stores/user-config';
import { toast } from 'ngx-sonner';
import { map } from 'rxjs/operators';

export const guardModulePermissions: CanActivateFn = (_, state) => {
	const router = inject(Router);
	const storeUserConfig = inject(StoreUserConfig);

	return storeUserConfig.hasAccess(state.url).pipe(
		map((hasAccess) => {
			if (!hasAccess) {
				toast.message('Acceso denegado', {
					description: 'No posees los permisos necesarios, contacta al equipo de soporte.',
				});

				return router.createUrlTree(['/dashboard/home']);
			}

			return hasAccess;
		})
	);
};
