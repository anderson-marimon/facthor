import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal, viewChild } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { ApiPostSignUp } from '@authentication/modules/sign-up/api/sign-up-post';
import { SignUpAccountForm } from '@authentication/modules/sign-up/components/form-account/form-account';
import { SignUpBusinessForm } from '@authentication/modules/sign-up/components/form-business/form-business';
import { SignUpDocumentsForm } from '@authentication/modules/sign-up/components/form-documents/form-documents';
import { SignUpRoleForm } from '@authentication/modules/sign-up/components/form-role/form-role';
import { SignUpFormSummary } from '@authentication/modules/sign-up/components/form-summary/form-summary';
import { SignUpRoleStep } from '@authentication/modules/sign-up/components/role-step/role-step';
import { SignUpFormStore } from '@authentication/modules/sign-up/stores/sign-up-form';
import { FrsButtonModule } from '@fresco-ui/frs-button';
import { FrsDialogRef } from '@fresco-ui/frs-dialog/frs-service';
import { LoadingIcon } from '@shared/icons/loading-icon/loading-icon';
import { distinctUntilChanged } from 'rxjs';

@Component({
	selector: 'authentication-sign-up-page',
	templateUrl: 'index.html',
	providers: [SignUpFormStore],
	viewProviders: [ApiPostSignUp],
	imports: [
		FrsButtonModule,
		LoadingIcon,
		RouterLink,
		SignUpRoleStep,
		SignUpRoleForm,
		SignUpBusinessForm,
		SignUpDocumentsForm,
		SignUpAccountForm,
		SignUpFormSummary,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SignUpPage {
	private readonly _destroyRef = inject(DestroyRef);
	private readonly _router = inject(Router);
	private readonly _apiPostSignUp = inject(ApiPostSignUp);
	private readonly _roleForm = viewChild.required<SignUpRoleForm>(SignUpRoleForm);
	private readonly _businessForm = viewChild.required<SignUpBusinessForm>(SignUpBusinessForm);
	private readonly _documentsForm = viewChild.required<SignUpDocumentsForm>(SignUpDocumentsForm);
	private readonly _accountForm = viewChild.required<SignUpAccountForm>(SignUpAccountForm);
	private readonly _summary = viewChild.required<SignUpFormSummary>(SignUpFormSummary);
	private readonly _signUpFormStore = inject(SignUpFormStore);
	private readonly _dialogRef = inject(FrsDialogRef);

	protected readonly _isLoadingApiPostSignUp = this._apiPostSignUp.isLoading;
	protected readonly _isAvailableNextStep = signal(true);
	protected readonly _currentStep = signal(0);
	protected readonly _formSteps = signal(Array(5).fill(false));
	protected readonly _selectedRole = signal<string>('1');

	constructor() {
		this._setStep(0);
		this._synRole();
		this._syncCloseRegisterDialog();
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

	private _synRole(): void {
		this._signUpFormStore
			.select((state) => state.roleForm)
			.pipe(takeUntilDestroyed(this._destroyRef), distinctUntilChanged())
			.subscribe(({ option }) => {
				if (!option) return;
				this._selectedRole.set(option);
			});
	}

	private _syncCloseRegisterDialog(): void {
		toObservable(this._apiPostSignUp.response)
			.pipe(takeUntilDestroyed(this._destroyRef))
			.subscribe((value) => {
				if (value !== true) return;
				this._dialogRef.closeDialog();
				this._router.navigate(['authentication/sign-in'], { replaceUrl: true });
			});
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
			() => {
				this._dialogRef.openAlertDialog({
					title: '¿Estás seguro de enviar el formulario de registro?',
					description:
						'Por favor, revisa bien toda la información antes de enviarla, una vez enviado el registro, no puede ser modificado.',
					action: () => this._summary().sendForm(),
					loading: this._isLoadingApiPostSignUp,
				});
			},
		];

		stepActions[this._currentStep()]?.();
	}

	protected _previousStep(): void {
		if (this._currentStep() > 0 && !this._isLoadingApiPostSignUp()) {
			this._setStep(this._currentStep() - 1);
		}
	}

	protected _onFormChange(isInvalid: boolean): void {
		this._isAvailableNextStep.set(isInvalid);
	}

	protected _isAvailablePreviousStep(): boolean {
		return this._currentStep() === 0 && !this._isLoadingApiPostSignUp();
	}
}
