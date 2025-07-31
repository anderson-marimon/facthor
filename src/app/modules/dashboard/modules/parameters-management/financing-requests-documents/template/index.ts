import { Component, inject, signal } from '@angular/core';
import { AccessViewInformation } from '@dashboard/common/extension/access-information-view';
import { CommonModule } from '@angular/common';
import { EmptyResult } from '@shared/components/empty-result/empty-result';
import { GeneralLoader } from '@shared/components/general-loader/general-loader';
import { ERoleExecution } from '@dashboard/common/enums/role-execution';
import { FrsButtonModule } from '@fresco-ui/frs-button';
import { TApiGetFinancierOperationsHistoryQuerySignalParams } from '@dashboard/modules/operation-history-management/financier-history/api/get-financier-operations-history';
import { ApiGetFinancingRequestDocuments } from '@dashboard/modules/parameters-management/financing-requests-documents/api/get-financing-request-documents';
import { LucideAngularModule, RefreshCcw } from 'lucide-angular';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LoadingIcon } from '@shared/icons/pdf-icon/pdf-icon';
import { ViewCard } from '@shared/components/view-card/view-card';
import { ApiGetFinancingRequestDocumentFile } from '@dashboard/modules/parameters-management/financing-requests-documents/api/get-financing-requests-document-file';
import { FrsDialogRef } from '@fresco-ui/frs-dialog/frs-service';
import { ModalLegalDocumentFile } from '@dashboard/modules/parameters-management/financing-requests-documents/components/modal-legal-document-file/modal-legal-document-file';

const HEADERS = [
	'razón social',
	'tipo de documento',
	'n. documento',
	'nombre comercial',
	'correo electrónico',
	'estado',
	'representante legal',
	'fecha',
	'documentos',
	'acciones',
];

@Component({
	selector: 'parameters-management-financing-requests-documents',
	templateUrl: 'index.html',
	providers: [ApiGetFinancingRequestDocuments, ApiGetFinancingRequestDocumentFile],
	imports: [CommonModule, EmptyResult, FrsButtonModule, GeneralLoader, LucideAngularModule, LoadingIcon, ViewCard],
})
export default class ParametersManagementFinancingRequestDocuments extends AccessViewInformation {
	private readonly _dialogRef = inject(FrsDialogRef);
	private readonly _apiGetFinancingRequestDocuments = inject(ApiGetFinancingRequestDocuments);
	private readonly _apiGetFinancingRequestDocumentFile = inject(ApiGetFinancingRequestDocumentFile);
	private readonly _providerId = signal(0);
	private readonly _documentSelected = signal(0);

	protected readonly _getFinancingRequestDocumentsParams = signal<Partial<TApiGetFinancierOperationsHistoryQuerySignalParams>>({});

	protected readonly _financingRequests = this._apiGetFinancingRequestDocuments.response;
	protected readonly _isLoadingApiGetFinancingRequestDocuments = this._apiGetFinancingRequestDocuments.isLoading;

	protected readonly _financingRequestsDocumentFile = this._apiGetFinancingRequestDocumentFile.response;
	protected readonly _isLoadingApiGetFinancingRequestsDocumentFile = this._apiGetFinancingRequestDocumentFile.isLoading;

	protected readonly _headers = HEADERS;
	protected readonly _eRoleExecution = ERoleExecution;
	protected readonly _resetFilterIcon = RefreshCcw;

	constructor() {
		super();
		this._getQueryParams();
		this._getInitFinancingRequestDocuments();
	}

	private _getQueryParams(): void {
		this._activateRoute.queryParams.pipe(takeUntilDestroyed(this._destroyRef)).subscribe(({ provider = 0 }) => {
			this._providerId.set(provider);
		});
	}

	protected _getFinancingRequestDocumentFile(): void {
		this._apiGetFinancingRequestDocumentFile.getFinancingRequestDocumentFile({
			accessToken: this._accessToken(),
			accessModule: this._accessModule(),
			accessService: this._accessServices()?.VIEW_BUSINESS_LEGAL_DOCUMENT,
			IdDocument: this._documentSelected(),
		});
	}

	protected _resetFinancingRequestDocumentFile(): void {
		this._apiGetFinancingRequestDocumentFile.reset();
	}

	private _getInitFinancingRequestDocuments(): void {
		this._getFinancingRequestDocumentsParams.set({
			accessToken: this._accessToken(),
			accessModule: this._accessModule(),
			accessService: this._accessServices()?.GET_BUSINESS_LEGAL_DOCUMENTS,
			IdBusiness: this._providerId(),
		});

		this._apiGetFinancingRequestDocuments.getFinancingRequestDocuments(this._getFinancingRequestDocumentsParams());
	}

	protected _onClickViewPdf(documentId: number): void {
		this._documentSelected.set(documentId);

		this._dialogRef.openDialog({
			title: 'Modal para visualizar pdf',
			content: ModalLegalDocumentFile,
			data: {
				fnGetProofDisbursementFile: this._getFinancingRequestDocumentFile.bind(this),
				fnResetFile: this._resetFinancingRequestDocumentFile.bind(this),
				file: this._financingRequestsDocumentFile,
				isLoadingFile: this._isLoadingApiGetFinancingRequestsDocumentFile,
			},
		});
	}
}