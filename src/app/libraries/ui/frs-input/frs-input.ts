import { afterRenderEffect, Component, computed, input, signal, viewChild, type ElementRef } from '@angular/core';
import { ReactiveFormsModule, type FormControl } from '@angular/forms';
import { frs, frsGenerateId, frsInputFormat, frsNumberFormat, frsPercentageFormat } from '@fresco-core/frs-core';
import { FrsButtonModule } from '@fresco-ui/frs-button';
import { Eye, EyeClosed, LucideAngularModule } from 'lucide-angular';
import { tap } from 'rxjs';

@Component({
	selector: 'frs-input',
	standalone: true,
	imports: [FrsButtonModule, LucideAngularModule, ReactiveFormsModule],
	host: {
		'[class]': '_frsContainerClass()',
	},
	template: `
		@if(beforeIcon()) {
		<i-lucide [img]="beforeIcon()!" [strokeWidth]="1.5" />
		}

		<input
			#input
			[type]="_isEyeOpen() && showEye() ? 'password' : 'text'"
			[formControl]="control()"
			[class]="_frsClass()"
			[placeholder]="placeholder()"
			[id]="_inputId"
			[name]="_inputId"
			(focus)="_onFocus()"
			(blur)="_onBlur()"
			(keydown)="_onKeydown($event)"
			[attr.disabled]="disabled() ? '' : null"
		/>

		@if(showEye()) {
		<button frs-button type="button" [variant]="'ghost'" [size]="'icon'" (click)="_onClickEye()">
			<i-lucide [img]="_eyeIcon" [strokeWidth]="1.5" />
		</button>
		}
	`,
	exportAs: 'frsInput',
})
export class FrsInput {
	private readonly _inputElement = viewChild<ElementRef<HTMLInputElement>>('input');
	private readonly _hasError = signal<boolean>(false);
	private readonly _formattedValue = signal<string>('');
	private readonly _originalValue = signal<string>('');
	private readonly _isOnLimit = signal(false);

	public readonly class = input<string>('');
	public readonly containerClass = input<string>('');
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
	public readonly showEye = input(false);
	public readonly beforeIcon = input<any>();

	protected readonly _inputId = frsGenerateId();
	protected readonly _inputValue = signal<string>('');
	protected readonly _isEyeOpen = signal(true);
	protected _eyeIcon = EyeClosed;

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
					decorator: this.decorator(),
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
				tap((value) => {
					if (value && regex) {
						const formatted = value.replace(regex, '');
						this._updateInputValue([formatted, formatted]);
					} else {
						const val = value || '';
						this._updateInputValue([val, val]);
					}
				})
			)
			.subscribe();
	}

	private _applyCustomType(): void {
		this.control()
			?.valueChanges.pipe(
				tap((value) =>
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
				tap((value) =>
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
				tap((value) =>
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
		const isFocused = document.activeElement === inputEl;
		const start = inputEl?.selectionStart ?? 0;

		this.control()?.setValue(original, { emitEvent: false });

		if (inputEl && !isFocused && inputEl.value !== formatted) {
			inputEl.value = formatted;

			const offset = formatted.length - original.length;
			const newPos = start + offset;
			inputEl.setSelectionRange(newPos, newPos);
		}

		this._formattedValue.set(formatted);
		this._originalValue.set(original);

		if (this.mask().length > 0) {
			const maskLength = this.mask().replace(/[^x]/g, '').length;
			const originalLength = original.length;

			this._isOnLimit.set(originalLength === maskLength);
		}
	}

	protected _onKeydown(event: KeyboardEvent): void {
		if (this._isOnLimit()) {
			const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
			if (!allowedKeys.includes(event.key)) {
				event.preventDefault();
			}
		}
	}

	protected _onFocus(): void {
		const inputEl = this._inputElement()?.nativeElement;
		inputEl!.value = this._originalValue();
	}

	protected _onBlur(): void {
		const inputEl = this._inputElement()?.nativeElement;
		const formatted = this._formattedValue();
		const fallback = this.control()?.value ?? '';
		inputEl!.value = formatted || fallback;
	}

	protected _onClickEye(): void {
		if (!this.showEye()) return;
		this._isEyeOpen.update((prev) => !prev);
		this._eyeIcon = this._isEyeOpen() ? EyeClosed : Eye;
	}
	public setHasError(value: boolean): void {
		this._hasError.set(value);
	}

	protected readonly _frsClass = computed(() => {
		const paddingLeft = this.beforeIcon() ? 'pl-7' : 'pl-3';
		const paddingRight = this.showEye() ? 'pr-8' : 'pr-3';

		return frs(
			`flex h-9 w-full rounded-md border border-input bg-transparent ${paddingLeft} ${paddingRight} py-1 text-base
			file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground
			placeholder:text-muted-foreground
			focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-2 focus-visible:ring-offset-background
			focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 text-sm placeholder:text-sm
			[&~button]:absolute [&~button]:right-1 [&~button]:top-1/2 [&~button]:-translate-y-1/2`,
			this.disabled() ? 'opacity-50 cursor-not-allowed pointer-events-none select-none' : '',
			this._hasError() ? 'border-red-400 focus-visible:ring-red-400 text-red-400' : '',
			this.class()
		);
	});

	protected readonly _frsContainerClass = computed(() =>
		frs(
			`relative flex-1 w-full max-h-fit flex gap-1 [&>i-lucide]:absolute [&>i-lucide]:left-2 [&>i-lucide]:top-1/2
			[&>i-lucide]:-translate-y-1/2 [&>i-lucide_svg]:stroke-foreground/60 [&>i-lucide_svg]:size-4`,
			this.disabled() ? '[&>i-lucide_svg]:opacity-50' : '',
			this.containerClass()
		)
	);
}

type TInputType = 'default' | 'currency' | 'percentage' | 'custom';
