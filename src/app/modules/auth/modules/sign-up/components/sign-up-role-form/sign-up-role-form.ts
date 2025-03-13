import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, type FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FrsButtonModule } from '@fresco-ui/button/button.module';
import { SignUpRoleCard } from '../sign-up-role-card/sign-up-role-card';

@Component({
	selector: 'sign-up-role-form',
	templateUrl: 'sign-up-role-form.html',
	imports: [FrsButtonModule, ReactiveFormsModule, SignUpRoleCard],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignUpRoleForm {
	private readonly _formBuilder = inject(FormBuilder);

	public readonly inputRole = this._formBuilder.control('', Validators.required);

	protected readonly _roleForm = this._formBuilder.group({
		option: this.inputRole
	});

	protected _onSubmit() {
		if (this._roleForm.valid) {
			const selectedOption = this.inputRole.value;
			console.log('Opción seleccionada:', selectedOption);
		}
	}

	public getRoleForm(): FormGroup {
		return this._roleForm;
	}
}
