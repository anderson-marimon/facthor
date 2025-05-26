import { animate, style, transition, trigger } from '@angular/animations';
import { Component, input, signal } from '@angular/core';
import { TSubmodulePermission } from '@dashboard/api/user-configuration';
import { AsideSubLink } from '@dashboard/components/aside-nav/aside-sub-link/aside-sub-link';
import { ChevronDown, LucideAngularModule } from 'lucide-angular';

@Component({
	selector: 'aside-link',
	templateUrl: 'aside-link.html',
	animations: [
		trigger('subRoutes', [
			transition(':enter', [style({ height: '0', overflow: 'hidden' }), animate('300ms ease-out', style({ height: '*', overflow: 'hidden' }))]),
			transition(':leave', [style({ overflow: 'hidden' }), animate('300ms ease-out', style({ height: '0', overflow: 'hidden' }))]),
		]),
	],
	imports: [AsideSubLink, LucideAngularModule],
})
export class AsideLink {
	public readonly label = input('label');
	public readonly href = input('');
	public readonly icon = input(ChevronDown);
	public readonly subModules = input<TSubmodulePermission[]>([]);
	public readonly activeRoute = input('');

	protected readonly _openSubRoutes = signal(true);

	protected _onClickOpenSubRoutes(): void {
		this._openSubRoutes.update((value) => !value);
	}
}
