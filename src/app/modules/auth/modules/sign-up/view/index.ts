import { ChangeDetectionStrategy, Component, inject, signal, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SignUpAccountForm } from '@auth/modules/sign-up/components/form-account/form-account';
import { SignUpBusinessForm } from '@auth/modules/sign-up/components/form-business/form-business';
import { SignUpDocumentsForm } from '@auth/modules/sign-up/components/form-documents/form-documents';
import { SignUpRoleForm } from '@auth/modules/sign-up/components/form-role/form-role';
import { SignUpRoleStep } from '@auth/modules/sign-up/components/role-step/role-step';
import { SignUpFormStore } from '@auth/modules/sign-up/stores/sign-up.store';
import { FrsButtonModule } from '@fresco-ui/frs-button';

@Component({
	selector: 'sign-up-page',
	templateUrl: 'index.html',
	providers: [SignUpFormStore],
	imports: [FrsButtonModule, RouterLink, SignUpRoleStep, SignUpRoleForm, SignUpBusinessForm, SignUpDocumentsForm, SignUpAccountForm],
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
})
export default class SignUpPage {
	private readonly _roleForm = viewChild.required<SignUpRoleForm>(SignUpRoleForm);
	private readonly _businessForm = viewChild.required<SignUpBusinessForm>(SignUpBusinessForm);
	private readonly _documentsForm = viewChild.required<SignUpDocumentsForm>(SignUpDocumentsForm);
	private readonly _accountForm = viewChild.required<SignUpAccountForm>(SignUpAccountForm);
	private readonly _signUpFormStore = inject(SignUpFormStore);

	protected readonly _isAvailableNextStep = signal(true);
	protected readonly _currentStep = signal(0);
	protected readonly _formSteps = signal(Array(5).fill(false));

	constructor() {
		this._setStep(0);
	}

	private _setStep(index: number): void {
		this._formSteps.update((steps) => steps.map((_, i) => i <= index));
		this._currentStep.set(index);
	}

	private _validateForm(form: any): boolean {
		const formData = form.getForm();
		if (formData.invalid) {
			formData.markAllAsTouched();
			return false;
		}
		return true;
	}

	protected _nextStep(): void {
		const stepActions = [
			() => {
				const form = this._roleForm();
				if (this._validateForm(form)) {
					this._signUpFormStore.setRoleForm(form.getForm().value);
					this._setStep(1);
				}
			},
			() => {
				const form = this._businessForm();
				if (this._validateForm(form)) {
					this._setStep(2);
				}
			},
			() => {
				const form = this._documentsForm();
				if (this._validateForm(form)) {
					this._setStep(3);
				}
			},
			() => {
				const form = this._accountForm();
				if (this._validateForm(form)) {
					this._setStep(4);
				}
			},
		];

		stepActions[this._currentStep()]?.();
	}

	protected _previousStep(): void {
		if (this._currentStep() > 0) {
			this._setStep(this._currentStep() - 1);
		}
	}

	protected _onFormChange(isInvalid: boolean): void {
		this._isAvailableNextStep.set(isInvalid);
	}

	protected _isAvailablePreviousStep(): boolean {
		return this._currentStep() === 0;
	}
}
