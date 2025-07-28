import { afterNextRender, afterRenderEffect, Component, computed, DestroyRef, inject, input, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, type FormControl } from '@angular/forms';
import { frs } from '@fresco-core/frs-core';
import { Check, LucideAngularModule } from 'lucide-angular';

@Component({
	selector: 'frs-checkbox',
	standalone: true,
	imports: [LucideAngularModule, ReactiveFormsModule],
	template: `
		<label [class]="_frsClass()" [attr.aria-disabled]="disabled()">
			@if (control() !== undefined) {
				<input
					hidden
					type="checkbox"
					[name]="name()"
					[attr.aria-label]="ariaLabel()"
					[attr.aria-checked]="_checked()"
					[formControl]="control()!"
					[checked]="_checked()"
					(change)="_handleChange($event)"
				/>
			} @else {
				<input
					hidden
					type="checkbox"
					[name]="name()"
					[attr.aria-label]="ariaLabel()"
					[attr.aria-checked]="_checked()"
					[checked]="_checked()"
					(change)="_handleChange($event)"
				/>
			}
			<div tabindex="0" (keyup.enter)="_toggle()" (keyup.space)="_toggle()" [class]="_frsIndicatorClass()">
				@if (_checked()) {
					<lucide-angular [img]="icon()" strokeWidth="3" />
				}
			</div>

			@if (label()) {
				<p>{{ label() }}</p>
			}
		</label>
	`,
})
export class FrsCheckbox {
	public readonly class = input('');
	public readonly name = input<string | undefined>(undefined);
	public readonly disabled = input(false);
	public readonly label = input<string>('Checkbox label');
	public readonly ariaLabel = input<string | undefined>(undefined);
	public readonly icon = input(Check);
	public readonly checked = input(false);
	public readonly control = input<FormControl<boolean | null> | undefined>(undefined);

	private readonly _destroyRef = inject(DestroyRef);
	protected readonly _checked = signal(false);

	constructor() {
		afterRenderEffect(() => {
			this._syncCheckbox();
			this._checked.set(this.checked());
		});

		afterNextRender(() => {
			if (this.control()) {
				this.control()!
					.valueChanges.pipe(takeUntilDestroyed(this._destroyRef))
					.subscribe((value) => {
						this._checked.set(value ?? false);
					});
			}
		});
	}

	private _syncCheckbox(): void {
		if (this.control() && this.disabled()) {
			this.control()!.disable();
		} else if (this.control()) {
			this.control()!.enable();
		}
	}

	protected _handleChange(event: Event): void {
		if (this.disabled()) return;

		const checked = (event.target as HTMLInputElement).checked;
		this._checked.set(checked);

		if (this.control()) {
			this.control()!.setValue(checked);
		}
	}

	protected _toggle(): void {
		if (this.disabled()) return;

		const newValue = !this._checked();
		this._checked.set(newValue);

		if (this.control()) {
			this.control()!.setValue(newValue);
		}
	}

	protected readonly _frsClass = computed(() =>
		frs(
			'w-fit flex items-center justify-center gap-2 text-sm text-nowrap cursor-pointer',
			this.disabled() ? 'opacity-50 cursor-not-allowed pointer-events-none select-none' : '',
			this.class()
		)
	);

	protected readonly _frsIndicatorClass = computed(() =>
		frs(
			`relative min-w-3.5 max-w-3.5 grid place-items-center aspect-square rounded-sm border border-primary
      focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-2
      ring-offset-background [&_svg]:size-2.5`,
			this._checked() ? 'bg-primary text-primary-foreground' : 'bg-background text-foreground'
		)
	);
}
