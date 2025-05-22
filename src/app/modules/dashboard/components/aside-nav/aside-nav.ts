import { Component, input } from '@angular/core';
import { TModulePermission } from '@dashboard/api/user-configuration';
import { AsideLink } from '@dashboard/components/aside-nav/aside-link/aside-link';
import { FacthorLogo } from '@shared/logos/facthor-logo/facthor-logo';

@Component({
	selector: 'aside-nav',
	templateUrl: 'aside-nav.html',
	imports: [FacthorLogo, AsideLink],
})
export class AsideNav {
	public readonly permissions = input<TModulePermission[]>([]);
}
