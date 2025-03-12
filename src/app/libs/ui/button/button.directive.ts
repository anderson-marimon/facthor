import { computed, Directive, input } from '@angular/core';
import { frs } from '@fresco-core/frs.core';
import { cva, type VariantProps } from 'class-variance-authority';

@Directive({
	selector: '[frs-button]',
	host: {
		'[class]': '_frsClass()'
	}
})
export class FrsButtonDirective {
	public readonly class = input('');
	public readonly variant = input<ButtonVariants>();
	public readonly size = input<ButtonSizes>();

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
	focus-visible:outline-none focus-visible:ring-[0.1vh] focus-visible:ring-ring focus-visible:ring-offset-[0.5vh] ring-offset-background 
	disabled:opacity-50 disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0`,
	{
		variants: {
			variant: {
				default: 'bg-primary text-primary-foreground shadow hover:bg-primary/90',
				destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 focus-visible:ring-destructive',
				outline: 'border border bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
				secondary: 'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
				ghost: 'hover:bg-accent hover:text-accent-foreground',
				link: 'text-primary underline-offset-[0.5vh] hover:underline'
			},
			size: {
				default: 'h-[4vh] px-[2vh] py-[0.5vh]',
				sm: 'h-[3.5vh] rounded-md px-[1.5vh] text-xs',
				lg: 'h-[4.5vh] rounded-md px-[4vh]',
				icon: 'h-[3.5vh] w-[3.5vh]'
			}
		},
		defaultVariants: {
			variant: 'default',
			size: 'default'
		}
	}
);

export type ButtonVariants = NonNullable<VariantProps<typeof variants>['variant']>;
export type ButtonSizes = NonNullable<VariantProps<typeof variants>['size']>;
export type optional = Partial<string>;
