import { Component } from '@angular/core';
import { GenTable } from '@shared/components/gen-table/gen-table';

@Component({
	selector: 'dashboard-invoice-management',
	templateUrl: 'index.html',
	imports: [GenTable],
})
export default class DashboardInvoiceManagement {
	protected readonly _headers = [
		'n. de factura',
		'negociación',
		'emisor',
		'pagador',
		'estado',
		'expedición',
		'vencimiento',
		'valor',
		'observación',
	];
}
