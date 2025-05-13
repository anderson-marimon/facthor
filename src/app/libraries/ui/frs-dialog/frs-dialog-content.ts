import { animate, state, style, transition, trigger } from '@angular/animations';
import { type AfterViewInit, Component, computed, DestroyRef, inject, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { frs } from '@fresco-core/frs-core';
import { FrsButtonModule } from '@fresco-ui/frs-button';
import { FrsDialogRef } from '@fresco-ui/frs-dialog/frs-service';
import { LucideAngularModule, X } from 'lucide-angular';
import { timer } from 'rxjs';

@Component({
	selector: 'frs-dialog-content',
	standalone: true,
	imports: [FrsButtonModule, LucideAngularModule],
	host: {
		'[class]': '_frsClass()',
		'(click)': '$event.stopPropagation()',
		'[@openCloseDialogContent]': '_state()',
	},
	animations: [
		trigger('openCloseDialogContent', [
			state('visible', style({ transform: 'scale(1) translateY(0)' })),
			state('void', style({ transform: 'scale(0.95) translateY(5px)' })),
			transition('visible <=> void', animate('300ms ease')),
		]),
	],
	template: `
		<button frs-button [variant]="'ghost'" [size]="'icon'" (click)="close()">
			<i-lucide [img]="_xIcon" />
		</button>
		<ng-content />
	`,
})
export class FrsDialogContent implements AfterViewInit {
	private readonly _destroyRef = inject(DestroyRef);
	private readonly _dialogService = inject(FrsDialogRef);

	public readonly closeEmit = output();

	protected readonly _state = signal<'visible' | 'void'>('void');
	protected readonly _xIcon = X;

	public close(): void {
		this._state.set('void');
		timer(10)
			.pipe(takeUntilDestroyed(this._destroyRef))
			.subscribe(() => this.closeEmit.emit());

		timer(300)
			.pipe(takeUntilDestroyed(this._destroyRef))
			.subscribe(() => this._dialogService.closeDialog());
	}

	public ngAfterViewInit(): void {
		timer(0)
			.pipe(takeUntilDestroyed(this._destroyRef))
			.subscribe(() => this._state.set('visible'));
	}

	protected readonly _frsClass = computed(() =>
		frs(
			`relative min-w-24 max-w-[90vw] w-fit h-fit text-foreground p-6 rounded-md border bg-background
			[&>_button]:absolute [&>_button]:top-[10px] [&>_button]:right-[10px] overflow-hidden text-wrap`
		)
	);
}
