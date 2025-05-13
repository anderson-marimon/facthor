import { animate, state, style, transition, trigger } from '@angular/animations';
import { type AfterViewInit, Component, computed, contentChild, effect, HostListener, signal } from '@angular/core';
import { frs } from '@fresco-core/frs-core';
import { FrsDialogContent } from '@fresco-ui/frs-dialog/frs-dialog-content';

@Component({
	selector: 'frs-dialog-overlay',
	standalone: true,
	host: {
		'[class]': '_frsClass()',
		'(click)': '_closeDialog($event)',
		'[@openClose]': '_state()',
	},
	animations: [
		trigger('openClose', [
			state('visible', style({ opacity: 1 })),
			state('void', style({ opacity: 0 })),
			transition('visible <=> void', animate('300ms ease')),
		]),
	],
	template: '<ng-content />',
})
export class FrsDialogOverlay implements AfterViewInit {
	private readonly _dialogContent = contentChild(FrsDialogContent);

	protected readonly _state = signal<'visible' | 'void'>('visible');

	constructor() {
		this._syncTriggers();
	}

	private _syncTriggers(): void {
		effect(() => {
			const dialogContent = this._dialogContent();
			if (dialogContent) {
				dialogContent.closeEmit.subscribe(() => this._state.set('void'));
			}
		});
	}

	@HostListener('window:keyup.esc', ['$event'])
	protected _closeDialog(event: Event): void {
		event.stopPropagation();

		this._dialogContent()?.close();
	}

	public ngAfterViewInit(): void {}

	protected readonly _frsClass = computed(() =>
		frs('absolute top-0 left-0 w-screen h-svh grid place-content-center bg-background/50 backdrop-blur-sm')
	);
}
