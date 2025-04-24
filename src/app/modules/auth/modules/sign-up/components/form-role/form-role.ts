import { type AfterViewInit, ChangeDetectionStrategy, Component, DestroyRef, inject, viewChildren } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, type FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FrsButtonModule } from '@fresco-ui/frs-button';
import { FacthorLogo } from '@shared/logos/facthor-logo/facthor-logo';
import { SignUpRoleCard } from '../role-card/role-card';

@Component({
	selector: 'sign-up-role-form',
	templateUrl: 'form-role.html',
	host: { class: 'flex-1' },
	imports: [FrsButtonModule, ReactiveFormsModule, SignUpRoleCard, FacthorLogo],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignUpRoleForm implements AfterViewInit {
	private readonly _formBuilder = inject(FormBuilder);
	private readonly _destroyRef = inject(DestroyRef);
	private readonly _roleCard = viewChildren(SignUpRoleCard);

	public readonly inputRole = this._formBuilder.control('', Validators.required);

	protected readonly _roleForm = this._formBuilder.group({ option: this.inputRole });

	private _onSelectRole(): void {
		this._roleForm.valueChanges.pipe(takeUntilDestroyed(this._destroyRef)).subscribe(({ option }) => {
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
	}

	protected _onSubmit() {
		if (this._roleForm.valid) {
			const selectedOption = this.inputRole.value;
			console.log('Opción seleccionada:', selectedOption);
		}
	}

	public getRoleForm(): FormGroup {
		return this._roleForm;
	}

	public ngAfterViewInit(): void {
		this._onSelectRole();
	}
}
