import { afterRenderEffect, Component, inject, signal, viewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TAccessServices } from '@dashboard/common/enums/enum-services';
import { ApiPostExtractInvoiceData } from '@dashboard/modules/invoice-management/upload-invoice/api/extract-invoice-data';
import { UploadInvoiceDragInputFiles } from '@dashboard/modules/invoice-management/upload-invoice/components/drag-input-files/drag-input-files';
import { UploadInvoiceViewCard } from '@dashboard/modules/invoice-management/upload-invoice/components/view-card/view-card';
import { FrsButtonModule } from '@fresco-ui/frs-button';
import { LoadingIcon } from '@shared/icons/loading-icon/loading-icon';
import { LucideAngularModule, SearchCheck } from 'lucide-angular';

@Component({
	selector: 'dashboard-invoice-management',
	templateUrl: 'index.html',
	viewProviders: [ApiPostExtractInvoiceData],
	imports: [FrsButtonModule, LoadingIcon, LucideAngularModule, UploadInvoiceDragInputFiles, UploadInvoiceViewCard],
})
export default class DashboardInvoiceManagement {
	private readonly _activateRoute = inject(ActivatedRoute);
	private readonly _apiPostExtractInvoiceData = inject(ApiPostExtractInvoiceData);
	private readonly _accessToken = signal('');
	private readonly _accessModule = signal('');
	private readonly _accessServices = signal<Nullable<TAccessServices>>(null);
	private readonly _dragFilesComponent = viewChild(UploadInvoiceDragInputFiles);
	private readonly _extractedInvoiceData = this._apiPostExtractInvoiceData.revisionData;

	protected readonly _isLoadingApiPostExtractInvoiceData = this._apiPostExtractInvoiceData.isLoading;
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
			this._accessToken.set(data['accessToken']);
			this._accessModule.set(data['accessModule']);
			this._accessServices.set(data['accessServices']);
		});
	}

	private _addObservable(): void {
		const dragFiles = this._dragFilesComponent();
		if (dragFiles === undefined) return;
		this._activeVerificationFiles.set(dragFiles.getFiles()().length > 0);
	}

	protected _onClickExtractInvoiceData(): void {
		if (!this._activeVerificationFiles() || this._isLoadingApiPostExtractInvoiceData()) return;

		this._apiPostExtractInvoiceData.extractInvoiceData({
			accessToken: this._accessToken(),
			accessModule: this._accessModule(),
			accessService: this._accessServices()?.EXTRACT_INVOICE_DATA_SERVICE || '',
			files: this._dragFilesComponent()!.getFiles()(),
		});
	}
}
