import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
	selector: 'dashboard-invoice-management',
	templateUrl: 'index.html',
	imports: [],
})
export default class DashboardInvoiceManagement implements OnInit {
	private readonly _router = inject(Router);
	private readonly _activateRoute = inject(ActivatedRoute);
	private readonly _services = signal<Record<string, string>>({});

	public ngOnInit(): void {
		this._activateRoute.data.subscribe((data) => {
			this._services.set(data['services']);
		});
	}
}
