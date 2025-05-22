import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { TIdentity, TRoleExecution } from '@dashboard/api/user-configuration';
import { FrsAvatarModule } from '@fresco-ui/frs-avatar';

@Component({
	selector: 'top-bar',
	templateUrl: 'top-bar.html',
	imports: [CommonModule, FrsAvatarModule],
})
export class TopBar {
	public identify = input<Nullable<TIdentity>>(null);
	public roleExecution = input<Nullable<TRoleExecution[]>>(null);
}
