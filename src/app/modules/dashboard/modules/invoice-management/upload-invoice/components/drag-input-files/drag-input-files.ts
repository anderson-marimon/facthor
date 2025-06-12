import { animate, style, transition, trigger } from '@angular/animations';
import { Component, inject, signal, WritableSignal } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ViewCard } from '@shared/components/view-card/view-card';
import { FrsButtonModule } from '@fresco-ui/frs-button';
import { FrsFileInputModule } from '@fresco-ui/frs-file-input';
import { TFile } from '@fresco-ui/frs-file-input/frs-file-input';
import { FacthorLogoAnimated } from '@shared/logos/facthor-logo-animated/facthor-logo-animated';
import { FolderArchive, LucideAngularModule, Trash, Upload } from 'lucide-angular';
import { toast } from 'ngx-sonner';
import { timer } from 'rxjs';

@Component({
	selector: 'upload-invoice-drag-input-files',
	templateUrl: 'drag-input-files.html',
	animations: [
		trigger('listItemAnimation', [
			transition(':enter', [style({ opacity: 0 }), animate('200ms ease-out', style({ opacity: 1 }))]),
			transition(':leave', [
				style({ overflow: 'hidden' }),
				animate('150ms linear', style({ opacity: 0 })),
				animate('150ms 150ms ease-in', style({ height: 0 })),
			]),
		]),
	],
	imports: [FacthorLogoAnimated, FrsButtonModule, FrsFileInputModule, LucideAngularModule, ViewCard],
})
export class UploadInvoiceDragInputFiles {
	private readonly _formBuilder = inject(FormBuilder);

	protected readonly _allowedTypes = ['application/zip', 'application/x-zip-compressed', 'application/vnd.rar'];
	protected readonly _files = signal<TFile[]>([]);
	protected readonly _uploadIcon = Upload;
	protected readonly _fileIcon = FolderArchive;
	protected readonly _trashIcon = Trash;
	protected readonly _loading = signal(false);
	protected readonly _fileControl = this._formBuilder.control<TFile[]>([]);

	protected _onUploadFiles(files: TFile[]): void {
		const currentFiles = this._files() || [];

		if (currentFiles.length >= 5) {
			toast.message('Límite alcanzado', {
				description: 'Solo puedes subir hasta 5 facturas. Elimina algunas para agregar más.',
			});
			return;
		}

		const newFiles = files.filter((file) => !currentFiles.some((existing) => existing.fileName === file.fileName));

		if (newFiles.length === 0) {
			toast.message('Archivos duplicados', {
				description: 'Todos los archivos que intentaste subir ya fueron agregados.',
			});
			return;
		}

		const combinedFiles = currentFiles.concat(newFiles);
		const finalFiles = combinedFiles.slice(0, 5).map((file) => ({ ...file, fileId: crypto.randomUUID() }));
		this._loading.set(true);

		timer(2500).subscribe(() => {
			this._files.set(finalFiles);
			this._loading.set(false);

			if (combinedFiles.length > 5) {
				toast.message('Límite alcanzado', {
					description: 'Solo puedes subir hasta 5 facturas. El resto fue omitido.',
				});
			}
		});
	}

	protected _onErrorTypes(fileName: string): void {
		toast.message('Tipo de archivo no permitido', {
			description: `El archivo "${fileName}" no tiene un formato válido. Solo se permiten archivos .zip o .rar.`,
		});
	}

	protected _onClickRemoveFile(fileName: string): void {
		const filteredFiles = this._files().filter((file) => file.fileName !== fileName);
		this._files.set(filteredFiles);
	}

	public getFiles(): WritableSignal<TFile[]> {
		return this._files;
	}

	public clearFiles(): void {
		this._files.set([]);
	}
}
