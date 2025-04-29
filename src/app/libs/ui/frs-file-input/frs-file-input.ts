import { afterRenderEffect, Component, computed, input, output, signal, viewChild, type ElementRef } from '@angular/core';
import { ReactiveFormsModule, type FormControl } from '@angular/forms';
import { frs, frsGenerateId } from '@fresco-core/frs-core';

@Component({
	selector: 'frs-file-input',
	standalone: true,
	imports: [ReactiveFormsModule],
	host: {
		class: 'flex-1 w-full',
	},
	template: `
		<input
			#input
			type="file"
			[formControl]="control()"
			[class]="_frsClass()"
			[accept]="accept()"
			[multiple]="multiple()"
			[placeholder]="placeholder()"
			(change)="_filesManager()"
			[id]="_inputId"
			[name]="_inputId"
			[attr.disabled]="disabled() ? '' : null"
		/>
	`,
	exportAs: 'frsInput',
})
export class FrsFileInput {
	private readonly _inputElement = viewChild<ElementRef<HTMLInputElement>>('input');
	private readonly _hasError = signal<boolean>(false);

	public readonly class = input<string>('');
	public readonly placeholder = input<string>('Input placeholder');
	public readonly disabled = input<boolean>(false);
	public readonly control = input.required<FormControl<any>>();
	public readonly accept = input<string>('');
	public readonly multiple = input<boolean>(false);
	public readonly files = output<File[]>();

	protected readonly _inputId = frsGenerateId();

	constructor() {
		afterRenderEffect(() => this._syncControl());
	}

	private _syncControl(): void {
		this.disabled() ? this.control()?.disable() : this.control()?.enable();
	}

	protected _filesManager(): void {
		const inputElement = this._inputElement()!.nativeElement;
		const files = inputElement.files;
		const fileList: File[] = [];

		if (files) {
			for (const file of files) {
				fileList.push(file);
			}
		}

		this.files.emit(fileList);
	}

	public setHasError(value: boolean): void {
		this._hasError.set(value);
	}

	protected readonly _frsClass = computed(() =>
		frs(
			`flex h-9 w-full rounded-md border border-input bg-transparent px-2 py-1 text-base 
			file:border-0 file:bg-transparent file:text-sm file:mt-[3px] file:font-medium file:text-foreground placeholder:text-muted-foreground
			focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-2 focus-visible:ring-offset-background
			focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 text-sm placeholder:text-sm`,
			this.disabled() ? 'opacity-50 cursor-not-allowed pointer-events-none select-none' : '',
			this._hasError() ? 'border-red-400 focus-visible:ring-red-400 text-red-400 file:text-red-400' : '',
			this.class()
		)
	);
}
