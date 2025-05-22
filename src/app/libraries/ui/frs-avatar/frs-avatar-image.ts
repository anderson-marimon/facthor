import { NgOptimizedImage } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { DomSanitizer, type SafeUrl } from '@angular/platform-browser';
import { frs } from '@fresco-core/frs-core';

const image =
	'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExZXVoN2ZkYng4MGxzcj' +
	'B0amM0MWw2bDUxeXNkbm15b2RmYzJhcHZibSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Z1BTGhofioRxK/giphy.gif';

@Component({
	selector: 'frs-avatar-image',
	standalone: true,
	imports: [NgOptimizedImage],
	template: `
		@if (_src()) {
			<img [class]="_frsClass()" [ngSrc]="_sanitizedSrc()" [alt]="alt()" width="50" height="50" priority="auto" />
		}
	`,
})
export class FrsAvatarImage {
	private readonly _sanitizer = inject(DomSanitizer);

	public readonly _src = input(image);
	public readonly alt = input('Avatar Image');

	protected _sanitizedSrc(): SafeUrl {
		return this._sanitizer.bypassSecurityTrustUrl(this._src());
	}

	protected _frsClass(): string {
		return frs('absolute top-0 left-0 w-full h-full rounded-full');
	}
}
