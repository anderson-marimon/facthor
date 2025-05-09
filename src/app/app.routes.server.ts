import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
	{ path: '', renderMode: RenderMode.Server },
	{ path: 'auth/', renderMode: RenderMode.Server },
	{ path: 'auth/sign-up', renderMode: RenderMode.Server },
];
