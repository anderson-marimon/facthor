import { Component, computed, input } from '@angular/core';
import { frs } from '@fresco-core/frs-core';
@Component({
	selector: 'frs-avatar-fallback',
	standalone: true,
	host: {
		'[class]': '_frsClass()',
	},
	template: '{{ _fallback() }}',
})
export class FrsAvatarFallback {
	public readonly class = input('');
	public readonly name = input('Admin User');

	protected readonly _fallback = computed(() => {
		if (!this.name() || this.name().trim().length === 0) return 'AD';

		return this.name()
			.split(' ')
			.map((name) => name[0].toUpperCase())
			.slice(0, 2)
			.join('');
	});

	protected readonly _frsClass = computed(() =>
		frs('h-full w-full flex items-center justify-center text-muted-foreground font-bold bg-secondary', this.class())
	);
}
