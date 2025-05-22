import { Component } from '@angular/core';
import { AsideLink } from '@dashboard/components/aside-nav/aside-link/aside-link';
import { FacthorLogo } from '@shared/logos/facthor-logo/facthor-logo';
import { FileClock, Handshake, NotebookPen, ReceiptText, TableProperties } from 'lucide-angular';

type TAsideRoutes = {
	icon: any;
	label: string;
	href: string;
	subRoutes?: {
		label: string;
		href: string;
		type: 'link' | 'separator';
	}[];
};

const ASIDE_ROUTES: TAsideRoutes[] = [
	{
		icon: ReceiptText,
		label: 'administrador de facturas',
		href: '',
		subRoutes: [
			{ type: 'link', label: 'facturas subidas', href: '' },
			{ type: 'link', label: 'subir facturas', href: '' },
		],
	},
	{
		icon: Handshake,
		label: 'gestión de operaciones',
		href: '',
		subRoutes: [
			{ type: 'link', label: 'ver operaciones', href: '' },
			{ type: 'link', label: 'crear operación', href: '' },
			{ type: 'link', label: 'aprobar operación', href: '' },
			{ type: 'separator', label: 'pagos', href: '' },
			{ type: 'link', label: 'ver comprobantes', href: '' },
			{ type: 'link', label: 'confirmaciones', href: '' },
		],
	},
	{
		icon: TableProperties,
		label: 'gestión de parámetros',
		href: '',
		subRoutes: [{ type: 'link', label: 'ver parámetros', href: '' }],
	},
	{
		icon: FileClock,
		label: 'historial de operaciones',
		href: '',
		subRoutes: [
			{ type: 'link', label: 'financiadores', href: '' },
			{ type: 'link', label: 'pagadores', href: '' },
		],
	},
	{ icon: NotebookPen, label: 'gestión de informes', href: '', subRoutes: [{ type: 'link', label: 'informe general', href: '' }] },
];

@Component({
	selector: 'aside-nav',
	templateUrl: 'aside-nav.html',
	imports: [FacthorLogo, AsideLink],
})
export class AsideNav {
	protected readonly _asideRoutes = ASIDE_ROUTES;
}
