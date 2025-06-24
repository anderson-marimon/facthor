import { ApplicationRef, type ComponentRef, createComponent, EnvironmentInjector, inject, Injectable, Signal, WritableSignal } from '@angular/core';
import { FrsAlertDialog } from '@fresco-ui/frs-alert-dialog/frs-alert-dialog';
import { FrsDialog } from '@fresco-ui/frs-dialog/frs-dialog';
@Injectable({
	providedIn: 'root',
})
export class FrsDialogRef {
	private _componentRefs: ComponentRef<FrsDialog>[] = [];
	private _appRef = inject(ApplicationRef);
	private _injector = inject(EnvironmentInjector);

	public openDialog(args: TFrsDialogArgs): ComponentRef<FrsDialog> {
		const { content, title, data } = args;

		if (!content) {
			throw 'Without content, please make sure to pass the content as argument.';
		}

		const componentRef = createComponent(FrsDialog, {
			environmentInjector: this._injector,
		});

		componentRef.setInput('content', content);

		if (title) {
			componentRef.setInput('dialogTitle', title);
		}

		if (data) {
			try {
				componentRef.setInput('data', args.data);
			} catch {
				throw 'No data input declared, please check the content component.';
			}
		}

		this._appRef.attachView(componentRef.hostView);
		document.body.getElementsByTagName('app-root')[0]?.appendChild((componentRef.hostView as any).rootNodes[0]);

		this._componentRefs.push(componentRef);
		return componentRef;
	}

	public openAlertDialog(args: TFrsAlertDialogArgs): void {
		const componentRef = createComponent(FrsDialog, {
			environmentInjector: this._injector,
		});

		componentRef.setInput('content', FrsAlertDialog);
		componentRef.setInput('dialogTitle', 'alert-dialog');
		componentRef.setInput('data', args);

		this._appRef.attachView(componentRef.hostView);
		document.body.getElementsByTagName('app-root')[0]?.appendChild((componentRef.hostView as any).rootNodes[0]);

		this._componentRefs.push(componentRef);
	}

	public closeDialog(componentRef?: ComponentRef<FrsDialog>): void {
		if (componentRef) {
			const index = this._componentRefs.indexOf(componentRef);

			if (index !== -1) {
				this._componentRefs.splice(index, 1);
				this._appRef.detachView(componentRef.hostView);
				componentRef.destroy();
			}
		} else {
			this._componentRefs.at(-1)?.instance.closeDialog();

			setTimeout(() => {
				this._componentRefs.at(-1)?.destroy();
				this._componentRefs.pop();
			}, 300);
		}
	}
}

export type TFrsDialogArgs = {
	content: any;
	title?: string;
	data?: unknown;
};

export type TFrsAlertDialogArgs = {
	title?: string;
	description?: string;
	cancelButtonText?: string;
	actionButtonText?: string;
	loading: Signal<boolean> | WritableSignal<boolean>;
	action: () => void;
};
