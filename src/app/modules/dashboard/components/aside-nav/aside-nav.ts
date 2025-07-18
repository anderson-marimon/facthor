import { AfterViewInit, Component, inject, input, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TModulePermission } from '@dashboard/api/user-configuration';
import { AsideLink } from '@dashboard/components/aside-nav/aside-link/aside-link';
import { distinctUntilChanged, filter, map } from 'rxjs';

@Component({
	selector: 'aside-nav',
	templateUrl: 'aside-nav.html',
	imports: [AsideLink],
})
export class AsideNav implements AfterViewInit {
	public readonly permissions = input<TModulePermission[]>([]);
	private readonly _router = inject(Router);
	protected readonly _active = signal('/dashboard/home');

	public ngAfterViewInit(): void {
		this.addSubscription();
	}

	private addSubscription(): void {
		this._router.events
			.pipe(
				filter((event) => event instanceof NavigationEnd),
				map((event: NavigationEnd) => event.urlAfterRedirects),
				distinctUntilChanged()
			)
			.subscribe((url: string) => {
				console.log(url);
				this._active.set(url);
			});
	}
}
