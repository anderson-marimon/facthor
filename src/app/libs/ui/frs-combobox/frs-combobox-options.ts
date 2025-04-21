import { CommonModule } from '@angular/common';
import {
    Component,
    DestroyRef,
    type ElementRef,
    afterNextRender,
    computed,
    effect,
    inject,
    input,
    output,
    signal,
    viewChild,
    viewChildren,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { frs, frsIsMobileDevice } from '@fresco-core/frs-core';
import { type VariantProps, cva } from 'class-variance-authority';
import { Check, LucideAngularModule, Search } from 'lucide-angular';
import { fromEvent, timer } from 'rxjs';

@Component({
    selector: 'frs-combobox-options',
    standalone: true,
    imports: [LucideAngularModule, CommonModule],
    host: {
        '[class]': '_frsClass()',
    },
    template: `
        <div class="border-b">
            <i-lucide [img]="_search" />
            <input #searchInput (keyup.enter)="_select()" [placeholder]="searchPlaceholder()" />
        </div>
        <div [tabindex]="-1">
            @for(option of filteredOptions(); track option.label; let index = $index) {
            <span #elementOptions (click)="_select(option.label)" [ngClass]="{ 'bg-muted': _tabIndex() === index }"
                >{{ option.label }}
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
export class FrsComboboxOptions {
    private readonly _destroyRef = inject(DestroyRef);
    private readonly _elementOptions = viewChildren<ElementRef<HTMLSpanElement>>('elementOptions');
    private readonly _filteredOptions = signal<{ label: any; value: any }[]>([]);

    public readonly class = input('');
    public readonly options = input<{ label: any; value: any }[]>([]);
    public readonly selectLength = input(1);
    public readonly searchPlaceholder = input('Search');
    public readonly emptyPlaceholder = input('No options available');
    public readonly size = signal<TSizeVariant>('default');
    public readonly selectedOptionsEmitter = output<{ label: any; value: any }[]>();
    public readonly input = viewChild<ElementRef<HTMLInputElement>>('searchInput');

    protected readonly _selectedOptions = signal<{ label: any; value: any }[]>([]);
    protected readonly _tabIndex = signal(0);
    protected readonly _search = Search;
    protected readonly _check = Check;

    public readonly filteredOptions = computed(() => this._filteredOptions());

    constructor() {
        effect(() => {
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
            .subscribe(event => {
                const elements = this._elementOptions();
                if (elements.length === 0) return;

                switch (event.key) {
                    case 'ArrowDown':
                        event.preventDefault();
                        this._tabIndex.update(prev => (prev + 1) % elements.length);
                        break;
                    case 'ArrowUp':
                        event.preventDefault();
                        this._tabIndex.update(prev => (prev === 0 ? elements.length - 1 : prev - 1));
                        break;
                    case 'Enter': {
                        event.preventDefault();
                        const selectedOption = this.filteredOptions()[this._tabIndex()];
                        if (selectedOption) {
                            this._select(selectedOption.label);
                        }
                        break;
                    }
                }
            });
    }

    public getInput(): HTMLInputElement | undefined {
        return this.input()?.nativeElement;
    }

    public getSelectedOptionsLength(): number {
        return this._selectedOptions().length;
    }

    public setSize(size: TSizeVariant): void {
        this.size.set(size);
    }

    public focusInput(): void {
        timer(0)
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe(() => this.input()?.nativeElement.focus());
    }

    public resetTabIndex(): void {
        this._tabIndex.set(0);
    }

    public resetOptions(): void {
        this.resetTabIndex();

        const input = this.input();
        if (input === undefined) return;

        input.nativeElement.value = '';
        this._filteredOptions.set(this.options());
    }

    public setSelectedOptions(options: { label: string; value: any }[]): void {
        this._selectedOptions.set(options);
    }

    public filterOptions(value: string): void {
        const normalizedValue = value
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLocaleLowerCase();

        this._filteredOptions.set(
            this.options().filter(option => this._normalizeText(option.label).includes(normalizedValue))
        );
    }

    private _normalizeText(text: string): string {
        return text
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLocaleLowerCase();
    }

    protected _isSelected(option: { label: string; value: any }): boolean {
        if (this._selectedOptions().length === 0) return false;

        return this._selectedOptions().some(
            selected => selected.label === option.label && selected.value === option.value
        );
    }

    protected _select(label?: string): void {
        const selectedOption =
            label !== undefined
                ? this.options().find(option => option.label === label)
                : this.filteredOptions()[this._tabIndex()];

        const selectedOptions = this._selectedOptions();

        if (!selectedOption) return;

        if (this.selectLength() > 1) {
            if (selectedOptions.includes(selectedOption)) {
                this._selectedOptions.set(selectedOptions.filter(option => option !== selectedOption));
            } else {
                if (selectedOptions.length >= this.selectLength()) return;
                this._selectedOptions.set([...selectedOptions, selectedOption]);
            }
        } else {
            this._selectedOptions.set([selectedOption]);
        }

        if (label !== undefined && !frsIsMobileDevice()) {
            this.focusInput();
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
    `block w-full flex flex-col p-2 pt-0 overflow-hidden [&_svg]:pointer-events-none [&_svg]:shrink-0
	[&_svg]:opacity-50 [&>_div:first-child]:flex [&>_div:first-child]:items-center [&>_div:first-child]:gap-2
	[&_input]:flex-1 [&_input]:shrink-0 [&_input]:outline-none [&_input]:border-none [&_input]:w-full [&_input]:bg-background [&>_div:last-child]:flex-1
	[&>_div:last-child]:flex [&>_div:last-child]:flex-col [&>_div:last-child]:gap-1 [&>_div:last-child]:pt-2 [&>_div:last-child]:overflow-y-auto
	[&>_div:last-child]:scrollbar [&_p]:w-full [&_p]:h-full [&_p]:grid [&_p]:place-content-center
	[&_p]:opacity-40 [&_span]:flex [&_span]:justify-between [&_span]:items-center [&_span]:px-2 [&_span]:py-1 [&_span]:rounded
	[&_span:hover]:bg-muted [&_span]:cursor-pointer
	`,
    {
        variants: {
            size: {
                default: '[&_input]:h-9 min-h-10 max-h-40 [&_svg]:size-4',
                sm: '[&_input]:h-8 [&_input]:rounded-md text-xs [&_svg]:size-3.5',
            },
        },
        defaultVariants: {
            size: 'default',
        },
    }
);

type TSizeVariant = NonNullable<VariantProps<typeof variants>['size']>;
