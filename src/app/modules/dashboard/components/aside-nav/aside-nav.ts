import { Component, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TModulePermission } from '@dashboard/api/user-configuration';
import { AsideLink } from '@dashboard/components/aside-nav/aside-link/aside-link';

@Component({
	selector: 'aside-nav',
	templateUrl: 'aside-nav.html',
	imports: [AsideLink],
})
export class AsideNav {
	public readonly permissions = input<TModulePermission[]>([]);

	private readonly _router = inject(Router);
	protected readonly _active = signal('');

	constructor() {
		this.addSubscription();
	}

	private addSubscription(): void {
		this._router.events.subscribe(() => {
			this._active.set(this._router.url);
		});
	}
}
