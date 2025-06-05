import { CommonModule } from '@angular/common';
import { Component, computed, HostListener, input, output, signal } from '@angular/core';
import { frs } from '@fresco-core/frs-core';
import { cva, type VariantProps } from 'class-variance-authority';
import { ChevronsDownUp, ChevronsUpDown, LucideAngularModule } from 'lucide-angular';

@Component({
	selector: 'frs-select-trigger',
	standalone: true,
	imports: [LucideAngularModule, CommonModule],
	host: {
		'[class]': '_frsClass()',
		'[tabindex]': "_disabled() ? '-1' : '0'",
	},
	template: `
		<div [title]="selectedText()" class="truncate">
			{{ selectedText() || placeholder() || 'Select an option' }}
		</div>
		<i-lucide [img]="isExpanded() ? iconExpanded() : icon()" />
	`,
	styles: [
		`
			.truncate {
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
				display: block;
				max-width: 100%;
			}
		`,
	],
})
export class FrsSelectTrigger {
	private readonly _size = signal<TSizeVariants>('default');
	private readonly _isExpanded = signal(false);
	private readonly _selectedOptions = signal<{ label: string; value: any }[]>([]);
	private readonly _hasError = signal<boolean>(false);

	public readonly class = input('');
	public readonly placeholder = input('');
	public readonly icon = input(ChevronsUpDown);
	public readonly iconExpanded = input(ChevronsDownUp);
	public readonly emitTouched = output<void>();
	public readonly isExpanded = computed(() => this._isExpanded());

	protected readonly _disabled = signal(false);

	public setSize(size: TSizeVariants): void {
		this._size.set(size);
	}

	public setDisabled(disabled: boolean): void {
		this._disabled.set(disabled);
	}

	public setSelectedOptions(options: { label: string; value: any }[]): void {
		this._selectedOptions.set(options);
	}

	public setHasError(value: boolean): void {
		this._hasError.set(value);
	}

	public setExpandedState(value: boolean): void {
		this._isExpanded.set(value);
	}

	public selectedText = computed(() => {
		if (this._selectedOptions().length === 0) return '';
		const options =
			this._selectedOptions()
				.map((opt) => opt?.label)
				.join(', ') || '';

		return options;
	});

	@HostListener('blur')
	protected _touched(): void {
		this.emitTouched.emit();
	}

	protected readonly _frsClass = computed(() =>
		frs(
			variants({
				size: this._size(),
			}),
			this._hasError() ? 'border-red-400 focus-visible:ring-red-400 text-red-400' : '',
			this.class()
		)
	);
}

const variants = cva(
	`block w-full flex items-center gap-2.5 py-2 border rounded-md focus-visible:outline-none focus-visible:ring-1
	focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background [&>div]:flex-1 [&>div]:max-w-full
	[&>div]:overflow-hidden [&>div]:text-ellipsis [&>div]:whitespace-nowrap [&>div]:white-space-no [&_svg]:size-4
	[&_svg]:shrink-0 cursor-pointer`,
	{
		variants: {
			size: {
				default: 'h-9 px-3',
				sm: 'h-8 rounded-md pl-3 pr-2 text-xs [&_svg]:size-3.5',
			},
		},
		defaultVariants: {
			size: 'default',
		},
	}
);

export type TSizeVariants = NonNullable<VariantProps<typeof variants>['size']>;
