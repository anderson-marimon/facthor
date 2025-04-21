import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, computed, input, signal } from '@angular/core';
import { frs } from '@fresco-core/frs-core';
import { type VariantProps, cva } from 'class-variance-authority';

@Component({
	selector: 'frs-popover-content',
	standalone: true,
	host: {
		'[class]': '_frsClassPosition()',
		'[@openClose]': '_state()'
	},
	animations: [
		trigger('openClose', [
			state(
				'visible',
				style({
					opacity: 1,
					transform: 'scale(1)'
				})
			),
			state(
				'void',
				style({
					opacity: 0,
					transform: 'scale(0.95)'
				})
			),
			transition('visible <=> void', animate('200ms ease'))
		])
	],
	template: '<div [class]="_frsClass()"><ng-content /></div>'
})
export class FrsPopoverContent {
	private readonly _state = signal<'visible' | 'void'>('void');

	public readonly position = input<TPopoverPosition>();
	public readonly spacing = input<TPopoverSpacing>();
	public readonly class = input('');

	public getState(): 'visible' | 'void' {
		return this._state();
	}

	public setState(state: 'visible' | 'void'): void {
		this._state.set(state);
	}

	protected readonly _frsClassPosition = computed(() =>
		frs(variants({ position: this.position(), spacing: this.spacing() }))
	);

	protected readonly _frsClass = computed(() =>
		frs('block w-full min-h-fit text-sm border rounded-md shadow-sm bg-background', this.class())
	);
}

const variants = cva('absolute z-50 w-fit', {
	variants: {
		position: {
			top: 'bottom-full left-0 pb-2',
			bottom: 'top-full left-0 pt-2',
			left: 'top-0 right-full pr-2',
			right: 'top-0 left-full pl-2'
		},
		spacing: {
			'none': '',
			'top-sm': 'pb-2',
			'top-md': 'pb-4',
			'top-lg': 'pb-6',
			'right-sm': 'pl-2',
			'right-md': 'pl-4',
			'right-lg': 'pl-6',
			'bottom-sm': 'pt-2',
			'bottom-md': 'pt-4',
			'bottom-lg': 'pt-6',
			'left-sm': 'pr-2',
			'left-md': 'pr-4',
			'left-lg': 'pr-6'
		}
	},
	defaultVariants: {
		position: 'bottom',
		spacing: 'none'
	}
});

export type TPopoverPosition = NonNullable<VariantProps<typeof variants>['position']>;
export type TPopoverSpacing = NonNullable<VariantProps<typeof variants>['spacing']>;
