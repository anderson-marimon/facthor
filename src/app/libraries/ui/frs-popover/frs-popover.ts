import {
	afterNextRender,
	Component,
	computed,
	contentChild,
	DestroyRef,
	effect,
	ElementRef,
	HostListener,
	inject,
	input,
	signal,
} from '@angular/core';
import { outputToObservable, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { frs } from '@fresco-core/frs-core';
import { FrsPopoverContent } from '@fresco-ui/frs-popover/frs-popover-content';
import { FrsPopoverTrigger } from '@fresco-ui/frs-popover/frs-popover-trigger';
import { fromEvent, throttleTime, timer } from 'rxjs';

@Component({
	selector: 'frs-popover',
	standalone: true,
	host: {
		'[class]': '_frsClass()',
	},
	template: `
		<ng-content select="frs-popover-trigger" />
		@if (isOpen()) {
		<ng-content select="frs-popover-content" />
		}
	`,
})
export class FrsPopover {
	private readonly _element = inject(ElementRef);
	private readonly _destroyRef = inject(DestroyRef);
	private readonly _trigger = contentChild(FrsPopoverTrigger);
	private readonly _content = contentChild(FrsPopoverContent);
	private readonly _isOpen = signal(false);

	public readonly class = input('');
	public readonly disabled = input(false);
	public readonly isOpen = computed(() => this._isOpen());

	public constructor() {
		this._verifyTrigger();

		afterNextRender(() => {
			this._syncTriggerAndHoverListeners();
		});
	}

	private _syncTriggerAndHoverListeners(): void {
		const trigger = this._trigger();
		if (!trigger) return;

		if (trigger.triggerType() === 'click') {
			outputToObservable(trigger.popoverOpen)
				.pipe(throttleTime(200), takeUntilDestroyed(this._destroyRef))
				.subscribe(() => this.toggle());
		} else {
			fromEvent(this._element.nativeElement, 'mouseenter')
				.pipe(throttleTime(200), takeUntilDestroyed(this._destroyRef))
				.subscribe(() => this.open());

			fromEvent(this._element.nativeElement, 'mouseleave')
				.pipe(throttleTime(200), takeUntilDestroyed(this._destroyRef))
				.subscribe(() => this.closeWithDelay());
		}
	}

	public open(): void {
		this._isOpen.set(true);
		this._content()?.setState('visible');
		this._trigger()?.emitTriggerEvent();
	}

	public closeWithDelay(): void {
		this._content()?.setState('void');
		timer(200)
			.pipe(takeUntilDestroyed(this._destroyRef))
			.subscribe(() => {
				this._isOpen.set(false);
				this._trigger()?.emitTriggerEvent();
			});
	}

	public toggle(): void {
		if (this._isOpen()) {
			this.closeWithDelay();
		} else {
			this.open();
		}
	}

	public close(): void {
		this.closeWithDelay();
	}

	private _verifyTrigger(): void {
		effect(() => {
			const trigger = this._trigger();

			if (!trigger) {
				throw new Error('The popover component must contain a popover trigger');
			}

			trigger.setDisabled(this.disabled());
		});
	}

	@HostListener('document:click', ['$event'])
	private _handleDocumentClick(event: Event): void {
		const popover = this._content();
		if (!popover || popover.getState() !== 'visible') return;

		if (!this._element.nativeElement.contains(event.target)) {
			this.closeWithDelay();
		}
	}

	@HostListener('document:keyup.esc', ['$event'])
	private _closePopover(event: Event): void {
		event.preventDefault();
		this.close();
	}

	protected readonly _frsClass = computed(() =>
		frs(
			'block relative w-full h-max-content',
			this.disabled() ? 'opacity-50 cursor-not-allowed pointer-events-none select-none' : '',
			this.class()
		)
	);
}
