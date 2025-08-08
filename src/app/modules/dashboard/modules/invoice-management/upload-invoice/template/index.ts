import { afterRenderEffect, Component, inject, signal, viewChild } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { AccessViewInformation } from '@dashboard/common/extension/access-information-view';
import {
	ApiPostExtractInvoiceData,
	TZipErrorFiles,
	TZipProcessedFiles,
} from '@dashboard/modules/invoice-management/upload-invoice/api/extract-invoice-data';
import { ApiPostUploadInvoices } from '@dashboard/modules/invoice-management/upload-invoice/api/upload-invoices';
import { UploadInvoiceDragInputFiles } from '@dashboard/modules/invoice-management/upload-invoice/components/drag-input-files/drag-input-files';
import { UploadInvoicesProcessedInvoiceItem } from '@dashboard/modules/invoice-management/upload-invoice/components/processed-invoice-item/processed-invoice-item';
import { FrsButtonModule } from '@fresco-ui/frs-button';
import { TFile } from '@fresco-ui/frs-file-input/frs-file-input';
import { ViewCard } from '@shared/components/view-card/view-card';
import { LoadingIcon } from '@shared/icons/loading-icon/loading-icon';
import { LucideAngularModule, SearchCheck, TriangleAlert } from 'lucide-angular';
import { toast } from 'ngx-sonner';
import { timer } from 'rxjs';

@Component({
	selector: 'dashboard-invoice-management-upload-invoices',
	templateUrl: 'index.html',
	providers: [ApiPostExtractInvoiceData, ApiPostUploadInvoices],
	imports: [FrsButtonModule, LoadingIcon, LucideAngularModule, UploadInvoiceDragInputFiles, UploadInvoicesProcessedInvoiceItem, ViewCard],
})
export default class DashboardInvoiceManagementUploadInvoices extends AccessViewInformation {
	private readonly _apiPostExtractInvoiceData = inject(ApiPostExtractInvoiceData);
	private readonly _apiPostUploadInvoices = inject(ApiPostUploadInvoices);
	private readonly _dragFilesComponent = viewChild(UploadInvoiceDragInputFiles);
	private readonly _dragFiles = signal<TFile[]>([]);

	private readonly _extractedInvoiceData = this._apiPostExtractInvoiceData.response;
	private readonly _uploadInvoiceResult = this._apiPostUploadInvoices.response;

	protected readonly _searchIcon = SearchCheck;
	protected readonly _warningIcon = TriangleAlert;
	protected readonly _activeVerificationFiles = signal(false);

	protected readonly _isLoadingApiPostExtractInvoiceData = this._apiPostExtractInvoiceData.isLoading;
	protected readonly _isLoadingApiPostUploadInvoice = this._apiPostUploadInvoices.isLoading;

	protected readonly _errorFiles = signal<TZipErrorFiles[]>([]);
	protected readonly _processedFiles = signal<TZipProcessedFiles[]>([]);

	constructor() {
		super();
		this._addObservables();

		afterRenderEffect(() => {
			this._watchFileChanges();
		});
	}

	private _addObservables(): void {
		toObservable(this._extractedInvoiceData)
			.pipe(takeUntilDestroyed(this._destroyRef))
			.subscribe((extractedData) => {
				if (extractedData) {
					this._errorFiles.set(extractedData.zipFileErrors);
					this._processedFiles.set(extractedData.zipFilesProcessed);
				}
			});

		toObservable(this._uploadInvoiceResult)
			.pipe(takeUntilDestroyed(this._destroyRef))
			.subscribe((result) => {
				if (!result) return;

				if (result.ok) {
					this._errorFiles.set([]);
					this._processedFiles.set([]);
					this._dragFilesComponent()?.clearFiles();

					toast.message('Carga completada', {
						position: 'top-center',
						description: 'Las facturas se han subido con éxito. Revíselas en la sección de visualización.',
					});
				}

				const { error = [] } = result;
				if (!result.ok && (error?.length || 0) > 0) {
					error.forEach((errorItem: { id: string; errors: string[] }, index: number) => {
						timer(index * 500)
							.pipe(takeUntilDestroyed(this._destroyRef))
							.subscribe(() => {
								toast.message(this._getFileNameById(errorItem.id), {
									position: 'top-center',
									description: errorItem.errors[0],
								});
							});
					});
				}
			});
	}

	private _watchFileChanges(): void {
		const dragFiles = this._dragFilesComponent();
		if (dragFiles === undefined) return;
		const files = dragFiles.getFiles()();

		this._activeVerificationFiles.set(files.length > 0);
		this._dragFiles.set(files);
		this._errorFiles.set([]);
		this._processedFiles.set([]);
	}

	protected _getFileNameById(fileId: string): string {
		return this._dragFiles().find((file) => file.fileId === fileId)?.fileName || '';
	}

	protected _onClickExtractInvoiceData(): void {
		if (!this._activeVerificationFiles() || this._isLoadingApiPostExtractInvoiceData()) return;

		this._apiPostExtractInvoiceData.extractInvoiceData({
			accessToken: this._accessToken(),
			accessModule: this._accessModule(),
			accessService: this._accessServices()?.EXTRACT_INVOICE_DATA_SERVICE,
			files: this._dragFiles(),
		});
	}

	protected _onClickUploadInvoices(): void {
		if (this._processedFiles().length === 0) return;

		const filesToUpload = this._dragFiles().filter((file) => {
			const isOkFile = this._processedFiles().some((processedFile) => processedFile.id === file.fileId);
			return isOkFile;
		});

		if (filesToUpload.length === 0) {
			toast.message('No hay facturas validas para enviar', {
				position: 'top-center',
				description: 'Solo se pueden enviar las facturas que no presentan novedades.',
			});

			return;
		}

		this._apiPostUploadInvoices.uploadInvoice({
			accessToken: this._accessToken(),
			accessModule: this._accessModule(),
			accessService: this._accessServices()?.UPLOAD_INVOICE_SERVICE,
			files: filesToUpload,
		});
	}
}
