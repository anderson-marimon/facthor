import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function frs(...inputs: ClassValue[]): string {
	return twMerge(clsx(inputs));
}

export function frsGenerateId(): string {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
		const r = (Math.random() * 16) | 0;
		const v = c === 'x' ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
}

export function frsIsMobileDevice(): boolean {
	const userAgent = navigator.userAgent;
	return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
}

type InputFormatOptions = {
	mask: string;
	input: string;
	fill: string;
	regex: string;
	decorator?: string;
};

export function frsInputFormat(options: InputFormatOptions): [string, string] {
	const { mask, input, fill = '-', regex, decorator } = options;

	const maxLength = mask ? mask.replace(/[^x]/g, '').length : Number.POSITIVE_INFINITY;
	if (!maxLength) throw 'Invalid mask';

	let inputValue = input;
	if (decorator) {
		inputValue = inputValue.replace(new RegExp(`^${escapeRegExp(decorator)}\\s*`, 'g'), '');
	}

	inputValue = inputValue.replace(new RegExp(escapeRegExp(fill), 'g'), '');

	if (regex && regex !== '') {
		const regexPattern = new RegExp(regex, 'g');
		inputValue = inputValue.replace(regexPattern, '');
	}

	inputValue = inputValue.slice(0, maxLength);

	const groups = mask.split('-').map(group => group.length);
	let index = 0;
	let formatted = '';
	let original = '';

	for (let i = 0; i < groups.length; i++) {
		if (index >= inputValue.length) break;

		const segment = inputValue.slice(index, index + groups[i]);
		formatted += segment;
		original += segment;
		index += segment.length;

		if (i < groups.length - 1 && index < inputValue.length) {
			formatted += fill;
		}
	}

	const finalFormatted = original ? `${decorator ? `${decorator} ` : ''}${formatted}` : '';

	return [finalFormatted, original];
}

type NumberFormatOptions = {
	input: string;
	decimals?: boolean;
	decorator?: string;
	mask?: string;
	formatStyle?: 'European' | 'American';
};

export function frsNumberFormat(options: NumberFormatOptions): [string, string] {
	const { input, decimals, decorator, mask, formatStyle } = options;
	const decimalSeparator = formatStyle === 'American' ? '.' : ',';

	let cleanedValue = input.replace(/[^\d]/g, '');
	if (!cleanedValue) return ['', ''];

	if (cleanedValue === '00') {
		return ['', ''];
	}

	if (cleanedValue.startsWith('0')) {
		return decimals ? [`${decorator} 0${decimalSeparator}00`, '0.00'] : ['0', '0'];
	}

	let maxLength = mask ? mask.replace(/[^x]/g, '').length : Number.POSITIVE_INFINITY;
	if (!maxLength) throw 'Invalid mask';

	if (maxLength && decimals) maxLength = maxLength + 2;
	cleanedValue = cleanedValue.slice(0, maxLength);

	let integerPart = cleanedValue;
	let decimalPart = '';

	if (decimals && cleanedValue.length > 2) {
		integerPart = cleanedValue.slice(0, -2);
		decimalPart = cleanedValue.slice(-2);
	}

	const formattedInteger = formatWithSeparator(integerPart, formatStyle === 'American' ? ',' : '.');
	const formattedNumber = decimalPart ? `${formattedInteger}${decimalSeparator}${decimalPart}` : formattedInteger;

	const finalResult = cleanedValue ? (decorator ? `${decorator} ${formattedNumber}` : formattedNumber) : '';
	const originalValue = cleanedValue ? (decimalPart ? `${integerPart}.${decimalPart}` : integerPart) : '';
	return [finalResult, originalValue];
}

type PercentageFormatOptions = {
	input: string;
	decimals: boolean;
	formatStyle?: 'European' | 'American';
};

export function frsPercentageFormat(options: PercentageFormatOptions): [string, string] {
	const { input, decimals, formatStyle } = options;

	let cleanedValue = input.replace(/[^\d]/g, '').slice(0, decimals ? 5 : 3);
	if (!cleanedValue) return ['', ''];

	if (cleanedValue === '000' || cleanedValue === '0000') {
		return decimals ? ['% 0,00', '0.00'] : ['% 0', '0'];
	}

	if (cleanedValue === '1000') {
		return decimals ? ['% 99,99', '99.99'] : ['% 99', '99'];
	}

	if (cleanedValue === '100' || cleanedValue === '10000') {
		return decimals ? ['% 100,00', '100.00'] : ['% 100', '100'];
	}

	const maxLength = decimals ? 4 : 2;
	cleanedValue = cleanedValue.slice(0, maxLength);

	let integerPart = cleanedValue;
	let decimalPart = '';

	if (decimals && cleanedValue.length > 2) {
		integerPart = cleanedValue.slice(0, -2);
		decimalPart = cleanedValue.slice(-2);
	}

	const separator = formatStyle === 'American' ? '.' : ',';
	const formatted = decimals && decimalPart ? `${integerPart}${separator}${decimalPart}` : integerPart;

	const normalizedValue = formatted.replace(',', '.');

	return [`% ${formatted}`, normalizedValue];
}

function formatWithSeparator(value: string, separator: string): string {
	return value
		.split('')
		.reverse()
		.reduce((acc, char, index) => {
			return index > 0 && index % 3 === 0 ? `${char}${separator}${acc}` : `${char}${acc}`;
		}, '');
}

function escapeRegExp(string: string): string {
	return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function formatDateToMonthDayYear(date: Date): string {
	const months = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	];
	const day = date.getDate();
	const month = months[date.getMonth()];
	const year = date.getFullYear();

	function getDaySuffix(day: number): string {
		if (day > 3 && day < 21) return 'th';
		switch (day % 10) {
			case 1:
				return 'st';
			case 2:
				return 'nd';
			case 3:
				return 'rd';
			default:
				return 'th';
		}
	}

	return `${month} ${day}${getDaySuffix(day)}, ${year}`;
}

export function formatDateToISOShort(date: Date): `${string}-${string}-${string}` {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');

	return `${year}-${month}-${day}`;
}
