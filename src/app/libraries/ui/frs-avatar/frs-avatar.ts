import { Component, computed, input } from '@angular/core';
import { frs } from '@fresco-core/frs-core';
import { cva, type VariantProps } from 'class-variance-authority';

@Component({
	selector: 'frs-avatar',
	standalone: true,
	host: {
		'[class]': '_frsClass()',
	},
	template: `
		<ng-content select="frs-avatar-image" />
		<ng-content select="frs-avatar-fallback" />
	`,
})
export class FrsAvatar {
	public readonly class = input('');
	public readonly size = input<AvatarSizes>('md');

	protected readonly _frsClass = computed(() => frs(variants({ size: this.size() }), this.class()));
}

const variants = cva(
	`relative flex shrink-0 rounded-full overflow-hidden aspect-square [&_img]:absolute [&_img]:top-0 [&_img]:left-0
    [&_img]:w-full [&_img]:h-full`,
	{
		variants: {
			size: {
				sm: 'h-10 w-10',
				md: 'h-12 w-12',
				lg: 'h-14 w-14',
				xl: 'h-20 w-20',
			},
		},
		defaultVariants: {
			size: 'md',
		},
	}
);

export type AvatarSizes = NonNullable<VariantProps<typeof variants>['size']>;
