import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { AccessInformationStore } from '@authentication/modules/sign-in/stores/access-information';
import { FrsAvatarModule } from '@fresco-ui/frs-avatar';

@Component({
	selector: 'top-bar',
	templateUrl: 'top-bar.html',
	providers: [AccessInformationStore],
	imports: [CommonModule, FrsAvatarModule],
})
export class TopBar {
	private readonly _storeAccessInformation = inject(AccessInformationStore);
	protected readonly _user = signal<Record<string, any>>({});

	constructor() {
		this._addSubscription();
	}
	private _addSubscription(): void {
		this._storeAccessInformation.user.subscribe((user) => this._user.set(user));
	}
}
