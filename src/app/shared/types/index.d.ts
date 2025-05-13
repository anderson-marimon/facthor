declare type HtmlAttributes = {
	[key: string]: string | number;
};

declare global {
	type TApi<T> = {
		ok: boolean;
		internalCode: number;
		internalCodePrefix: string;
		message: string;
		data: T;
	};

	type Nullable<T> = T | null;

	type LucideIconData = readonly [string, HtmlAttributes][];
}

export {};
