import { afterRenderEffect, Component, inject, input, signal, viewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UploadInvoiceDragInputFiles } from '@dashboard/modules/invoice-management/upload-invoice/components/drag-input-files/drag-input-files';
import { UploadInvoiceViewCard } from '@dashboard/modules/invoice-management/upload-invoice/components/view-card/view-card';
import { FrsButtonModule } from '@fresco-ui/frs-button';
import { LucideAngularModule, SearchCheck } from 'lucide-angular';

@Component({
	selector: 'dashboard-invoice-management',
	templateUrl: 'index.html',
	imports: [FrsButtonModule, LucideAngularModule, UploadInvoiceDragInputFiles, UploadInvoiceViewCard],
})
export default class DashboardInvoiceManagement {
	public readonly variable = input('');
	private readonly _activateRoute = inject(ActivatedRoute);
	private readonly _services = signal<Record<string, string>>({});
	private readonly _dragFiles = viewChild(UploadInvoiceDragInputFiles);

	protected readonly _searchIcon = SearchCheck;
	protected readonly _activeVerificationFiles = signal(false);

	constructor() {
		this._addSubscription();

		afterRenderEffect(() => {
			this._addObservable();
		});
	}

	private _addSubscription(): void {
		this._activateRoute.data.subscribe((data) => {
			this._services.set(data['services']);
		});
	}

	private _addObservable(): void {
		const dragFiles = this._dragFiles();
		if (dragFiles === undefined) return;
		this._activeVerificationFiles.set(dragFiles.getFiles()().length > 0);
	}
}
