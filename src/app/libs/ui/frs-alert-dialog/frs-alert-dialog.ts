import { Component, computed, input } from '@angular/core';
import { frs } from '@fresco-core/frs-core';
import { FrsButtonModule } from '@fresco-ui/frs-button';
import type { TFrsAlertDialogArgs } from '@fresco-ui/frs-dialog/frs-service';

@Component({
	selector: 'frs-alert-dialog',
	standalone: true,
	imports: [FrsButtonModule],
	host: {
		'[class]': '_frsClass()',
	},
	template: `
		<section>
			<h2>{{ data()?.title || 'Are you sure about this action?' }}</h2>
			<p>
				{{
					data()?.description ||
						'Esta acción no puede ser deshecha. Por favor revisar bien antes de aceptar, los cambios serán aplicados de forma permanente.'
				}}
			</p>
		</section>
		<section>
			<button frs-button [variant]="'outline'" (click)="_closeDialog()">{{ data()?.cancelButtonText || 'Cancel' }}</button>
			<button frs-button (click)="_acceptAction()">{{ data()?.actionButtonText || 'Accept' }}</button>
		</section>
	`,
})
export class FrsAlertDialog {
	public readonly data = input<TFrsAlertDialogArgs>();
	public readonly closeDialog = input(() => {});

	protected _closeDialog(): void {
		this.closeDialog()();
	}

	protected _acceptAction(): void {
		this.data()?.action();
	}

	protected readonly _frsClass = computed(() =>
		frs(
			`min-w-full max-w-[450px] flex flex-col gap-5 [&_h2]:text-md [&_h2]:font-semibold [&_p]:text-sm [&_p]:text-wrap [&_p]:text-muted-foreground
			[&_p]:mt-2 [&_section:last-child]:flex [&_section:last-child]:justify-end [&_section:last-child]:gap-2.5`,
		),
	);
}
