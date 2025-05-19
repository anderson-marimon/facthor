import { afterRenderEffect, Component, computed, input, output, signal, viewChild, type ElementRef } from '@angular/core';
import { ReactiveFormsModule, type FormControl } from '@angular/forms';
import { frs, frsGenerateId } from '@fresco-core/frs-core';

export type TFile = {
	fileId: number;
	fileName: string;
	base64: string;
	blobUrl: string;
	type: string;
	size: number;
};
@Component({
	selector: 'frs-file-input',
	standalone: true,
	imports: [ReactiveFormsModule],
	host: {
		'[class]': '_frsClass()',
	},
	template: `
		<input
			#input
			type="file"
			[formControl]="control()"
			[class]="_frsInputClass"
			[accept]="accept()"
			[multiple]="multiple()"
			[placeholder]="placeholder()"
			(change)="_filesManager()"
			[id]="_inputId"
			[name]="_inputId"
			[attr.disabled]="disabled() ? '' : null"
		/>

		@if(currentFiles().length === 0) {
		<p [class]="_frsPClass">
			<strong>Seleccionar archivo{{ multiple() ? 's' : '' }}:</strong>
			<span>Ningún archivo seleccionado</span>
		</p>

		} @else {
		<p [class]="_frsPClass">
			@for(file of currentFiles(); track $index; let last = $last) {
			<span>{{ file.fileName }}{{ last ? '' : ',' }}</span>
			}
		</p>
		}
	`,
})
export class FrsFileInput {
	private readonly _inputElement = viewChild<ElementRef<HTMLInputElement>>('input');
	private readonly _hasError = signal<boolean>(false);

	public readonly class = input<string>('');
	public readonly fileId = input(0);
	public readonly placeholder = input<string>('Input placeholder');
	public readonly disabled = input<boolean>(false);
	public readonly control = input.required<FormControl<any>>();
	public readonly accept = input<string>('');
	public readonly multiple = input<boolean>(false);
	public readonly currentFiles = input<TFile[]>([]);
	public readonly files = output<TFile[]>();

	protected readonly _inputId = frsGenerateId();

	constructor() {
		afterRenderEffect(() => this._syncControl());
	}

	private _syncControl(): void {
		this.disabled() ? this.control()?.disable() : this.control()?.enable();
	}

	private async _toBase64(file: File): Promise<string> {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result as string);
			reader.onerror = reject;
		});
	}

	protected async _filesManager(): Promise<void> {
		const inputElement = this._inputElement()!.nativeElement;
		const files = inputElement.files;
		const fileList: TFile[] = [];

		if (files) {
			for (const file of files) {
				const fileName = file.name;
				const base64 = await this._toBase64(file);
				const blobUrl = URL.createObjectURL(file);
				const type = file.type;
				const size = file.size;

				fileList.push({ fileId: this.fileId(), fileName, base64, blobUrl, type, size });
			}
		}

		this.files.emit(fileList);
	}

	public setHasError(value: boolean): void {
		this._hasError.set(value);
	}

	protected readonly _frsClass = computed(() =>
		frs(
			`relative flex-1 w-full max-h-fit outline-none [&>input:focus-visible~p]:ring-1 [&>input:focus-visible~p]:ring-offset-2
			[&>input:focus-visible~p]:ring-ring [&>input:focus-visible~p]:ring-offset-background !cursor-pointer`,
			this.disabled() ? 'opacity-50 cursor-not-allowed pointer-events-none select-none' : '',
			this._hasError() ? '[&>p]:border-red-400 [&>input:focus-visible~p]:ring-red-400 [&>p]:text-red-400' : ''
		)
	);

	protected readonly _frsInputClass = `relative z-1 flex h-9 w-full opacity-0`;

	protected readonly _frsPClass = `absolute top-0 left-0 z-[-1] flex items-center gap-1 h-full w-full rounded-md border border-input
  		bg-transparent px-3 py-1 text-sm text-nowrap [&_span]:overflow-hidden [&_span]:overflow-ellipsis [&_span]:whitespace-nowrap`;
}
