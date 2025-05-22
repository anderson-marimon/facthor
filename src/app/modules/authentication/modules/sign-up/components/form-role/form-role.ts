import { afterNextRender, ChangeDetectionStrategy, Component, DestroyRef, inject, output, viewChildren } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, type FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SignUpRoleCard } from '@authentication/modules/sign-up/components/role-card/role-card';
import { SignUpFormStore } from '@authentication/modules/sign-up/stores/sign-up-form';
import { FrsButtonModule } from '@fresco-ui/frs-button';
import { FacthorLogo } from '@shared/logos/facthor-logo/facthor-logo';
import { toast } from 'ngx-sonner';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
	selector: 'sign-up-role-form',
	templateUrl: 'form-role.html',
	host: { class: 'flex-1' },
	imports: [FrsButtonModule, ReactiveFormsModule, SignUpRoleCard, FacthorLogo],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignUpRoleForm {
	private readonly _roleCard = viewChildren(SignUpRoleCard);
	private readonly _signUpFormStore = inject(SignUpFormStore);
	private readonly _formBuilder = inject(FormBuilder);
	private readonly _destroyRef = inject(DestroyRef);

	public readonly formChange = output<boolean>();

	protected readonly _role = this._formBuilder.control('', Validators.required);
	protected readonly _form = this._formBuilder.group({ option: this._role });

	constructor() {
		afterNextRender(() => {
			this._fillForm();
			this._onSelectRole();
		});
	}

	private _onSelectRole(): void {
		this._form.valueChanges.pipe(takeUntilDestroyed(this._destroyRef), debounceTime(0)).subscribe(({ option }) => {
			this._setSelectedRole(option || '0');
		});
	}

	private _setSelectedRole(selectedRole: string): void {
		const roles = this._roleCard();
		if (roles.length === 0) return;

		roles.forEach((role) => {
			if (role.value() === selectedRole) {
				return role.setSelected(true);
			}

			role.setSelected(false);
		});

		this.formChange.emit(this._form.invalid);
	}

	private _fillForm(): void {
		this._signUpFormStore
			.select((state) => state.roleForm)
			.pipe(takeUntilDestroyed(this._destroyRef), distinctUntilChanged())
			.subscribe(({ option }) => {
				if (this._role.value !== option) {
					this._role.setValue(option, { emitEvent: false });
					this._setSelectedRole(option);
				}
			});
	}

	public isInvalid(): boolean {
		return this._form.invalid;
	}

	public getForm(): FormGroup {
		return this._form;
	}
}
