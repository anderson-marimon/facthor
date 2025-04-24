import { Injectable } from '@angular/core';
import type { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { calculateAge } from '@shared/utils/calculate-age.util';
import { verificationNumberCalculator } from '@shared/utils/verification-number-calculator';

@Injectable({
	providedIn: 'root',
})
export class FormValidator {
	public name(): ValidatorFn {
		return (control: AbstractControl): ValidationErrors | null => {
			const { value = '' } = control;
			const regex = /^(?!.*[&.]$)(?!^[&.])[A-Za-zÁáÉéÍíÓóÚúÜüÑñ' &.]+$/;

			if (!regex.test(value) || value.startsWith(' ') || value.endsWith(' ')) return { invalidName: true };
			return null;
		};
	}

	public nit(): ValidatorFn {
		return (control: AbstractControl): ValidationErrors | null => {
			const value = control.value ?? '';
			const regex = /^\d+$/;

			const [nit, verificationDigit] = value.split('-');

			if (!regex.test(nit)) {
				return { invalidNit: true };
			}

			if (nit.length < 9 || nit.length > 10) {
				return { invalidNitMinMax: true };
			}

			if (nit.length > 8 || nit.length < 11) {
				if (!value.includes('-')) return { pendingVerificationNumber: true };

				if (verificationDigit.length > 1) return { invalidNit: true };

				const calculatedDigit = verificationNumberCalculator(nit);

				if (calculatedDigit !== verificationDigit) {
					return { invalidVerificationNumberNit: true };
				}
			}

			return null;
		};
	}

	public dni(): ValidatorFn {
		return (control: AbstractControl): ValidationErrors | null => {
			const value = control.value ?? '';
			const regex = /^\d+$/;

			if (!regex.test(value)) return { invalidNit: true };
			if (value.length < 7 || value.length > 10) return { invalidDniMinMax: true };

			return null;
		};
	}

	public phoneNumber(): ValidatorFn {
		return (control: AbstractControl): ValidationErrors | null => {
			const value = control.value ?? '';
			const regex = /^3\d{9}$/;

			if (!regex.test(value)) return { invalidPhoneNumber: true };
			return null;
		};
	}

	public atLeast18Years(): ValidatorFn {
		return (control: AbstractControl): ValidationErrors | null => {
			const value = control.value;
			if (!value) return null;

			const birthDate = new Date(value);
			if (isNaN(birthDate.getTime())) return { invalidDate: true };

			const today = new Date();
			const age = calculateAge(birthDate, today);

			if (age < 18) return { under18: true };
			return null;
		};
	}

	public atMost80Years(): ValidatorFn {
		return (control: AbstractControl): ValidationErrors | null => {
			const value = control.value;
			if (!value) return null;

			const birthDate = new Date(value);
			if (isNaN(birthDate.getTime())) return { invalidDate: true };

			const today = new Date();
			const age = calculateAge(birthDate, today);

			if (age > 80) return { over80: true };
			return null;
		};
	}
}
