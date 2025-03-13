import { type AfterViewInit, ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FrsButtonDirective } from '@fresco-ui/button/button.directive';
import { SignUpStep } from '../components/sign-up-step/sign-up-step';
import { SignUpRoleForm } from '../components/sign-up-role-form/sign-up-role-form';

@Component({
	selector: 'sign-up-page',
	templateUrl: 'index.html',
	imports: [SignUpStep, RouterLink, FrsButtonDirective, SignUpRoleForm],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export default class SignUpPage implements AfterViewInit {
	private readonly _roleForm = viewChild(SignUpRoleForm);
	private readonly _currentStep = 0;
	protected readonly _formSteps = signal(Array(5).fill(false));

	private _startForm(): void {
		this._setStep(0, true);
	}

	private _setStep(index: number, value: boolean) {
		this._formSteps.update(steps => {
			const newSteps = [...steps];
			newSteps[index] = value;
			return newSteps;
		});
	}

	private _confirmRoleForm(): void {
		const roleForm = this._roleForm();
		if (!roleForm) {
			throw 'No se encontró el formulario de roles, por favor revisar la implementación';
		}

		const formData = roleForm.getRoleForm();

		if (formData.invalid) {
			formData.markAllAsTouched();
			return;
		}

		console.log(formData.value);
		this._setStep(1, true);
	}

	protected _nextStep(): void {
		switch (this._currentStep) {
			case 0:
				this._confirmRoleForm();
		}
	}

	public ngAfterViewInit(): void {
		this._startForm();
	}
}
