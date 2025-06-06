declare global {
	type TAccessInfo = {
		accessToken: string;
		accessModule: string;
		accessService: string;
	};

	type TApi<T> = {
		ok: boolean;
		internalCode: number;
		internalCodePrefix: string;
		message: string;
		error?: any;
		data: T;
	};

	type Nullable<T> = T | null;

	type HtmlAttributes = {
		[key: string]: string | number;
	};

	type LucideIconData = readonly [string, HtmlAttributes][];
}

export {};
