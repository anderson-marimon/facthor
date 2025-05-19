import { Component, computed, input } from '@angular/core';
import { frs } from '@fresco-core/frs-core';
import { FrsButtonModule } from '@fresco-ui/frs-button';
import type { TFrsAlertDialogArgs } from '@fresco-ui/frs-dialog/frs-service';
import { LoadingIcon } from '@shared/icons/loading-icon/loading-icon';

@Component({
	selector: 'frs-alert-dialog',
	standalone: true,
	imports: [FrsButtonModule, LoadingIcon],
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
			<button frs-button [variant]="'outline'" (click)="_closeDialog()" [disabled]="data()?.loading()">
				{{ data()?.cancelButtonText || 'Cancelar' }}
			</button>
			<button frs-button (click)="_acceptAction()" [disabled]="data()?.loading()">
				@if(data()?.loading()) {
				<loading-icon [color]="'#FFFFFF'" class="size-6" />
				} @else {
				{{ data()?.actionButtonText || 'Aceptar' }}
				}
			</button>
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
		if (this.data()?.loading()) return;
		this.data()?.action();
	}

	protected readonly _frsClass = computed(() =>
		frs(
			`min-w-full max-w-[450px] flex flex-col gap-5 [&>section>h2]:text-md [&>section>h2]:font-semibold [&>section>p]:text-sm [&>section>p]:text-wrap
			[&>section>p]:text-muted-foreground [&>section>p]:mt-1 [&>section>h2]:mt-2 [&>section:last-child]:flex [&>section:last-child]:justify-end
			[&>section:last-child]:gap-4 [&>section>button]:min-w-24 `
		)
	);
}
