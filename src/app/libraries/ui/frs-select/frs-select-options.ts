import { CommonModule } from '@angular/common';
import {
	Component,
	DestroyRef,
	type ElementRef,
	afterNextRender,
	afterRenderEffect,
	computed,
	effect,
	inject,
	input,
	output,
	signal,
	viewChildren,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { frs } from '@fresco-core/frs-core';
import { type VariantProps, cva } from 'class-variance-authority';
import { Check, LucideAngularModule } from 'lucide-angular';
import { fromEvent } from 'rxjs';

@Component({
	selector: 'frs-select-options',
	standalone: true,
	imports: [LucideAngularModule, CommonModule],
	host: {
		'[class]': '_frsClass()',
	},
	template: `
		<div [tabindex]="-1">
			@for(option of options(); track option.label; let index = $index) {
			<span #elementOptions (click)="_select(option)" [ngClass]="{ 'bg-muted': _tabIndex() === index }">
				{{ option.label }}
				@if(_isSelected(option)) {
				<i-lucide [img]="_check" />
				}
			</span>
			} @empty {
			<p>{{ emptyPlaceholder() }}</p>
			}
		</div>
	`,
})
export class FrsSelectOptions {
	private readonly _elementOptions = viewChildren<ElementRef<HTMLSpanElement>>('elementOptions');
	private readonly _destroyRef = inject(DestroyRef);

	public readonly class = input('');
	public readonly emptyPlaceholder = input('No options available');
	public readonly options = input<{ label: any; value: any }[]>([]);
	public readonly selectLength = input(1);
	public readonly selectedOptionsEmitter = output<{ label: any; value: any }[]>();
	public readonly size = signal<TSizeVariant>('default');

	protected readonly _selectedOptions = signal<{ label: any; value: any }[]>([]);
	protected readonly _tabIndex = signal(0);
	protected readonly _check = Check;
	protected readonly _isExpanded = signal(false);

	constructor() {
		effect(() => {
			const elements = this._elementOptions();
			if (elements.length > 0) {
				elements[this._tabIndex()].nativeElement.focus();
			}
		});

		afterRenderEffect(() => {
			const elements = this._elementOptions();
			if (elements.length > 0) {
				const activeElement = elements[this._tabIndex()].nativeElement;
				activeElement.focus();
				activeElement.scrollIntoView({
					behavior: 'smooth',
					block: 'center',
				});
			}
		});

		afterNextRender(() => this._handleKeydown());
	}

	private _handleKeydown(): void {
		fromEvent<KeyboardEvent>(document, 'keydown')
			.pipe(takeUntilDestroyed(this._destroyRef))
			.subscribe((event) => {
				const optionsElements = this._elementOptions();
				if (optionsElements.length === 0 || !optionsElements[0].nativeElement.offsetParent) return;

				switch (event.key) {
					case 'ArrowDown':
					case 'ArrowUp':
					case 'Enter':
						event.preventDefault();
						event.stopPropagation();
						break;
				}

				switch (event.key) {
					case 'ArrowDown':
						this._tabIndex.update((prev) => (prev + 1) % optionsElements.length);
						break;
					case 'ArrowUp':
						this._tabIndex.update((prev) => (prev === 0 ? optionsElements.length - 1 : prev - 1));
						break;
					case 'Enter': {
						const selectedOption = this.options()[this._tabIndex()];
						if (selectedOption) {
							this._select(selectedOption);
						}
						break;
					}
				}
			});
	}

	public getSelectedOptionsLength(): number {
		return this._selectedOptions().length;
	}

	public setIsExpanded(isExpanded: boolean): void {
		this._isExpanded.set(isExpanded);
	}

	public setSelectedOptions(options: { label: string; value: any }[]): void {
		this._selectedOptions.set(options);
	}

	public setSize(size: TSizeVariant): void {
		this.size.set(size);
	}

	public resetTabIndex(): void {
		this._tabIndex.set(0);
	}

	protected _isSelected(option: any): boolean {
		if (this._selectedOptions().length === 0) return false;
		return this._selectedOptions().some((selected) => selected.label === option.label && selected.value === option.value);
	}

	protected _select(option: { label: any; value: any }): void {
		const selectedOption = option;
		const selectedOptions = this._selectedOptions();

		if (!selectedOption) return;

		if (this.selectLength() > 1) {
			if (this._isSelected(selectedOption)) {
				this._selectedOptions.set(selectedOptions.filter((opt) => opt.value !== selectedOption.value || opt.label !== selectedOption.label));
			} else {
				if (selectedOptions.length >= this.selectLength()) return;
				this._selectedOptions.set([...selectedOptions, selectedOption]);
			}
		} else {
			if (this._selectedOptions().length === 1 && this._selectedOptions()[0].value === selectedOption.value) {
				this._selectedOptions.set([]);
			} else {
				this._selectedOptions.set([selectedOption]);
			}
		}

		this.selectedOptionsEmitter.emit(this._selectedOptions());
	}

	protected readonly _frsClass = computed(() =>
		frs(
			variants({
				size: this.size(),
			}),
			this.class()
		)
	);
}

const variants = cva(
	`block w-full flex flex-col p-2 overflow-hidden [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0
  	[&_svg]:opacity-50 [&>_div]:flex-1 [&>_div]:flex [&>_div]:flex-col [&>_div]:gap-1 [&>_div]:overflow-y-auto
  	[&>_div]:scrollbar [&_p]:w-full [&_p]:h-6 [&_p]:grid [&_p]:place-content-center [&_p]:opacity-40 [&_span]:flex 
	[&_span]:justify-between [&_span]:items-center [&_span]:px-2 [&_span]:py-1 [&_span]:rounded-md [&_span:hover]:bg-muted
	[&_span]:cursor-pointer
  	`,
	{
		variants: {
			size: {
				default: 'min-h-10 max-h-40',
				sm: 'min-h-10 max-h-36 text-xs',
			},
		},
		defaultVariants: {
			size: 'default',
		},
	}
);

type TSizeVariant = NonNullable<VariantProps<typeof variants>['size']>;
