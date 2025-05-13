import { Component, computed, input } from '@angular/core';
import { frs } from '@fresco-core/frs-core';
import { Info, LucideAngularModule } from 'lucide-angular';

@Component({
	selector: 'frs-alert-title',
	standalone: true,
	imports: [LucideAngularModule],
	host: {
		'[class]': '_frsClass()',
	},
	template: `
		<i-lucide [strokeWidth]="1.5" [img]="icon()" />
		<ng-content />
	`,
})
export class FrsAlertTitle {
	public readonly class = input('');
	public readonly icon = input(Info);

	protected readonly _frsClass = computed(() =>
		frs('flex items-center gap-3 mb-1 font-medium leading-none tracking-tight [&_svg]:w-5', this.class())
	);
}
