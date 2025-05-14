import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
	{ path: '', renderMode: RenderMode.Server },
	{ path: 'authentication/', renderMode: RenderMode.Server },
	{ path: 'authentication/sign-in', renderMode: RenderMode.Server },
	{ path: 'authentication/sign-up', renderMode: RenderMode.Server },
	{ path: 'authentication/forgot-password', renderMode: RenderMode.Server },
];
