import { type AfterViewInit, ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SignUpBusinessForm } from '@auth/modules/sign-up/components/form-business/form-business';
import { SignUpDocumentsForm } from '@auth/modules/sign-up/components/form-documents/form-documents';
import { SignUpRoleForm } from '@auth/modules/sign-up/components/form-role/form-role';
import { SignUpRoleStep } from '@auth/modules/sign-up/components/role-step/role-step';
import { FrsButtonModule } from '@fresco-ui/frs-button';

@Component({
	selector: 'sign-up-page',
	templateUrl: 'index.html',
	imports: [SignUpRoleStep, RouterLink, FrsButtonModule, SignUpBusinessForm, SignUpRoleForm, SignUpDocumentsForm],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SignUpPage implements AfterViewInit {
	private readonly _roleForm = viewChild(SignUpRoleForm);
	private readonly _businessForm = viewChild(SignUpBusinessForm);

	protected readonly _currentStep = signal(0);
	protected readonly _formSteps = signal(Array(5).fill(false));

	public ngAfterViewInit(): void {
		this._setStep(2);
	}

	private _setStep(index: number): void {
		const newSteps = this._formSteps().map((_, _index) => {
			return _index <= index;
		});

		this._formSteps.set(newSteps);
		this._currentStep.set(index);
	}

	private _confirmRoleForm(): void {
		const roleForm = this._roleForm();
		if (!roleForm) {
			throw new Error('No se encontró el formulario de roles, por favor revisar la implementación');
		}

		const formData = roleForm.getRoleForm();

		if (formData.invalid) {
			formData.markAllAsTouched();
			return;
		}

		this._setStep(1);
	}

	private _confirmBusinessForm(): void {
		const businessForm = this._businessForm();
		if (!businessForm) {
			throw new Error('No se encontró el formulario del negocio, por favor revisar la implementación');
		}

		const formData = businessForm.getBusinessForm();

		if (formData.invalid) {
			formData.markAllAsTouched();
			return;
		}

		this._setStep(2);
	}

	protected _nextStep(): void {
		switch (this._currentStep()) {
			case 0:
				this._confirmRoleForm();
				break;
			case 1:
				this._confirmBusinessForm();
				break;
		}
	}

	protected _previousStep(): void {
		if (this._currentStep() > 0) {
			this._setStep(this._currentStep() - 1);
		}
	}

	protected _isAvailableNextStep(): boolean {
		switch (this._currentStep()) {
			case 0:
				return this._roleForm()?.getRoleForm().invalid ?? true;

			case 1:
				return this._businessForm()?.getBusinessForm().invalid ?? true;
			default:
				return true;
		}
	}

	protected _isAvailablePreviousStep(): boolean {
		return this._currentStep() === 0;
	}
}
