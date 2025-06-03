import { ResolveFn } from '@angular/router';
import { envs } from '@app/envs/envs';
import Cookies from 'js-cookie';

export const resolverGetAccessToken: ResolveFn<string> = (_, state) => {
	const token = Cookies.get(envs.FT_AUTHENTICATION_TOKEN_PATH);
	return token || '';
};
