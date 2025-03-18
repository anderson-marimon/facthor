import { afterRenderEffect, Component, computed, input, signal } from '@angular/core';
import { ReactiveFormsModule, type FormControl } from '@angular/forms';
import { frs } from '@fresco-core/frs.core';
import { INPUT_ERRORS } from '@shared/common/input-errors';

export interface ISelectFieldOptions<T> {
	name: string;
	value: T;
}

@Component({
	selector: 'select-field',
	templateUrl: 'select-field.html',
	host: { '[class]': '_frsClass()' },
	imports: [ReactiveFormsModule]
})
export class SelectField {
	public readonly class = input('');
	public readonly label = input('Select field');
	public readonly options = input<ISelectFieldOptions<number>[]>([]);
	public readonly errorMessage = input('');
	public readonly required = input(true);
	public readonly disabled = input(false);
	public readonly showLabel = input(true);
	public readonly showErrorMessage = input(true);
	public readonly renderErrorMessage = signal(false);
	public readonly inputFormControl = input.required<FormControl<any>>();

	protected readonly _errorMessage = signal(this.errorMessage());
	protected _inputId = 5654069;

	constructor() {
		afterRenderEffect({
			write: () => {
				this._syncField();
			}
		});
	}

	private _syncField(): void {
		if (this.disabled()) {
			this.inputFormControl().disable();
		} else {
			this.inputFormControl().enable();
		}

		this.inputFormControl().valueChanges.subscribe(() => {
			this._catchErrors();
		});
	}

	private _catchErrors(): void {
		if (!this.showErrorMessage()) return;

		const errors = this.inputFormControl().errors;

		if (errors !== null) {
			this.renderErrorMessage.set(true);

			Object.keys(errors)
				.reverse()
				.forEach(error => {
					const key = error as keyof typeof INPUT_ERRORS;
					this._errorMessage.set(INPUT_ERRORS[key] || 'Formato inválido');
				});

			return;
		}

		this.renderErrorMessage.set(false);
	}

	protected readonly _frsClass = computed(() => frs('w-full flex flex-col gap-[0.5vh] text-[1.7vh]'));
}
