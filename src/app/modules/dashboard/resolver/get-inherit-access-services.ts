import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { TAccessServices } from '@dashboard/common/enums/services';
import { StoreUserConfig } from '@dashboard/stores/user-config';
import { toast } from 'ngx-sonner';

export const resolverGetInheritAccessServices: ResolveFn<TAccessServices | null> = (snapShot, state) => {
	const storeUserConfig = inject(StoreUserConfig);

	const criteria = Number(snapShot.routeConfig?.data?.['permitCriteria'] ?? 0);
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
		return null;
	}

	const pathToCheck = pathsToCheck[index];
	return storeUserConfig.getServicesByRoute(pathToCheck) as TAccessServices;
};
