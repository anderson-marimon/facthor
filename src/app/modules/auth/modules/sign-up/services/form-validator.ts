import { Injectable, WritableSignal } from '@angular/core';
import type { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { TSelectOption } from '@fresco-ui/frs-select/frs-select';
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

	public bankAccountNumber(getCurrentBankType: WritableSignal<TSelectOption[]>): ValidatorFn {
		return (control: AbstractControl): ValidationErrors | null => {
			const bankType = getCurrentBankType()[0]?.value ?? 1;
			const value = control.value ?? '';
			const regex = /^\d+$/;

			if (bankType === 1) {
				if (value.length !== 11) return { invalidSavingAccountBankMinMax: true };
			} else if (bankType === 2) {
				if (value.length < 10 || value.length > 12) return { invalidCheckingAccountBankMinMax: true };
			}

			if (!regex.test(value)) return { invalidBankAccountNumber: true };

			return null;
		};
	}

	public pdfFile(getFiles: () => File[]): ValidatorFn {
		return (): ValidationErrors | null => {
			const files = getFiles();
			if (!files || files.length === 0) return { required: true };

			const file = files[0];
			const allowedTypes = ['application/pdf'];
			const maxSize = 2 * 1024 * 1024;

			if (!allowedTypes.includes(file.type)) return { pdfInvalidFileType: true };
			if (file.size > maxSize) return { invalidFileSizeTwoMb: true };

			return null;
		};
	}

	public pdfFiles(getFiles: () => File[]): ValidatorFn {
		return (): ValidationErrors | null => {
			const files = getFiles();
			if (!files || files.length === 0) return { required: true };

			const allowedTypes = ['application/pdf'];
			const maxSize = 2 * 1024 * 1024;

			for (const file of files) {
				if (!allowedTypes.includes(file.type)) return { pdfInvalidFileType: true };
				if (file.size > maxSize) return { invalidFileSizeTwoMb: true };
			}

			return null;
		};
	}
}
