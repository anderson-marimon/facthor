import { Component, inject, input, Signal, signal } from '@angular/core';
import { UploadProofDisbursementDragInputFiles } from '@dashboard/modules/operations-management/upload-proof-disbursement/components/drag-input-files/drag-input-files';
import { FormBuilder } from '@angular/forms';
import { TFile } from '@fresco-ui/frs-file-input/frs-file-input';
import { FrsButtonDirective } from '@fresco-ui/frs-button/frs-button';
import { LoadingIcon } from '@shared/icons/loading-icon/loading-icon';
import { getBase64FromTFile } from '@shared/utils/get-base64-from-t-file';

type ModalProps = {
	fnUploadProofDisbursementFinancier: (params: { description: string; proofDisbursement: string }) => void;
	isLoadingApiPostUploadProofDisbursementFinancier: Signal<boolean>;
};

@Component({
	selector: 'upload-proof-disbursement-modal',
	templateUrl: 'upload-proof-disbursement-modal.html',
	imports: [UploadProofDisbursementDragInputFiles, FrsButtonDirective, LoadingIcon],
})
export default class UploadProofDisbursementModal {
	public readonly data = input.required<ModalProps>();
	public readonly closeDialog = input<() => void>();

	private readonly _formBuilder = inject(FormBuilder);

	protected readonly _files = signal<TFile[]>([]);
	protected readonly _control = this._formBuilder.control('');

	protected _onUploadFiles(files: TFile[]): void {
		this._files.set(files);
	}

	protected _onClickCancel(): void {
		this.closeDialog()!();
	}

	protected _onClickUploadProofDisbursement(): void {
		const { fnUploadProofDisbursementFinancier, isLoadingApiPostUploadProofDisbursementFinancier } = this.data();

		if (isLoadingApiPostUploadProofDisbursementFinancier() || !this._files()[0]) return;

		fnUploadProofDisbursementFinancier({
			proofDisbursement: getBase64FromTFile(this._files()[0]),
			description: this._control.value?.trim() || 'Sin comentarios',
		});
	}
}