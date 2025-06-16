import { CommonModule } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { envs } from '@app/envs/envs';
import { TIdentity, TRoleExecution } from '@dashboard/api/user-configuration';
import { FrsAvatarModule } from '@fresco-ui/frs-avatar';
import { FrsButtonModule } from '@fresco-ui/frs-button';
import { FrsPopoverModule } from '@fresco-ui/frs-popover';
import { FacthorLogo } from '@shared/logos/facthor-logo/facthor-logo';
import Cookies from 'js-cookie';
import { LogOut, LucideAngularModule } from 'lucide-angular';
import { toast } from 'ngx-sonner';
@Component({
	selector: 'top-bar',
	templateUrl: 'top-bar.html',
	imports: [CommonModule, FacthorLogo, FrsAvatarModule, FrsButtonModule, FrsPopoverModule, LucideAngularModule],
})
export class TopBar {
	public readonly identity = input<Nullable<TIdentity>>(null);
	public readonly roleExecution = input<Nullable<TRoleExecution>>(null);

	private readonly _router = inject(Router);
	protected readonly _closeIcon = LogOut;

	protected _onClickCloseSession(closeFunction: () => void): void {
		Cookies.remove(envs.FT_AUTHENTICATION_TOKEN_PATH);
		closeFunction();

		this._router.navigate(['authentication/sign-in']).then(() => {
			toast.message('Hasta pronto', { description: 'Sesión cerrada correctamente.' });
		});
	}
}
