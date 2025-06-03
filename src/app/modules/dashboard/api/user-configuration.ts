import { resource, ResourceLoaderParams, signal } from '@angular/core';
import { envs } from '@app/envs/envs';
import { AccessInterceptor } from '@dashboard/interceptors/access-interceptor';
import Cookies from 'js-cookie';

export type TUserConfig = Nullable<{
	colors: any | null;
	identity: TIdentity;
	roleExecutions: TRoleExecution[];
	permissions: TModulePermission[];
}>;

export type TIdentity = {
	legalName: string;
	tradeName: string;
	companyIdentification: number;
};

export type TRoleExecution = {
	id: number;
	name: string;
};

export type TModulePermission = {
	code: string;
	route: string;
	name: string;
	submodules: TSubmodulePermission[];
};

export type TSubmodulePermission = {
	code: string;
	route: string;
	name: string | null;
	services?: TService[];
	submodules?: TSubmodulePermission[];
};

export type TService = {
	code: string;
	urn: string;
	method: 'GET' | 'POST' | 'PUT' | 'DELETE';
	microservice: string;
};

type TApiUserConfig = TApi<TUserConfig>;

export class ApiGetUserConfiguration extends AccessInterceptor {
	private readonly _url = `${envs.FT_URL_LOGIN}${envs.FT_URN}`;
	private readonly _token = signal('');
	private readonly _resource = resource({
		request: this._token,
		loader: (token) => this._fetchUserInformation(token),
	});

	private async _fetchUserInformation(token: ResourceLoaderParams<string>) {
		if (token.request.length === 0) return null;

		const path = `${this._url}${envs.FT_AUTH_CONFIG_USER}`;

		const result = await this._HttpRequest<TApiUserConfig>({
			path,
			method: 'GET',
			signal: token.abortSignal,
			headers: { Authorization: `Bearer ${token.request}` },
		});

		console.log(result);
		return result.data;
	}

	public readonly configuration = this._resource.value;

	public getUserConfiguration(): void {
		const token = Cookies.get(envs.FT_AUTHENTICATION_TOKEN_PATH) || '';
		this._token.set(token);
	}
}
