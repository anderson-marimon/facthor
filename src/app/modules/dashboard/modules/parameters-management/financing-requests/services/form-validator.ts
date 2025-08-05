import { Injectable } from '@angular/core';
import type { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class FormValidator {
	public percentage(): ValidatorFn {
		return (control: AbstractControl): ValidationErrors | null => {
			const { value = '' } = control;

			if (value && value.at(-1) === '.') return { invalidPercentage: true };
			return null;
		};
	}
}