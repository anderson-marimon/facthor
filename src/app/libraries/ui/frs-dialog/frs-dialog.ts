import { Component, type Type, ViewContainerRef, computed, effect, input, viewChild } from '@angular/core';
import { frs } from '@fresco-core/frs-core';
import { FrsDialogContent } from '@fresco-ui/frs-dialog/frs-dialog-content';
import { FrsDialogOverlay } from '@fresco-ui/frs-dialog/frs-dialog-overlay';

@Component({
	selector: 'dialog',
	standalone: true,
	imports: [FrsDialogOverlay, FrsDialogContent],
	host: {
		'[class]': '_frsClass()',
		'[attr.role]': 'dialog',
		'[attr.aria-modal]': 'true',
		'[attr.aria-hidden]': 'false',
		'[attr.aria-labelled]': 'dialogTitle()',
	},
	inputs: ['closeDialog'],
	template: `
		<frs-dialog-overlay>
			<frs-dialog-content>
				<ng-container #content />
			</frs-dialog-content>
		</frs-dialog-overlay>
	`,
})
export class FrsDialog {
	private readonly _container = viewChild('content', { read: ViewContainerRef });
	private readonly _dialogContent = viewChild(FrsDialogContent);

	public readonly data = input<unknown>(null);
	public readonly content = input<Type<unknown>>();
	public readonly dialogTitle = input('dialog');

	constructor() {
		this._syncTriggers();
	}

	private _syncTriggers(): void {
		effect(() => {
			const component = this.content();
			if (!component) return;

			const container = this._container();
			container?.clear();

			const element = container?.createComponent(component);
			if (element && this.data()) {
				element.setInput('data', this.data());
				element.setInput('closeDialog', () => this.closeDialog());
			}
		});
	}

	public closeDialog(): void {
		this._dialogContent()?.close();
	}

	protected readonly _frsClass = computed(() => frs('fixed top-0 left-0 z-[800] block h-svh w-full bg-transparent'));
}
