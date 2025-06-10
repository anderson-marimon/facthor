declare global {
	type TAccessInfo = {
		accessToken?: string;
		accessModule?: string;
		accessService?: TUserServices;
	};

	export type TUserServices = {
		service: string;
		method: TMethods;
	};

	type TApi<T> = {
		ok: boolean;
		internalCode: number;
		internalCodePrefix: string;
		message: string;
		error?: any;
		data: T;
	};

	type TPaginator = {
		Page: number;
		Size: number;
	};

	type TMethods = 'GET' | 'POST' | 'PUT';

	type Nullable<T> = T | null;

	type HtmlAttributes = {
		[key: string]: string | number;
	};

	type LucideIconData = readonly [string, HtmlAttributes][];
}

export {};
