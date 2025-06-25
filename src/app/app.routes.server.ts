import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
	{ path: '', renderMode: RenderMode.Server },

	{ path: 'dashboard', renderMode: RenderMode.Server },
	{ path: 'dashboard/home', renderMode: RenderMode.Server },

	{ path: 'dashboard/invoice-management', renderMode: RenderMode.Server },
	{ path: 'dashboard/invoice-management/upload-invoice', renderMode: RenderMode.Server },
	{ path: 'dashboard/invoice-management/view-upload-invoice', renderMode: RenderMode.Server },

	{ path: 'dashboard/operations-management', renderMode: RenderMode.Server },
	{ path: 'dashboard/operations-management/view-operations', renderMode: RenderMode.Server },
	{ path: 'dashboard/operations-management/view-operations/details', renderMode: RenderMode.Server },
	{ path: 'dashboard/operations-management/approve-operations', renderMode: RenderMode.Server },
	{ path: 'dashboard/operations-management/create-operation', renderMode: RenderMode.Server },

	{ path: 'authentication/', renderMode: RenderMode.Server },
	{ path: 'authentication/sign-in', renderMode: RenderMode.Server },
	{ path: 'authentication/sign-up', renderMode: RenderMode.Server },
	{ path: 'authentication/forgot-password', renderMode: RenderMode.Server },
	{ path: 'authentication/change-password', renderMode: RenderMode.Server },
	{ path: 'authentication/resend-documents', renderMode: RenderMode.Server },

	{ path: '**', renderMode: RenderMode.Server },
];
