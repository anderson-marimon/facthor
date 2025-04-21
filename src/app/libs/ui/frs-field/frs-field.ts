import { afterNextRender, Component, computed, contentChildren, input, type OnDestroy, signal } from '@angular/core';
import type { FormControl } from '@angular/forms';
import { frs } from '@fresco-core/frs-core';
import { INPUT_ERRORS, type TInputErrorKey } from '@fresco-core/frs-field-errors';
import { debounceTime, merge, type Subscription } from 'rxjs';

interface IControlComponent {
    control: () => FormControl<any>;
    setHasError: (value: boolean) => void;
}

@Component({
    selector: 'frs-field',
    standalone: true,
    host: {
        '[class]': '_frsClass()',
    },
    template: `
        @if(showLabel()) {
        <span>
            {{ label() }}

            @if(_required() && showLabelIcon()) {
            <span>*</span>
            }
        </span>
        }
        <ng-content />
        @if(_shouldShowError()) {
        <span>{{ _errorToRender() }}</span>
        }
    `,
})
export class FrsField implements OnDestroy {
    private readonly fieldComponents = contentChildren<IControlComponent>('field', { descendants: true });

    public readonly class = input('');
    public readonly label = input('');
    public readonly showLabel = input(true);
    public readonly showLabelIcon = input(true);
    public readonly showErrorMessage = input(true);

    protected readonly _required = signal(false);
    protected readonly _errorToRender = signal('');
    protected readonly _renderError = signal(false);
    private _subscriptions!: Subscription;

    constructor() {
        afterNextRender(() => this._syncField());
    }

    private _syncField(): void {
        const fields = this.fieldComponents();

        if (!fields.length) {
            console.warn('Components with #field not found inside FrsField');
            return;
        }

        const field = fields[0];
        const control = field.control();
        if (!control) return;

        if (this._subscriptions) {
            this._subscriptions.unsubscribe();
        }

        this._subscriptions = merge(control.statusChanges, control.valueChanges, control.events)
            .pipe(debounceTime(100))
            .subscribe(() => this._catchErrors());

        this._catchErrors();
        this._required.set(!!control.validator?.({} as any));
    }

    private _catchErrors(): void {
        if (!this.showErrorMessage()) return;

        const fields = this.fieldComponents();
        if (!fields.length) return;

        const control = fields[0].control();
        if (!control) return;

        const errors = control.errors;
        const touched = control.touched;
        const dirty = control.dirty;

        if (errors && (touched || dirty)) {
            this._renderError.set(true);
            this._setHasError(true);

            const errorKeys = Object.keys(errors) as TInputErrorKey[];
            const firstErrorKey = errorKeys[0];
            this._errorToRender.set(INPUT_ERRORS[firstErrorKey] || 'Invalid Format');
        } else {
            this._renderError.set(false);
            this._errorToRender.set('');
            this._setHasError(false);
        }
    }

    private _setHasError(value: boolean): void {
        const fields = this.fieldComponents();
        if (!fields.length) return;

        fields.forEach(field => {
            if (field?.setHasError) {
                field.setHasError(value);
            }
        });
    }

    protected readonly _shouldShowError = computed(() => {
        const fields = this.fieldComponents();
        if (!fields.length) return false;

        const control = fields[0].control();
        return this._renderError() && (control?.touched || control?.dirty) && control?.invalid;
    });

    protected readonly _frsClass = computed(() =>
        frs(
            `flex flex-col gap-1.5 text-sm [&>span]:text-nowrap [&>span>span]:text-red-400 [&>span:last-child]:text-xs
            [&>span:last-child]:text-red-400`,
            this.class()
        )
    );

    ngOnDestroy(): void {
        if (this._subscriptions) {
            this._subscriptions.unsubscribe();
        }
    }
}
