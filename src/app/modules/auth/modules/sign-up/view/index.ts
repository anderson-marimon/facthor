import { type AfterViewInit, ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FrsButtonDirective } from '@fresco-ui/button/button.directive';
import { SignUpStep } from '../components/sign-up-step/sign-up-step';
import { SignUpRoleForm } from '../components/sign-up-role-form/sign-up-role-form';
import { SignUpBusinessForm } from '../components/sign-up-business-form/sign-up-business-form';

@Component({
	selector: 'sign-up-page',
	templateUrl: 'index.html',
	imports: [SignUpStep, RouterLink, FrsButtonDirective, SignUpRoleForm, SignUpBusinessForm],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export default class SignUpPage implements AfterViewInit {
	private readonly _roleForm = viewChild(SignUpRoleForm);

	protected readonly _currentStep = signal(0);
	protected readonly _formSteps = signal(Array(5).fill(false));

	public ngAfterViewInit(): void {
		this._setStep(0);
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

	protected _nextStep(): void {
		switch (this._currentStep()) {
			case 0:
				this._confirmRoleForm();
				break;
		}
	}

	protected _previousStep(): void {
		if (this._currentStep() > 0) {
			console.log();
			this._setStep(this._currentStep() - 1);
		}
	}

	protected _isAvailableNextStep(): boolean {
		switch (this._currentStep()) {
			case 0:
				return this._roleForm()?.getRoleForm().invalid ?? true;
			default:
				return true;
		}
	}

	protected _isAvailablePreviousStep(): boolean {
		return this._currentStep() === 0;
	}
}
