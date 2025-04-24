export const INPUT_ERRORS = {
	required: 'Obligatorio',
	invalidName: 'El nombre no es válido',
	invalidNit: 'El NIT no es válido',
	invalidNitMinMax: 'mínimo 9 - máximo 10 caracteres',
	invalidDniMinMax: 'mínimo 7 - máximo 10 caracteres',
	invalidEmail: 'El correo electrónico no es válido',
	invalidPhoneNumber: 'El número de teléfono no es válido',
	invalidDate: 'Fecha inválida',
	invalidDateRange: 'Rango de fechas inválido',
	invalidVerificationNumberNit: 'El número de verificación no es válido',
	pendingVerificationNumber: 'Falta el número de verificación',
	under18: 'Debes ser mayor de 18 años',
	over80: 'Debes ser menor de 80 años',
	pattern: 'El formato no es válido',
} as const;

export type TInputErrorKey = keyof typeof INPUT_ERRORS;
