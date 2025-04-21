import { Directive, computed, input } from '@angular/core';
import { frs } from '@fresco-core/frs-core';
import { type VariantProps, cva } from 'class-variance-authority';

@Directive({
	selector: '[frs-button]',
	host: {
		'[class]': '_frsClass()'
	},
	standalone: true
})
export class FrsButtonDirective {
	public readonly class = input('');
	public readonly variant = input<TButtonVariants>();
	public readonly size = input<TButtonSizes>();

	protected readonly _frsClass = computed(() =>
		frs(
			variants({
				variant: this.variant(),
				size: this.size()
			}),
			this.class()
		)
	);
}

const variants = cva(
	`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors  
	focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background 
	disabled:opacity-50 disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0`,
	{
		variants: {
			variant: {
				default: 'bg-primary text-primary-foreground shadow hover:bg-primary/90',
				destructive:
					'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 focus-visible:ring-destructive',
				outline: 'border border bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
				secondary: 'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
				ghost: 'hover:bg-accent hover:text-accent-foreground',
				link: 'text-primary underline-offset-4 hover:underline'
			},
			size: {
				default: 'h-9 px-4 py-2',
				sm: 'h-8 rounded-md px-3 text-xs',
				lg: 'h-10 rounded-md px-8',
				icon: 'min-h-7 min-w-7 max-h-7 max-w-7'
			}
		},
		defaultVariants: {
			variant: 'default',
			size: 'default'
		}
	}
);

export type TButtonVariants = NonNullable<VariantProps<typeof variants>['variant']>;
export type TButtonSizes = NonNullable<VariantProps<typeof variants>['size']>;
