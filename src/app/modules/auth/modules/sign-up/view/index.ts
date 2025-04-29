import { type AfterViewInit, ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SignUpAccountForm } from '@auth/modules/sign-up/components/form-account/form-account';
import { SignUpBusinessForm } from '@auth/modules/sign-up/components/form-business/form-business';
import { SignUpDocumentsForm } from '@auth/modules/sign-up/components/form-documents/form-documents';
import { SignUpRoleForm } from '@auth/modules/sign-up/components/form-role/form-role';
import { SignUpRoleStep } from '@auth/modules/sign-up/components/role-step/role-step';
import { FrsButtonModule } from '@fresco-ui/frs-button';

@Component({
	selector: 'sign-up-page',
	templateUrl: 'index.html',
	imports: [FrsButtonModule, RouterLink, SignUpRoleStep, SignUpRoleForm, SignUpBusinessForm, SignUpDocumentsForm, SignUpAccountForm],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SignUpPage implements AfterViewInit {
	private readonly _roleForm = viewChild(SignUpRoleForm);
	private readonly _businessForm = viewChild(SignUpBusinessForm);
	private readonly _documentsForm = viewChild(SignUpDocumentsForm);
	private readonly _accountForm = viewChild(SignUpAccountForm);

	protected readonly _currentStep = signal(0);
	protected readonly _formSteps = signal(Array(5).fill(false));

	public ngAfterViewInit(): void {
		this._setStep(3);
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

	private _confirmDocumentsForm(): void {
		const documentsForm = this._documentsForm();
		if (!documentsForm) {
			throw new Error('No se encontró el formulario de documentación, por favor revisar la implementación');
		}

		const formData = documentsForm.getDocumentsForm();

		if (formData.invalid) {
			formData.markAllAsTouched();
			return;
		}

		this._setStep(3);
	}

	private _confirmAccountForm(): void {
		const accountForm = this._accountForm();
		if (!accountForm) {
			throw new Error('No se encontró el formulario de configuración de cuenta, por favor revisar la implementación');
		}

		const formData = accountForm.getAccountForm();

		if (formData.invalid) {
			formData.markAsUntouched();
			return;
		}

		this._setStep(4);
	}

	protected _nextStep(): void {
		switch (this._currentStep()) {
			case 0:
				this._confirmRoleForm();
				break;
			case 1:
				this._confirmBusinessForm();
				break;
			case 2:
				this._confirmDocumentsForm();
				break;
			case 3:
				this._confirmAccountForm();
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
			case 2:
				return this._documentsForm()?.getDocumentsForm().invalid ?? true;
			case 3:
				return this._accountForm()?.getAccountForm().invalid ?? true;
			default:
				return true;
		}
	}

	protected _isAvailablePreviousStep(): boolean {
		return this._currentStep() === 0;
	}
}
