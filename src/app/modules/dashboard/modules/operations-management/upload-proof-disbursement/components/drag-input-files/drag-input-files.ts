import { animate, style, transition, trigger } from '@angular/animations';
import { Component, DestroyRef, inject, input, output, signal } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { FrsButtonModule } from '@fresco-ui/frs-button';
import { FrsFileInputModule } from '@fresco-ui/frs-file-input';
import { TFile } from '@fresco-ui/frs-file-input/frs-file-input';
import { GeneralLoader } from '@shared/components/general-loader/general-loader';
import { ViewCard } from '@shared/components/view-card/view-card';
import { FolderArchive, LucideAngularModule, Trash, Upload } from 'lucide-angular';
import { toast } from 'ngx-sonner';
import { timer } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
	selector: 'upload-proof-disbursement-drag-input-files',
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
	imports: [FrsButtonModule, FrsFileInputModule, GeneralLoader, LucideAngularModule, ViewCard, ReactiveFormsModule],
})
export class UploadProofDisbursementDragInputFiles {
	public readonly control = input.required<FormControl>();
	public readonly disabled = input.required<boolean>();
	public readonly files = output<TFile[]>();

	private readonly _formBuilder = inject(FormBuilder);
	private readonly _destroyRef = inject(DestroyRef);

	protected readonly _allowedTypes = ['application/pdf'];
	protected readonly _uploadIcon = Upload;
	protected readonly _fileIcon = FolderArchive;
	protected readonly _trashIcon = Trash;
	protected readonly _fileControl = this._formBuilder.control<TFile[]>([]);
	protected readonly _files = signal<TFile[]>([]);
	protected readonly _loading = signal(false);

	protected _onUploadFiles(files: TFile[]): void {
		const currentFiles = this._files() || [];

		if (currentFiles.length >= 1) {
			toast.message('Límite alcanzado', {
				description: 'Solo puedes subir un comprobante. Elimina la actual para agregar más.',
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

		timer(2500)
			.pipe(takeUntilDestroyed(this._destroyRef))
			.subscribe(() => {
				this._files.set(finalFiles);
				this._loading.set(false);
				this.files.emit(finalFiles);

				if (combinedFiles.length > 1) {
					toast.message('Límite alcanzado', {
						description: 'Solo puedes subir un comprobante. El resto fue omitido.',
					});
				}
			});
	}

	protected _onErrorTypes(fileName: string): void {
		toast.message('Tipo de archivo no permitido', {
			description: `El archivo "${fileName}" no tiene un formato válido. Solo se permiten archivos .pdf.`,
		});
	}

	protected _onClickRemoveFile(fileName: string): void {
		if (this.disabled()) return;

		const filteredFiles = this._files().filter((file) => file.fileName !== fileName);
		this._files.set(filteredFiles);
		this.files.emit(filteredFiles);
	}
}
