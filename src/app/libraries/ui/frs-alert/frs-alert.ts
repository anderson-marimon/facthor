import { Component, computed, input } from '@angular/core';
import { frs } from '@fresco-core/frs-core';
import { cva, type VariantProps } from 'class-variance-authority';

@Component({
	selector: 'frs-alert',
	standalone: true,
	host: {
		'[class]': '_frsClass()',
	},
	template: `
		<ng-content select="frs-alert-title" />
		<ng-content select="frs-alert-description" />
	`,
})
export class FrsAlert {
	public readonly class = input('');
	public readonly variant = input<TAlertVariant>();

	protected readonly _frsClass = computed(() =>
		frs(
			variants({
				variant: this.variant(),
			}),
			this.class(),
		),
	);
}

const variants = cva('block relative w-full rounded-lg border border p-4 ', {
	variants: {
		variant: {
			default: 'bg-background text-foreground',
			destructive: 'border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive',
		},
	},
	defaultVariants: {
		variant: 'default',
	},
});

type TAlertVariant = NonNullable<VariantProps<typeof variants>['variant']>;
