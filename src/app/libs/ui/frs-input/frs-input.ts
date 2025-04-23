import { afterRenderEffect, Component, computed, effect, input, signal, viewChild, type ElementRef } from '@angular/core';
import { ReactiveFormsModule, type FormControl } from '@angular/forms';
import { frs, frsGenerateId, frsInputFormat, frsNumberFormat, frsPercentageFormat } from '@fresco-core/frs-core';
import { tap } from 'rxjs';

@Component({
    selector: 'frs-input',
    standalone: true,
    imports: [ReactiveFormsModule],
    host: {
        class: 'flex-1 w-full',
    },
    template: `
        <input
            #input
            type="text"
            [formControl]="control()"
            [class]="_frsClass()"
            [placeholder]="placeholder()"
            [id]="inputId"
            [name]="inputId"
            [attr.disabled]="disabled() ? '' : null"
        />
    `,
    exportAs: 'frsInput',
})
export class FrsInput {
    private readonly _inputElement = viewChild<ElementRef<HTMLInputElement>>('input');
    private readonly _hasError = signal<boolean>(false);

    public readonly class = input<string>('');
    public readonly placeholder = input<string>('Input placeholder');
    public readonly disabled = input<boolean>(false);
    public readonly control = input.required<FormControl<string | null>>();
    public readonly type = input<TInputType>('default');
    public readonly decorator = input<string>('');
    public readonly regex = input<string>('');
    public readonly decimals = input<boolean>(false);
    public readonly fill = input<string>('');
    public readonly mask = input<string>('');
    public readonly formatStyle = input<'American' | 'European'>('American');

    protected readonly inputId = frsGenerateId();

    constructor() {
        afterRenderEffect(() => this._syncControl());
    }

    private _syncControl(): void {
        this.disabled() ? this.control()?.disable() : this.control()?.enable();
        this._initConfigurations();
        this._formatInitialValue(this.control()?.value);
    }

    private _formatInitialValue(value: string | null): void {
        if (!value) return;

        const typeHandlers = {
            default: () => {
                const regex = this.regex() ? new RegExp(this.regex(), 'g') : null;
                if (regex) {
                    const formatted = value.replace(regex, '');
                    this._updateInputValue([formatted, formatted]);
                }
            },
            custom: () => {
                const formatted = frsInputFormat({
                    mask: this.mask() || 'xxx-xxx-xxx',
                    input: value,
                    fill: this.fill() || '-',
                    regex: this.regex(),
                    decorator: this.decorator(),
                });
                this._updateInputValue(formatted);
            },
            currency: () => {
                const formatted = frsNumberFormat({
                    input: value,
                    decimals: this.decimals(),
                    mask: this.mask(),
                    decorator: this.decorator() || '$',
                    formatStyle: this.formatStyle(),
                });
                this._updateInputValue(formatted);
            },
            percentage: () => {
                const formatted = frsPercentageFormat({
                    input: value,
                    decimals: this.decimals(),
                    formatStyle: this.formatStyle(),
                });
                this._updateInputValue(formatted);
            },
        };

        typeHandlers[this.type()]?.();
    }

    private _initConfigurations(): void {
        const typeHandlers = {
            default: () => this._applyDefaultType(),
            custom: () => this._applyCustomType(),
            currency: () => this._applyCurrencyType(),
            percentage: () => this._applyPercentageType(),
        };

        typeHandlers[this.type()]?.();
    }

    private _applyDefaultType(): void {
        const regex = this.regex() ? new RegExp(this.regex(), 'g') : null;

        this.control()
            ?.valueChanges.pipe(
                tap(value => {
                    if (value && regex) {
                        const formatted = value.replace(regex, '');
                        this.control()?.setValue(formatted, { emitEvent: false });
                    }
                })
            )
            .subscribe();
    }

    private _applyCustomType(): void {
        this.control()
            ?.valueChanges.pipe(
                tap(value =>
                    this._updateInputValue(
                        frsInputFormat({
                            mask: this.mask() || 'xxx-xxx-xxx',
                            input: value || '',
                            fill: this.fill() || '-',
                            regex: this.regex(),
                            decorator: this.decorator(),
                        })
                    )
                )
            )
            .subscribe();
    }

    private _applyCurrencyType(): void {
        this.control()
            ?.valueChanges.pipe(
                tap(value =>
                    this._updateInputValue(
                        frsNumberFormat({
                            input: value || '',
                            decimals: this.decimals(),
                            mask: this.mask(),
                            decorator: this.decorator(),
                            formatStyle: this.formatStyle(),
                        })
                    )
                )
            )
            .subscribe();
    }

    private _applyPercentageType(): void {
        this.control()
            ?.valueChanges.pipe(
                tap(value =>
                    this._updateInputValue(
                        frsPercentageFormat({
                            input: value || '',
                            decimals: this.decimals(),
                            formatStyle: this.formatStyle(),
                        })
                    )
                )
            )
            .subscribe();
    }

    private _updateInputValue([formatted, original]: [string, string]): void {
        const inputEl = this._inputElement()?.nativeElement;

        if (inputEl && inputEl.value !== formatted) {
            this.control()?.setValue(original, { emitEvent: false });

            inputEl.value = formatted;
        }
    }

    public setHasError(value: boolean): void {
        this._hasError.set(value);
    }

    protected readonly _frsClass = computed(() =>
        frs(
            `block h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base 
			file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground
			focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-2 focus-visible:ring-offset-background
			focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 text-sm placeholder:text-sm`,
            this.disabled() ? 'opacity-50 cursor-not-allowed pointer-events-none select-none' : '',
            this._hasError() ? 'border-red-400 focus-visible:ring-red-400 text-red-400' : '',
            this.class()
        )
    );
}

type TInputType = 'default' | 'currency' | 'percentage' | 'custom';
