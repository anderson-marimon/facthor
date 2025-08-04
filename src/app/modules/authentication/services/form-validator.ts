import { Injectable, WritableSignal } from '@angular/core';
import type { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { TFile } from '@fresco-ui/frs-file-input/frs-file-input';
import { TSelectOption } from '@fresco-ui/frs-select/frs-select';
import { calculateAge } from '@shared/utils/calculate-age.util';
import { verificationNumberCalculator } from '@shared/utils/verification-number-calculator';

@Injectable({ providedIn: 'root' })
export class FormValidator {
	public text(optional = false): ValidatorFn {
		return (control: AbstractControl): ValidationErrors | null => {
			const { value = '' } = control;
			const regex = /^[a-zA-ZñÑ]+( [a-zA-ZñÑ]+)?( [a-zA-ZñÑ]+)?$/;

			if (optional && value === '') return null;

			if (!regex.test(value) || value.startsWith(' ') || value.endsWith(' ')) return { invalidName: true };
			return null;
		};
	}

	public firstName(optional = false): ValidatorFn {
		return (control: AbstractControl): ValidationErrors | null => {
			const value = control.value;

			if (optional && value === '') return null;

			if (value == null || value.trim() === '') {
				return { invalidName: true };
			}

			if (value.length > 60) {
				return { invalidName: true };
			}

			const regex = /^[a-zA-Z]+( [a-zA-Z]+)?$/;
			if (!regex.test(value)) {
				return { invalidName: true };
			}

			return null;
		};
	}

	public lastName(): ValidatorFn {
		return (control: AbstractControl): ValidationErrors | null => {
			const value = control.value;

			if (value == null || value.trim() === '') {
				return { invalidLegalRepFirstSurname: true };
			}

			if (value.length > 60) {
				return { invalidLegalRepFirstSurname: true };
			}

			const regex = /^[a-zA-ZñÑ]+( [a-zA-ZñÑ]+)?( [a-zA-ZñÑ]+)?$/;
			if (!regex.test(value)) {
				return { invalidLegalRepFirstSurname: true };
			}

			return null;
		};
	}

	public businessLegalName(optional = false): ValidatorFn {
		return (control: AbstractControl): ValidationErrors | null => {
			const { value = '' } = control;

			const basicRegex = /^[a-zA-Z0-9ñÑ.&]+( [a-zA-Z0-9ñÑ.&]+)*$/;
			const complexRegex =
				/^[a-zA-Z0-9ñÑ]+( [a-zA-Z0-9ñÑ]+)*( & [a-zA-Z0-9ñÑ]+( [a-zA-Z0-9ñÑ]+)*)*( [a-zA-Z0-9ñÑ]+\.[a-zA-Z0-9ñÑ]+(?:\.[a-zA-Z0-9ñÑ]+)*\.?)?$/;

			if (optional && value === '') return null;

			if (!basicRegex.test(value)) {
				return { invalidName: true };
			}

			if (!complexRegex.test(value)) {
				return { invalidName: true };
			}

			if (value.startsWith(' ') || value.endsWith(' ')) {
				return { invalidName: true };
			}

			return null;
		};
	}

	public businessTradeName(optional = false): ValidatorFn {
		return (control: AbstractControl): ValidationErrors | null => {
			const { value = '' } = control;
			const regex = /^[a-zA-Z0-9ñÑ]+( [a-zA-Z0-9ñÑ]+)*( & [a-zA-Z0-9ñÑ]+( [a-zA-Z0-9ñÑ]+)*)*$/;

			if (optional && value === '') return null;

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

			if (!regex.test(value)) return { invalidDni: true };
			if (value.length < 7 || value.length > 10) return { invalidDniMinMax: true };

			return null;
		};
	}

	public email(): ValidatorFn {
		return (control: AbstractControl): ValidationErrors | null => {
			const { value = '' } = control;
			const regex = /^[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*@[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*[.][a-zA-Z]{2,5}$/;

			if (!regex.test(value) || value.startsWith(' ') || value.endsWith(' ')) return { email: true };
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

	public expeditionDate(date: WritableSignal<Date | null>): ValidatorFn {
		return (control: AbstractControl): ValidationErrors | null => {
			const value = control.value;
			if (!value) return { expectedBirthDate: true };

			const expeditionDate = new Date(value);
			const birthDate = new Date(date() || new Date());
			const today = new Date();

			expeditionDate.setHours(0, 0, 0, 0);
			birthDate.setHours(0, 0, 0, 0);
			today.setHours(0, 0, 0, 0);

			const minExpeditionDate = new Date(birthDate.getFullYear() + 18, birthDate.getMonth(), birthDate.getDate());

			if (expeditionDate < minExpeditionDate) {
				return { expeditionTooEarly: true };
			}

			if (expeditionDate > today) {
				return { expeditionInFuture: true };
			}

			return null;
		};
	}

	public bankNumber(getCurrentBankType: WritableSignal<TSelectOption[]>): ValidatorFn {
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

	public pdfFile(files: TFile[]): ValidatorFn {
		return (): ValidationErrors | null => {
			if (!files || files.length === 0) return { required: true };

			const file = files[0];
			const allowedTypes = ['application/pdf'];
			const maxSize = 2 * 1024 * 1024;

			if (!allowedTypes.includes(file.type)) return { pdfInvalidFileType: true };
			if (file.size > maxSize) return { invalidFileSizeTwoMb: true };

			return null;
		};
	}

	public pdfFiles(files: TFile[]): ValidatorFn {
		return (): ValidationErrors | null => {
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

	public password(): ValidatorFn {
		return (control: AbstractControl): ValidationErrors | null => {
			const value: string = control.value ?? '';

			if (value.length < 8 || value.length > 20) {
				return { invalidPasswordMinMax: true };
			}

			const hasUpperCase = /[A-Z]/.test(value);
			const hasLowerCase = /[a-z]/.test(value);
			const hasNumber = /\d/.test(value);

			if (!hasUpperCase) return { missingUpperCase: true };
			if (!hasLowerCase) return { missingLowerCase: true };
			if (!hasNumber) return { missingNumber: true };

			return null;
		};
	}

	public confirmPassword(password: WritableSignal<string>): ValidatorFn {
		return (control: AbstractControl): ValidationErrors | null => {
			const value: string = control.value ?? '';

			if (value !== password()) return { passwordNotMatch: true };

			return null;
		};
	}
}
