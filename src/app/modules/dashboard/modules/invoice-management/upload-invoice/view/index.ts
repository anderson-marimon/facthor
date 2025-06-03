import { afterRenderEffect, Component, DestroyRef, inject, signal, viewChild } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { TAccessServices } from '@dashboard/common/enums/enum-services';
import {
	ApiPostExtractInvoiceData,
	TZipErrorFiles,
	TZipProcessedFiles,
} from '@dashboard/modules/invoice-management/upload-invoice/api/extract-invoice-data';
import { UploadInvoiceDragInputFiles } from '@dashboard/modules/invoice-management/upload-invoice/components/drag-input-files/drag-input-files';
import { UploadInvoicesProcessedInvoiceItem } from '@dashboard/modules/invoice-management/upload-invoice/components/processed-invoice-item/processed-invoice-item';
import { UploadInvoiceViewCard } from '@dashboard/modules/invoice-management/upload-invoice/components/view-card/view-card';
import { FrsButtonModule } from '@fresco-ui/frs-button';
import { LoadingIcon } from '@shared/icons/loading-icon/loading-icon';
import { LucideAngularModule, SearchCheck } from 'lucide-angular';

@Component({
	selector: 'dashboard-invoice-management',
	templateUrl: 'index.html',
	viewProviders: [ApiPostExtractInvoiceData],
	imports: [
		FrsButtonModule,
		LoadingIcon,
		LucideAngularModule,
		UploadInvoiceDragInputFiles,
		UploadInvoicesProcessedInvoiceItem,
		UploadInvoiceViewCard,
	],
})
export default class DashboardInvoiceManagement {
	private readonly _destroyRef = inject(DestroyRef);
	private readonly _activateRoute = inject(ActivatedRoute);
	private readonly _apiPostExtractInvoiceData = inject(ApiPostExtractInvoiceData);
	private readonly _dragFilesComponent = viewChild(UploadInvoiceDragInputFiles);
	private readonly _accessToken = signal('');
	private readonly _accessModule = signal('');
	private readonly _accessServices = signal<Nullable<TAccessServices>>(null);
	private readonly _extractedInvoiceData = this._apiPostExtractInvoiceData.extractedInvoiceData;

	protected readonly _searchIcon = SearchCheck;
	protected readonly _activeVerificationFiles = signal(false);
	protected readonly _isLoadingApiPostExtractInvoiceData = this._apiPostExtractInvoiceData.isLoading;
	protected readonly _errorFiles = signal<TZipErrorFiles[]>([]);
	protected readonly _processedFiles = signal<TZipProcessedFiles[]>([]);

	constructor() {
		this._addSubscription();
		this._addObservable();

		afterRenderEffect(() => {
			this._watchFileChanges();
		});
	}

	private _addSubscription(): void {
		this._activateRoute.data.pipe(takeUntilDestroyed(this._destroyRef)).subscribe((data) => {
			this._accessToken.set(data['accessToken']);
			this._accessModule.set(data['accessModule']);
			this._accessServices.set(data['accessServices']);
		});
	}

	private _addObservable(): void {
		toObservable(this._extractedInvoiceData)
			.pipe(takeUntilDestroyed(this._destroyRef))
			.subscribe((extractedData) => {
				if (extractedData) {
					this._errorFiles.set(extractedData.zipFileErrors);
					this._processedFiles.set(extractedData.zipFilesProcessed);
				}
			});
	}

	private _watchFileChanges(): void {
		const dragFiles = this._dragFilesComponent();
		if (dragFiles === undefined) return;
		this._activeVerificationFiles.set(dragFiles.getFiles()().length > 0);
		this._errorFiles.set([]);
		this._processedFiles.set([]);
	}

	protected _getFileNameById(fileId: string): string {
		const fileName =
			this._dragFilesComponent()
				?.getFiles()()
				.find((file) => file.fileId === fileId)?.fileName || '';

		return fileName;
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
