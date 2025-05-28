import { Component, input } from '@angular/core';
import { FileArchive, LucideAngularModule } from 'lucide-angular';

@Component({
	selector: 'upload-invoice-file-item',
	templateUrl: 'file-item.html',
	imports: [LucideAngularModule],
})
export class UploadInvoiceFileItem {
	public readonly fileName = input('');
	public readonly fileSize = input(0);
	protected readonly _fileIcon = FileArchive;
}
