import { Component, computed, input } from '@angular/core';
import { PdfViewerModule } from 'ng2-pdf-viewer';

@Component({
	selector: 'preview-pdf',
	imports: [PdfViewerModule],
	templateUrl: 'preview-pdf.html',
})
export class PreviewPdf {
	public readonly data = input<string>('');
	public readonly closeDialog = input(() => {});
	public readonly zoom = computed(() => (window?.innerWidth < 768 ? 0.8 : 1));
}
