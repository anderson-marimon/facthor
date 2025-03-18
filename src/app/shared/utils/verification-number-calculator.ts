export function verificationNumberCalculator(nit: string): string {
	const _nit = nit.replace(/\s/g, '').replace(/,/g, '').replace(/\./g, '').replace(/-/g, '');

	if (Number.isNaN(Number(nit))) {
		throw new Error(`El NIT/cédula '${nit}' no es válido(a).`);
	}

	const coefficients: number[] = [3, 7, 13, 17, 19, 23, 29, 37, 41, 43, 47, 53, 59, 67, 71];
	const nitLength: number = nit.length;
	let checksum = 0;

	for (let i = 0; i < nitLength; i++) {
		const digit: number = Number(nit.charAt(i));
		const coefficient: number = coefficients[nitLength - i - 1];
		checksum += digit * coefficient;
	}

	const remainder: number = checksum % 11;
	return remainder > 1 ? String(11 - remainder) : String(remainder);
}
