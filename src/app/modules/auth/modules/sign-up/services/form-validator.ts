import { Injectable } from '@angular/core';
import type { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
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

            if (nit.length < 6 || nit.length > 10) {
                return { invalidNitMinMax: true };
            }

            if (nit.length > 5 || nit.length < 11) {
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
}
