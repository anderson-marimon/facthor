import { afterNextRender, Component, computed, input, OnDestroy, Signal } from '@angular/core';
import { GeneralLoader } from '@shared/components/general-loader/general-loader';
import { PdfViewerModule } from 'ng2-pdf-viewer';

type ModalData = {
	fnGetProofDisbursementFile: () => void;
	fnResetFile: () => void;
	isLoadingFile: Signal<boolean>;
	file: Signal<string>;
};

@Component({
	selector: 'modal-proof-disbursement-file',
	templateUrl: 'modal-proof-disbursement-file.html',
	imports: [GeneralLoader, PdfViewerModule],
})
export class ModalProofDisbursementFile implements OnDestroy {
	public readonly data = input.required<ModalData>();
	public readonly closeDialog = input<() => void>();
	public readonly zoom = computed(() => (window?.innerWidth < 768 ? 0.8 : 1));

	constructor() {
		afterNextRender(() => {
			this.data().fnGetProofDisbursementFile();
		});
	}

	public ngOnDestroy(): void {
		this.data().fnResetFile();
	}
}
