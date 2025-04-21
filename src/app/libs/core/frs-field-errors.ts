export const INPUT_ERRORS = {
    required: 'Obligatorio',
    requiredTrue: 'Must be true (e.g. accept terms)',
    email: 'Please enter a valid email address',
    min: 'Minimum allowed value is {min}',
    max: 'Maximum allowed value is {max}',
    minlength: 'Minimum',
    maxlength: 'Maximum {requiredLength} allowed',
    pattern: 'Invalid format',
} as const;

export type TInputErrorKey = keyof typeof INPUT_ERRORS;
